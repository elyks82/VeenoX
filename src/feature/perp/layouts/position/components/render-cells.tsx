import { useGeneralContext } from "@/context";
import { triggerAlert } from "@/lib/toaster";
import { PosterModal } from "@/modals/poster";
import { cn } from "@/utils/cn";
import {
  formatSymbol,
  getFormattedAmount,
  getFormattedDate,
} from "@/utils/misc";
import { useOrderEntry } from "@orderly.network/hooks";
import { Dispatch, SetStateAction } from "react";
import { EditModal } from "./edit-modal";
import { TPSLModal } from "./tp-sl-modal";

const tdStyle = `text-xs px-2.5 pt-3 pb-0 text-white whitespace-nowrap font-normal text-start`;
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
  const {
    TPSLOpenOrder,
    setTPSLOpenOrder,
    setOrderPositions,
    editPendingPositionOpen,
    setEditPendingPositionOpen,
  } = useGeneralContext();
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
        setTPSLOpenOrder,
        setOrderPositions,
        onSubmit,
        setEditPendingPositionOpen
      )}
      {TPSLOpenOrder ? <TPSLModal order={order} /> : null}
      {editPendingPositionOpen ? <EditModal /> : null}
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
  setTPSLOpenOrder: Dispatch<SetStateAction<boolean>>,
  setOrderPositions: any,
  onSubmit: any,
  setEditPendingPositionOpen: Dispatch<SetStateAction<boolean>>
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
        <td className={cn(tdStyle, "pr-5 text-end")}>
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
          <div className="flex items-center justify-end w-full h-full">
            <button
              onClick={() => {
                setEditPendingPositionOpen(trade);
                setOrderPositions([]);
              }}
              className="text-white bg-terciary border border-base_color text-bold font-poppins text-xs
              h-[25px] px-2 rounded flex items-center
          "
            >
              Edit
            </button>
            <button
              onClick={() => {
                closePendingOrder(trade.order_id);
                setOrderPositions([]);
              }}
              className="h-[25px] w-fit px-2 text-xs ml-2.5 text-white bg-base_color border-borderColor-DARK rounded"
            >
              Close
            </button>{" "}
          </div>
        </td>
      </>
    );
  } else if (section === Sections.POSITION) {
    const initialMargin =
      Math.abs(trade.position_qty) *
      trade.mark_price *
      trade.IMR_withdraw_orders;
    const totalMargin = initialMargin + trade.unrealized_pnl;
    const maintenanceMargin =
      Math.abs(trade.position_qty) * trade.mark_price * trade.MMR_with_orders;

    console.log("rrr", trade);
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
          {trade.position_qty} {formatSymbol(trade.symbol, true)}
        </td>
        <td className={tdStyle}>
          {getFormattedAmount(trade.average_open_price)}
        </td>
        <td className={tdStyle}>{getFormattedAmount(trade.mark_price)}</td>

        <td
          className={cn(
            tdStyle,
            `${
              trade.unrealized_pnl > 0
                ? "text-green"
                : trade.unrealized_pnl < 0
                ? "text-red"
                : "text-white"
            }`
          )}
        >
          <div className="flex items-center justify-start w-full h-full">
            <p className="mr-2">
              {`${
                trade.unrealized_pnl > 0
                  ? `+$${Math.abs(trade.unrealized_pnl).toFixed(
                      2
                    )} (${trade.unrealized_pnl_ROI.toFixed(2)})`
                  : `-$${Math.abs(trade.unrealized_pnl).toFixed(
                      2
                    )} (${trade.unrealized_pnl_ROI.toFixed(2)})`
              }`}{" "}
            </p>
            <PosterModal order={trade} />
          </div>
        </td>
        <td className={tdStyle}>
          <div className="flex items-center justify-start w-full h-full text-font-80">
            <p
              className={`${
                trade.tp_trigger_price ? "text-green" : "text-white"
              }`}
            >
              {trade.tp_trigger_price || "--"}
            </p>
            /
            <p
              className={`${
                trade.sl_trigger_price ? "text-red" : "text-white"
              }`}
            >
              {trade.sl_trigger_price || "--"}
            </p>
          </div>
        </td>
        <td className={tdStyle}>{getFormattedAmount(trade.est_liq_price)}</td>
        <td className={tdStyle}>{getFormattedAmount(trade.cost_position)}</td>
        <td className={tdStyle}>${totalMargin.toFixed(2)}</td>
        <td className={cn(tdStyle, "")}>
          {getFormattedAmount(trade.notional)}
        </td>
        <td className={cn(tdStyle, "pr-5")}>
          <div className="w-full h-full justify-end items-center flex">
            <button
              onClick={() => setTPSLOpenOrder(trade)}
              className="text-white bg-terciary border border-base_color text-bold font-poppins text-xs
            h-[25px] px-2 rounded flex items-center
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
                  await onSubmit(cancelOrder);
                  triggerAlert("Success", "Position is successfully closed");
                  setOrderPositions(["closed"]);
                } catch (e) {
                  triggerAlert(
                    "Error",
                    "Failed to close position. Please try again."
                  );
                }
              }}
              className="h-[25px] w-fit px-2 text-xs ml-2.5 text-white bg-base_color border-borderColor-DARK rounded"
            >
              Close
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
        <td className={cn(tdStyle, "pr-5 text-end")}>
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
        <td className={cn(tdStyle, "pr-5 text-end")}>
          {getFormattedDate(trade.created_time)}
        </td>
      </>
    );
  }
  return null;
};
