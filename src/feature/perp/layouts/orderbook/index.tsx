import { FuturesAssetProps } from "@/models";
import { getFormattedAmount, getFormattedDate } from "@/utils/misc";
import { useMarketTradeStream } from "@orderly.network/hooks";
import { useState } from "react";

enum OrderbookSection {
  ORDERBOOK,
  TRADE_HISTORY,
}

type OrderbookProps = {
  asset: FuturesAssetProps;
};

export const Orderbook = ({ asset }: OrderbookProps) => {
  const [activeSection, setActiveSection] = useState(
    OrderbookSection.ORDERBOOK
  );

  const { data: trades, isLoading } = useMarketTradeStream(asset?.symbol);

  return (
    <section>
      <div className="flex items-center w-full h-[44px] relative">
        <button
          className="w-1/2 h-full text-white text-sm"
          onClick={() => setActiveSection(0)}
        >
          Orderbook
        </button>
        <button
          className="w-1/2 h-full text-white text-sm"
          onClick={() => setActiveSection(1)}
        >
          Trade History
        </button>
      </div>
      <div className="bg-terciary h-[1px] w-full relative">
        <div
          className={`h-[1px] w-1/2 bottom-0 transition-all duration-200 ease-in-out bg-slate-400 absolute ${
            !activeSection ? "left-0" : "left-1/2"
          }`}
        />
      </div>
      <div className="max-h-[670px] overflow-y-scroll relative">
        <table className="w-full">
          <thead>
            <tr className="text-white text-xs font-normal sticky top-0 bg-secondary border-b border-borderColor-DARK ">
              <th className="pl-2.5 text-start pt-2 pb-1">Price</th>
              <th className="text-end border-b border-borderColor-DARK">
                Size
              </th>
              <th className="pr-2.5 text-end border-b border-borderColor-DARK">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? "Loading..."
              : trades?.map((trade, i: number) => (
                  <tr key={i} className="text-white text-xs">
                    <td
                      className={`pl-2.5 ${i === 0 ? "py-2" : "py-1"} ${
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
                ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
