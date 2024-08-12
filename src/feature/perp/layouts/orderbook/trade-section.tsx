import { FuturesAssetProps, TradeExtension } from "@/models";
import { getFormattedAmount, getFormattedDate } from "@/utils/misc";

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
    <div className="h-[467px] md:h-calc-full-button overflow-y-scroll relative">
      <table className="w-full">
        <thead>
          <tr className="text-font-60 text-xs font-normal sticky top-0 bg-secondary border-b border-borderColor-DARK ">
            <th className="pl-2.5 text-start py-1 font-normal">Price</th>
            <th className="text-end font-normal">Size</th>
            <th className="pr-2.5 text-end font-normal">Time</th>
          </tr>
        </thead>
        <tbody>
          {!trades?.length ? (
            <div className="w-full h-[460px] sm:h-[550px] flex items-center justify-center">
              <img src="/loader/loader.gif" className="w-[150px]" />
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
