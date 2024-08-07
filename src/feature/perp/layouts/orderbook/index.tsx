import { FuturesAssetProps } from "@/models";
import { getFormattedAmount } from "@/utils/misc";
import { useOrderbookStream } from "@orderly.network/hooks";
import { useState } from "react";
import { TradeSection } from "./trade-section";

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

  const [data, { onDepthChange, isLoading, onItemClick, depth, allDepths }] =
    useOrderbookStream(asset.symbol, undefined, {
      level: 12,
      padding: true,
    });

  const calculateWeightedAverage = (orders) => {
    let totalAmount = 0;
    let totalValue = 0;

    for (let i = 0; i < orders.length; i++) {
      let price = orders[i][0];
      let amount = orders[i][1];
      totalAmount += amount;
      totalValue += price * amount;
    }

    return totalValue / totalAmount;
  };

  const bestBid = data?.bids[0][0];
  const bestAsk = data?.asks[data.asks.length - 1][0];
  const spread = bestAsk - bestBid;

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
      {activeSection === OrderbookSection.ORDERBOOK ? (
        <div className="max-h-[670px] overflow-y-scroll relative">
          <table className="w-full">
            <thead>
              <tr className="text-font-60 text-xs">
                <th className="pl-2.5 text-start pt-2 pb-1 font-normal">
                  Price
                </th>
                <th className="text-end font-normal">Size</th>
                <th className="pr-2.5 text-end font-normal">Total (usd)</th>
                <th className="pr-2.5 text-end font-normal">Total (doge)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? "Loading..."
                : data?.asks.map((ask, i: number) => (
                    <tr
                      key={i}
                      className="text-font-80 text-xs"
                      onClick={() => onItemClick(ask[0])}
                    >
                      <td
                        className={`pl-2.5 ${
                          i === 0 ? "py-2" : "py-1"
                        } text-red`}
                      >
                        {ask[0]}
                      </td>
                      <td className={`py-[5px] text-end`}>{ask[1]}</td>
                      <td className="pr-2.5 py-1 text-end">{ask[2]}</td>
                      <td className="pr-2.5 py-1 text-end">
                        {getFormattedAmount(ask[3])}
                      </td>
                    </tr>
                  ))}
              <tr>
                <td
                  colSpan={4}
                  className="py-[7px] px-2.5 border-y border-borderColor-DARK bg-terciary shadow-xl"
                >
                  <div className="whitespace-nowrap flex justify-between items-center">
                    <p className="text-sm text-white font-bold ">
                      {getFormattedAmount(data?.middlePrice)}
                    </p>
                    <span className="text-[13px] text-white">Spread</span>
                    <span className="text-[13px] text-white">
                      {spread.toFixed(3)}
                    </span>
                  </div>
                </td>
              </tr>

              {/* <tfoot className="bg-terciary py-2">
                <tr>
                  <th scope="row" className="col-span-2 pl-2.5 w-fit ">
                 
                  </th>
                  <td className="pl-2.5">33</td>
                </tr>
              </tfoot> */}
              {isLoading
                ? "Loading..."
                : data?.bids.map((bid, i: number) => (
                    <tr
                      key={i}
                      className="text-font-80 text-xs"
                      onClick={() => onItemClick(bid[0])}
                    >
                      <td
                        className={`pl-2.5 ${
                          i === 0 ? "py-2" : "py-1.5"
                        } text-green`}
                      >
                        {bid[0]}
                      </td>
                      <td className={`py-1 text-end`}>{bid[1]}</td>
                      <td className="pr-2.5 py-[5px] text-end">{bid[2]}</td>
                      <td className="pr-2.5 py-1 text-end">
                        {getFormattedAmount(bid[3])}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      ) : (
        <TradeSection asset={asset} />
      )}
    </section>
  );
};
