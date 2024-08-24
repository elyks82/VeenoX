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
  useCollateral,
  useOrderEntry,
  useOrderStream,
  usePositionStream,
} from "@orderly.network/hooks";
import Image from "next/image";
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
  const {
    totalCollateral,
    freeCollateral: freeCollat,
    totalValue,
    availableBalance,
    unsettledPnL,
    positions,
    accountInfo,
  } = useCollateral({
    dp: 2,
  });
  console.log("positions", positions);
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
      side:
        (data?.rows?.[0]?.position_qty as number) >= 0
          ? "SELL"
          : ("BUY" as any),
      order_type: "MARKET" as any,
      order_quantity: data.rows?.[0]?.position_qty,
    },
    { watchOrderbook: true }
  );

  const closeTrade = async (i: number) => {
    const cancelOrder = {
      symbol: asset.symbol,
      side: (data?.rows?.[0]?.position_qty as number) >= 0 ? "SELL" : "BUY",
      order_type: "MARKET",
      order_price: undefined,
      order_quantity: Math.abs(data.rows?.[0].position_qty as number),
      trigger_price: undefined,
      reduce_only: true,
    };
    try {
      await onSubmit(cancelOrder as any);
      triggerAlert("Success", "Position is successfully closed");
    } catch (e) {
      console.log("e", e);
    }
  };

  const closePendingOrder = async (id: number) => {
    const res = await cancelOrder(id, asset?.symbol);
    triggerAlert("Success", "Pending order successfully closed");
  };

  console.log("stream", data, orders);

  const filterSide = (entry: any) => {
    if (activeSection === 1)
      return (
        entry?.total_executed_quantity !== entry?.quantity &&
        entry.status !== "CANCELLED"
      );
    return true;
  };

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
      <div className="overflow-x-scroll h-[300px] overflow-y-scroll w-full no-scrollbar">
        <table className="w-full ">
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
          <tbody className="text-white relative">
            {(activeSection === 0
              ? (data?.rows?.length as number) > 0
                ? data.rows
                : Array.from({ length: 1 })
              : orders
                  ?.filter(filterSide)
                  ?.sort((a, b) => b.updated_time - a.updated_time)
            )?.map((order, i) => {
              if (
                (activeSection === 0 && !data?.rows?.length) ||
                (activeSection > 0 && !orders?.length)
              ) {
                return (
                  <div
                    key={i}
                    className="flex flex-col pb-7 justify-center text-xs text-white items-center absolute h-[300px] left-1/2"
                  >
                    <Image
                      src="/empty/no-result.svg"
                      height={50}
                      width={100}
                      alt="Empty position image"
                    />
                    <p className="mt-2">No trade open</p>
                  </div>
                );
              }

              return (
                <tr key={i}>
                  {renderCommonCells(order)}
                  {renderAdditionalCells(
                    order,
                    activeSection,
                    closeTrade,
                    i,
                    closePendingOrder
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const renderCommonCells = (trade: any) => (
  <>
    <td className={cn(tdStyle, "text-start pl-5")}>
      <div className="h-full w-full flex items-center">
        <img
          className="w-4 h-4 rounded-full mr-2"
          height={16}
          width={16}
          alt={`${trade?.symbol} logo`}
          src={`https://oss.orderly.network/static/symbol_logo/${formatSymbol(
            trade?.symbol ? trade?.symbol : "PERP_TEST_TECJ",
            true
          )}.png`}
        />
        {trade?.symbol ? formatSymbol(trade.symbol) : "TEST"}
      </div>
    </td>
  </>
);

const renderAdditionalCells = (
  trade: any,
  section: Sections,
  closeTrade: Function,
  i: number,
  closePendingOrder: Function
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
    const toPercentage = (): number => {
      if (trade?.quantity === 0) return 0;
      return (trade?.total_executed_quantity / trade?.quantity) * 100;
    };
    const percentageFilled = toPercentage();
    return (
      <>
        <td className={tdStyle}>{trade?.type}</td>
        <td
          className={cn(
            tdStyle,
            `${trade?.side === "SELL" ? "text-red" : "text-green"}`
          )}
        >
          {trade?.side}
        </td>
        <td className={tdStyle}>--</td>
        <td className={tdStyle}>
          <div className="w-full h-full flex flex-col items-end">
            <div className="h-[5px] w-[100px] rounded bg-terciary">
              <div
                className={`h-full bg-base_color rounded`}
                style={{
                  width: `${percentageFilled}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between w-[100px] mt-1.5">
              <p className="text-white text-[11px]">
                {trade?.total_executed_quantity || 0} / {trade?.quantity || 0}
              </p>
              <p className="text-white text-[11px]">{percentageFilled || 0}%</p>
            </div>
          </div>
        </td>
        <td className={tdStyle}>{trade?.price}</td>
        <td className={tdStyle}>--</td>
        <td className={tdStyle}>
          {getFormattedAmount(trade?.quantity * trade?.price)}$
        </td>
        <td className={tdStyle}>No</td>
        <td className={tdStyle}>{trade?.reduce_only ? "Yes" : "No"}</td>
        <td className={cn(tdStyle, "pr-5")}>
          {getFormattedDate(trade?.created_time)}
        </td>
        <td className={cn(tdStyle, "pr-5")}>
          <button
            onClick={() => closePendingOrder(trade.order_id)}
            className="h-[30px] w-fit px-2 text-xs text-white bg-terciary border-borderColor-DARK rounded"
          >
            Close
          </button>
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
            onClick={() => closeTrade(i)}
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
