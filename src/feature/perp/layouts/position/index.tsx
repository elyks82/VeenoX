import { useGeneralContext } from "@/context";
import { triggerAlert } from "@/lib/toaster";
import { FuturesAssetProps } from "@/models";
import { getFormattedAmount, getTokenPercentage } from "@/utils/misc";
import {
  useOrderEntry,
  useOrderStream,
  usePositionStream,
} from "@orderly.network/hooks";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RenderCells } from "./components/render-cells";
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

export const Position = ({ asset }: PositionProps) => {
  const [activeSection, setActiveSection] = useState(Sections.POSITION);
  const sections = ["Positions", "Pending", "TP/SL", "Filled", "Order History"];
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { setOrderPositions, orderPositions } = useGeneralContext();
  const [underlineStyle, setUnderlineStyle] = useState<{
    width: string;
    left: string;
  }>({ width: "20%", left: "0%" });
  const [data] = usePositionStream();
  const [orders, { cancelOrder }] = useOrderStream({ symbol: asset.symbol });

  useEffect(() => {
    if (!orderPositions?.length && (data?.rows?.length as number) > 0) {
      setOrderPositions(data?.rows as any);
    }
  }, [data?.rows]);

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

  const closePendingOrder = async (id: number) => {
    await cancelOrder(id, asset?.symbol);
    triggerAlert("Success", "Pending order successfully closed");
  };

  const filterSide = (entry: any) => {
    if (activeSection === 1)
      return (
        entry.total_executed_quantity < entry.quantity &&
        entry.type === "LIMIT" &&
        entry.status !== "COMPLETED" &&
        entry.status !== "FILLED" &&
        entry.status !== "CANCELLED"
      );
    return true;
  };

  const getPnLChange = () => {
    const arr =
      data?.rows?.map((row) => ({
        open_price: row.average_open_price,
        mark_price: row.mark_price,
      })) || [];

    const total = arr.reduce(
      (acc, curr) => {
        acc.open_price += curr.open_price;
        acc.mark_price += curr.mark_price;
        return acc;
      },
      { open_price: 0, mark_price: 0 }
    );

    const totalPnL = total.mark_price - total.open_price;
    const pnlPercentage = (totalPnL / total.open_price) * 100;

    return Math.abs(pnlPercentage);
  };

  const pnl_change = getPnLChange();

  const getEmptyMessageFromActiveSection = () => {
    switch (activeSection) {
      case Sections.POSITION:
        return "No open order";
      case Sections.FILLED:
        return "No filled position";
      case Sections.ORDER_HISTORY:
        return "No history";
      case Sections.PENDING:
        return "No pending order";
      case Sections.TP_SL:
        return "No TP/SL order";
      default:
        return "No open order";
    }
  };

  const noOrderMessage = getEmptyMessageFromActiveSection();

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center border-b border-borderColor-DARK">
        <div className="flex items-center relative">
          {sections.map((section, index) => (
            <button
              key={index}
              ref={(el) => (buttonRefs.current[index] = el) as any}
              className={`text-xs sm:text-[13px] p-2.5 ${
                activeSection === index ? "text-white" : "text-font-60"
              }`}
              onClick={() => setActiveSection(index)}
            >
              {section}
            </button>
          ))}
          <div
            className="h-[1px] w-[20%] absolute bottom-[-1px] bg-base_color transition-all duration-200 ease-in-out"
            style={{ width: underlineStyle.width, left: underlineStyle.left }}
          />
        </div>
      </div>
      {activeSection === Sections.POSITION ? (
        <div className="p-2.5 flex items-center gap-5">
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
              {getTokenPercentage(pnl_change)}%)
            </p>
          </div>
          <div>
            <p className="text-xs text-font-60 mb-[3px]">Notional</p>
            <p className="text-base text-white font-medium">
              {getFormattedAmount(data?.aggregated.notional)}
            </p>
          </div>
        </div>
      ) : null}
      <div className="overflow-x-scroll min-h-[300px] max-h-[300px] overflow-y-scroll w-full no-scrollbar">
        <table className="w-full ">
          <thead>
            <tr>
              {thead[activeSection].map((title: string, i: number) => {
                const isFirst = i === 0;
                const isLast = i === thead[activeSection].length - 1;
                return (
                  <th
                    key={i}
                    className={`text-xs ${isFirst ? "pl-5" : ""} ${
                      isLast ? "pr-5 text-end" : "text-start"
                    } px-2.5 py-2 text-font-60 whitespace-nowrap ${
                      activeSection === Sections.POSITION
                        ? "border-y"
                        : "border-b"
                    } font-normal border-borderColor-DARK`}
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
                  <tr
                    key={i}
                    className="flex flex-col justify-center text-xs text-white items-center absolute h-[260px] left-1/2"
                  >
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <Image
                        src="/empty/no-result.svg"
                        height={50}
                        width={100}
                        alt="Empty position image"
                        className="mt-2"
                      />
                      <p className="mt-2">{noOrderMessage}</p>{" "}
                    </div>
                  </tr>
                );
              }
              return (
                <tr key={i}>
                  <RenderCells
                    order={order}
                    activeSection={activeSection}
                    closePendingOrder={closePendingOrder}
                  />
                </tr>
              );
            })}
            {!orders?.length && activeSection !== Sections.POSITION ? (
              <tr className="flex flex-col justify-center text-xs text-white items-center absolute h-[260px] left-1/2">
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src="/empty/no-result.svg"
                    height={50}
                    width={100}
                    alt="Empty position image"
                    className="mt-2"
                  />
                  <p className="mt-2">{noOrderMessage}</p>{" "}
                </div>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};
