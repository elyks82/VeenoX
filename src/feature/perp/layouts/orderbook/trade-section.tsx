import { FuturesAssetProps, TradeExtension } from "@/models";
import { getFormattedAmount, getFormattedDate } from "@/utils/misc";
import { FaSpinner } from "react-icons/fa6";

type TradeSectionProps = {
  asset: FuturesAssetProps;
  trades: TradeExtension[];
  isLoading?: boolean;
};

export const TradeSection = ({
  asset,
  trades,
  isLoading,
}: TradeSectionProps) => {
  return (
    <div className="max-h-[467px] sm:max-h-[668.5px] overflow-y-scroll relative">
      <table className="w-full">
        <thead>
          <tr className="text-font-60 text-xs font-normal sticky top-0 bg-secondary border-b border-borderColor-DARK ">
            <th className="pl-2.5 text-start pt-2 pb-1 font-normal">Price</th>
            <th className="text-end font-normal">Size</th>
            <th className="pr-2.5 text-end font-normal">Time</th>
          </tr>
        </thead>
        <tbody>
          {!trades?.length ? (
            <div className="w-full h-[460px] flex items-center justify-center">
              <FaSpinner className="text-white text-4xl" />
            </div>
          ) : (
            trades?.map((trade, i: number) => (
              <tr key={i} className="text-font-80 text-xs">
                <td
                  className={`pl-2.5 ${i === 0 ? "py-2" : "py-[5.2px]"} ${
                    trade.side === "BUY" ? "text-green" : "text-red"
                  }`}
                >
                  {getFormattedAmount(trade.price)}
                </td>
                <td
                  className={`py-1 text-end ${
                    trade.side === "BUY" ? "text-green" : "text-red"
                  }`}
                >
                  {trade.size}
                </td>
                <td className="text-end pr-2.5 py-1">
                  {getFormattedDate(trade.ts)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
