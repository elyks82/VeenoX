import { triggerAlert } from "@/lib/toaster";
import { FuturesAssetProps } from "@/models";
import { cn } from "@/utils/cn";
import {
  formatSymbol,
  getFormattedAmount,
  getFormattedDate,
  getTokenPercentage,
} from "@/utils/misc";
import {
  useOrderEntry,
  useOrderStream,
  usePositionStream,
} from "@orderly.network/hooks";
import { useEffect, useRef, useState } from "react";
import { thead } from "./constants";

type PositionProps = {
  asset: FuturesAssetProps;
};

enum Sections {
  POSITION = 0,
  PENDING = 1,
  TP_SL = 2,
  FILLED = 3,
  ORDER_HISTORY = 4,
}

const tdStyle = `text-xs px-2.5 py-4 text-font-80 whitespace-nowrap font-normal border-y border-borderColor text-end`;

export const Position = ({ asset }: PositionProps) => {
  const [activeSection, setActiveSection] = useState(Sections.POSITION);
  const sections = ["Positions", "Pending", "TP/SL", "Filled", "Order History"];
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState<{
    width: string;
    left: string;
  }>({ width: "20%", left: "0%" });
  const [data, proxy, state] = usePositionStream();
  const [orders, { cancelOrder }] = useOrderStream({ symbol: asset.symbol });

  useEffect(() => {
    const updateUnderline = () => {
      const button = buttonRefs.current[activeSection];
      if (button) {
        const { offsetWidth, offsetLeft } = button;
        setUnderlineStyle({
          width: `${offsetWidth}px`,
          left: `${offsetLeft}px`,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeSection]);

  const { onSubmit } = useOrderEntry(
    {
      symbol: asset.symbol,
      side: "SELL" as any,
      order_type: "MARKET" as any,
      order_quantity: data.rows?.[0]?.position_qty,
    },
    { watchOrderbook: true }
  );

  const closeTrade = async () => {
    const cancelOrder = {
      symbol: asset.symbol,
      side: "SELL",
      order_type: "MARKET",
      order_price: undefined,
      order_quantity: data.rows?.[0].position_qty,
      trigger_price: undefined,
      reduce_only: true,
    };
    try {
      await onSubmit(cancelOrder as any);
      triggerAlert("Success", "Trade is successfully closed");
    } catch (e) {
      console.log("e", e);
    }
  };

  console.log("stream", data, orders);

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center border-b border-borderColor ">
        <div className="flex items-center relative">
          {sections.map((section, index) => (
            <button
              key={index}
              ref={(el) => (buttonRefs.current[index] = el) as any}
              className={`text-xs sm:text-sm text-white font-bold p-2.5 ${
                activeSection === index ? "font-bikd" : ""
              }`}
              onClick={() => setActiveSection(index)}
            >
              {section}
            </button>
          ))}
          <div
            className="h-0.5 w-[20%] absolute bottom-0 bg-white transition-all duration-200 ease-in-out"
            style={{ width: underlineStyle.width, left: underlineStyle.left }}
          />
        </div>
      </div>
      <div className="p-2.5 flex items-center gap-5">
        {/* <p>unsettledPnL: {data?.aggregated.unsettledPnL}</p> */}
        <div>
          <p className="text-xs text-font-60 mb-[3px]">Notional</p>
          <p className="text-base text-white font-medium">
            {getFormattedAmount(data?.aggregated.notional)}
          </p>
        </div>
        <div>
          <p className="text-xs text-font-60 mb-[3px]">Unreal. PnL</p>
          <p
            className={`text-base  font-medium ${
              data?.aggregated.unrealPnL === 0
                ? "text-white"
                : data?.aggregated.unrealPnL > 0
                ? "text-green"
                : "text-red"
            }`}
          >
            {getFormattedAmount(data?.aggregated.unrealPnL)} (
            {getTokenPercentage(data?.aggregated.unrealPnlROI)}%)
          </p>
        </div>
      </div>
      <div className="overflow-x-scroll min-h-[300px] w-full no-scrollbar">
        <table className="w-full">
          <thead>
            <tr>
              {thead[activeSection].map((title: string, i: number) => {
                const odd = i % 2 === 0;
                const isFirst = i === 0;
                const isLast = i === thead[activeSection].length - 1;
                return (
                  <th
                    key={i}
                    className={`text-xs ${
                      isFirst ? "text-start pl-5" : "text-end "
                    } ${
                      isLast ? "pr-5" : ""
                    } px-2.5 py-2.5 text-font-80 whitespace-nowrap font-normal border-y border-borderColor`}
                  >
                    {title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="text-white">
            {(activeSection === 0 ? data?.rows : orders)?.map((order, i) => {
              return (
                <tr key={i}>
                  {renderCommonCells(order)}
                  {renderAdditionalCells(order, activeSection, closeTrade)}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="text-white font-medium p-5">
          <p>Unreal: {data?.aggregated.unrealPnL}</p>
          <p>NOTIONAL: {data?.aggregated.notional}</p>
          <p>unrealPnlROI : {data?.aggregated.unrealPnlROI}</p>
          <p>unsettledPnL: {data?.aggregated.unsettledPnL}</p>
          <button
            className="mt-4 bg-red px-2 py-1 rounded"
            onClick={closeTrade}
          >
            TOOF OFR
          </button>
        </div>
      </div>
    </div>
  );
};

const renderCommonCells = (trade) => (
  <>
    <td className={cn(tdStyle, "text-start pl-5")}>
      <div className="h-full w-full flex items-center">
        <img
          className="w-4 h-4 rounded-full mr-2"
          height={16}
          width={16}
          alt={`${trade.symbol} logo`}
          src={`https://oss.orderly.network/static/symbol_logo/${formatSymbol(
            trade.symbol,
            true
          )}.png`}
        />
        {formatSymbol(trade.symbol)}
      </div>
    </td>
  </>
);

const renderAdditionalCells = (
  trade,
  section: Sections,
  closeTrade: Function
) => {
  if (section === Sections.FILLED) {
    return (
      <>
        <td className={tdStyle}>{trade.type}</td>
        <td
          className={cn(
            tdStyle,
            `${trade.side === "SELL" ? "text-red" : "text-green"}`
          )}
        >
          {trade.side}
        </td>
        <td className={tdStyle}>{trade.total_executed_quantity}</td>
        <td className={tdStyle}>{trade.average_executed_price}</td>
        <td className={tdStyle}>--</td>
        <td className={tdStyle}>--</td>
        <td className={tdStyle}>
          {getFormattedAmount(trade.quantity * trade.average_executed_price)}
        </td>
        <td className={tdStyle}>{trade.total_fee}</td>
        <td className={tdStyle}>{trade.status}</td>
        <td className={tdStyle}>{trade.reduce_only ? "Yes" : "No"}</td>
        <td className={tdStyle}>No</td>
        <td className={cn(tdStyle, "pr-5")}>
          {getFormattedDate(trade.created_time)}
        </td>
      </>
    );
  } else if (section === Sections.PENDING) {
    return (
      <>
        <td className={tdStyle}>{trade.type}</td>
        <td
          className={cn(
            tdStyle,
            `${trade.side === "SELL" ? "text-red" : "text-green"}`
          )}
        >
          {trade.side}
        </td>
        <td className={tdStyle}>--</td>
        <td className={tdStyle}>{trade.total_executed_quantity}</td>
        <td className={tdStyle}>{trade.average_executed_price}</td>
        <td className={tdStyle}>--</td>
        <td className={tdStyle}>
          {getFormattedAmount(
            trade.total_executed_quantity * trade.average_executed_price
          )}
        </td>
        <td className={tdStyle}>No</td>
        <td className={tdStyle}>{trade.reduce_only ? "Yes" : "No"}</td>
        <td className={cn(tdStyle, "pr-5")}>
          {getFormattedDate(trade.created_time)}
        </td>
      </>
    );
  } else if (section === Sections.POSITION) {
    return (
      <>
        <td className={tdStyle}>{trade.position_qty}</td>
        <td className={tdStyle}>{trade.average_open_price}</td>
        <td className={tdStyle}>{trade.mark_price}</td>
        <td className={tdStyle}>{trade.est_liq_price}</td>
        <td className={tdStyle}>{getFormattedAmount(trade.unrealized_pnl)}</td>
        <td className={tdStyle}>
          <div className="flex flex-col w-full h-full">
            <p>TP: {trade.tp_trigger_price || "--"}</p>
            <p>SL: {trade.sl_trigger_price || "--"}</p>
          </div>
        </td>
        <td className={tdStyle}>{trade.cost_position}</td>
        <td className={tdStyle}>{trade.mm}</td>
        <td className={cn(tdStyle, "")}>{trade.settle_price}</td>
        <td className={cn(tdStyle, "pr-5")}>
          <button
            onClick={closeTrade}
            className="h-[30px] w-fit px-2 text-xs text-white bg-terciary border-borderColor-DARK rounded"
          >
            Close
          </button>
        </td>
      </>
    );
  } else if (section === Sections.ORDER_HISTORY) {
    return (
      <>
        <td className={tdStyle}>{trade.type}</td>
        <td
          className={cn(
            tdStyle,
            `${trade.side === "SELL" ? "text-red" : "text-green"}`
          )}
        >
          {trade.side}
        </td>
        <td className={tdStyle}>{trade.total_executed_quantity}</td>
        <td className={tdStyle}>
          {getFormattedAmount(trade.average_executed_price)}
        </td>

        <td className={tdStyle}>--</td>
        <td className={tdStyle}>--</td>
        <td className={tdStyle}>
          {getFormattedAmount(
            trade.total_executed_quantity * trade.average_executed_price
          )}
        </td>
        <td className={tdStyle}>{trade.total_fee}</td>
        <td className={tdStyle}>{trade.status}</td>
        <td className={tdStyle}>{trade.reduce_only ? "Yes" : "No"}</td>
        <td className={tdStyle}>No</td>
        <td className={cn(tdStyle, "pr-5")}>
          {getFormattedDate(trade.created_time)}
        </td>
      </>
    );
  } else if (section === Sections.TP_SL) {
    return (
      <>
        <td
          className={cn(
            tdStyle,
            `${trade.side === "SELL" ? "text-red" : "text-green"}`
          )}
        >
          {trade.side}
        </td>
        <td className={tdStyle}>{trade.total_executed_quantity}</td>
        <td className={tdStyle}>--</td>
        <td className={tdStyle}>
          {getFormattedAmount(trade.average_executed_price)}
        </td>
        <td className={tdStyle}>--</td>
        <td className={tdStyle}>{trade.reduce_only ? "Yes" : "No"}</td>
        <td className={cn(tdStyle, "pr-5")}>
          {getFormattedDate(trade.created_time)}
        </td>
      </>
    );
  }
  return null;
};
