import { useGeneralContext } from "@/context";
import { triggerAlert } from "@/lib/toaster";
import { cn } from "@/utils/cn";
import {
  formatSymbol,
  getFormattedAmount,
  getFormattedDate,
} from "@/utils/misc";
import { useOrderEntry, usePoster } from "@orderly.network/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import { TPSLModal } from "./tp-sl-modal";

const tdStyle = `text-xs px-2.5 py-4 text-white whitespace-nowrap font-normal border-y border-borderColor text-end`;
enum Sections {
  POSITION = 0,
  PENDING = 1,
  TP_SL = 2,
  FILLED = 3,
  ORDER_HISTORY = 4,
}

export const RenderCells = ({
  order,
  activeSection,
  closePendingOrder,
}: any) => {
  const { isTPSLOpen, setIsTPSLOpen, setOrderPositions } = useGeneralContext();
  const { ref, toDataURL, toBlob, download, copy } = usePoster({
    backgroundColor: "#0b8c70",
    backgroundImg: "/logo/veeno.png",
    color: "rgba(255, 255, 255, 0.98)",
    profitColor: "rgb(0,181,159)",
    fontFamily: "Poppins, Inter, sans-serif",
    lossColor: "rgb(255,103,194)",
    brandColor: "rgb(0,181,159)",

    // ...
  });

  const [imagePreview, setImagePreview] = useState(null);
  const handlePreview = () => {
    const imageUrl = toDataURL();
    setImagePreview(imageUrl as never);
  };

  const { onSubmit } = useOrderEntry(
    {
      symbol: order.symbol,
      side: (order.position_qty as number) >= 0 ? "SELL" : ("BUY" as any),
      order_type: "MARKET" as any,
      order_quantity: order?.position_qty,
    },
    { watchOrderbook: true }
  );

  return (
    <>
      {renderCommonCells(order)}
      {renderAdditionalCells(
        order,
        activeSection,
        closePendingOrder,
        setIsTPSLOpen,
        setOrderPositions,
        onSubmit
      )}
      {isTPSLOpen ? <TPSLModal order={order} /> : null}
    </>
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
  closePendingOrder: Function,
  setIsTPSLOpen: Dispatch<SetStateAction<boolean>>,
  setOrderPositions: any,
  onSubmit: any
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
            onClick={() => {
              closePendingOrder(trade.order_id);
              setOrderPositions([]);
            }}
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
        <td
          className={cn(
            tdStyle,
            `${
              trade?.position_qty > 0
                ? "text-green"
                : trade?.position_qty < 0
                ? "text-red"
                : "text-white"
            } font-medium`
          )}
        >
          {trade.position_qty}
        </td>
        <td className={tdStyle}>
          {getFormattedAmount(trade.average_open_price)}
        </td>
        <td className={tdStyle}>{getFormattedAmount(trade.mark_price)}</td>
        <td className={tdStyle}>{getFormattedAmount(trade.est_liq_price)}</td>
        <td
          className={cn(
            tdStyle,
            `${
              trade?.unrealized_pnl > 0
                ? "text-green"
                : trade?.unrealized_pnl < 0
                ? "text-red"
                : "text-white"
            } font-medium`
          )}
        >
          {getFormattedAmount(trade.unrealized_pnl)}
        </td>
        <td className={tdStyle}>
          <div className="flex flex-col w-full h-full  text-white">
            <p className="mb-1">
              <span className="text-green font-bold">TP</span>{" "}
              {trade.tp_trigger_price || "--"}
            </p>
            <p>
              <span className="text-red font-bold">SL</span>{" "}
              {trade.sl_trigger_price || "--"}
            </p>
          </div>
        </td>
        <td className={tdStyle}>{getFormattedAmount(trade.cost_position)}</td>
        <td className={tdStyle}>{getFormattedAmount(trade.mm)}</td>
        <td className={cn(tdStyle, "")}>
          {getFormattedAmount(trade.settle_price)}
        </td>
        <td className={cn(tdStyle, "pr-5")}>
          <div className="w-full h-full justify-end items-center flex">
            <button
              onClick={() => setIsTPSLOpen(true)}
              className="text-white bg-terciary border border-base_color text-bold font-poppins text-xs
            h-[30px] px-2.5 rounded flex items-center
        "
            >
              TP/SL
            </button>
            <button
              onClick={async () => {
                const qty = trade.position_qty as number;
                const side = qty >= 0 ? "SELL" : "BUY";

                const cancelOrder: any = {
                  symbol: trade.symbol,
                  side: side as any,
                  order_type: "MARKET" as any,
                  order_price: undefined,
                  order_quantity: Math.abs(qty as number),
                  trigger_price: undefined,
                  reduce_only: true,
                };

                try {
                  console.log("Submitting order:", cancelOrder);
                  await onSubmit(cancelOrder);
                  triggerAlert("Success", "Position is successfully closed");
                  setOrderPositions([]);
                } catch (e) {
                  console.log("Error closing position:", e);
                  triggerAlert(
                    "Error",
                    "Failed to close position. Please try again."
                  );
                }
              }}
              className="h-[30px] w-fit px-2.5 text-xs ml-2.5 text-white bg-base_color border-borderColor-DARK rounded"
            >
              Close {trade.symbol}
            </button>
          </div>
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
