import { FuturesAssetProps, TradeExtension } from "@/models";
import { cn } from "@/utils/cn";
import { formatSymbol, getFormattedAmount } from "@/utils/misc";
import {
  useMarketTradeStream,
  useOrderbookStream,
} from "@orderly.network/hooks";
import { useState } from "react";
import { TradeSection } from "./trade-section";

enum OrderbookSection {
  ORDERBOOK,
  TRADE_HISTORY,
}

type OrderbookProps = {
  asset: FuturesAssetProps;
  isMobile?: boolean;
};

export const Orderbook = ({ asset, isMobile = false }: OrderbookProps) => {
  const [activeSection, setActiveSection] = useState(
    OrderbookSection.ORDERBOOK
  );

  const [data, { isLoading, onItemClick, depth, allDepths }] =
    useOrderbookStream(asset?.symbol, undefined, {
      level: isMobile ? 8 : 12,
      padding: false,
    });
  console.log("dd", data);
  const bestBid: number | undefined = (data?.bids as [number[]])[0]?.[0];
  const bestAsk = (data?.asks as [])[(data.asks as []).length - 1]?.[0];
  const spread = bestAsk - bestBid;

  type AsksBidsType = "asks" | "bids";

  const getWidthFromVolume = (type: AsksBidsType): number[] => {
    const is_asks = type === "asks";
    const typeData = data[type];
    if (typeData) {
      const arr = [];
      const maxValue = typeData?.[is_asks ? 0 : typeData.length - 1]?.[3];
      for (let i = 0; i < typeData.length; i++) {
        const [, , , totalUSDC] = typeData[i];
        const widthPercentage = (totalUSDC / maxValue) * 100;
        arr.push(widthPercentage);
      }
      return arr;
    }
    return [];
  };
  const asksWidth = getWidthFromVolume("asks");
  const bidsWidth = getWidthFromVolume("bids");

  const { data: trades, isLoading: isTradesLoading } = useMarketTradeStream(
    asset?.symbol
  );

  const renderContentFromDevice = (value: any, i: number, color: string) => {
    console.log("test", value, i, color);
    const className = getStyleFromDevice(i, color);
    for (let j = 0; j < value?.length; j++) {
      if (isMobile && i === 0)
        return <td className={className}>{getFormattedAmount(value[j])}</td>;
      else if (isMobile && i === 2)
        return <td className={className}>{getFormattedAmount(value[j])}</td>;
      else if (!isMobile)
        return <td className={className}>{getFormattedAmount(value)}</td>;
    }
  };

  const getStyleFromDevice = (i: number, color: string) => {
    switch (i) {
      case 0:
        return `pl-2.5 py-[4.6px] ${color}`;
      case 1:
        return "py-[4.6px] text-end";
      case 2:
        return "pr-2.5 py-[4.6px] text-end";
      case 3:
        return "pr-2.5 py-[4.6px] text-end";
      default:
        return "pr-2.5 py-[4.6px] text-end";
    }
  };

  return (
    <section className="">
      {isMobile ? null : (
        <>
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
              className={`h-[1px] w-1/2 bottom-0 transition-all duration-200 ease-in-out bg-font-80 absolute ${
                !activeSection ? "left-0" : "left-1/2"
              }`}
            />
          </div>
        </>
      )}
      {activeSection === OrderbookSection.ORDERBOOK ? (
        <div className="max-h-[670px] overflow-y-scroll relative w-[140px] sm:w-auto">
          <table className="w-full">
            <thead>
              <tr className="text-font-60 text-xs">
                <th className="pl-2.5 text-start pt-2 pb-1 font-normal">
                  Price
                </th>
                {isMobile ? null : (
                  <th className="text-end font-normal">Size</th>
                )}
                <th className="pr-2.5 text-end font-normal">
                  Total ({formatSymbol(asset?.symbol).split("-")[0]})
                </th>
                {isMobile ? null : (
                  <th className="pr-2.5 text-end font-normal">Total (USDC)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {(data?.asks || []).map((ask: number[], i: number) => {
                return (
                  <tr key={i} className="text-font-80 text-xs relative">
                    {Array.from({ length: 4 }).map((_, j) => {
                      const className = getStyleFromDevice(j, "");
                      const value =
                        j === 0 ? ask[j] : getFormattedAmount(ask[j]);
                      if (isMobile && (j === 0 || j === 2))
                        if (isMobile && (j === 0 || j === 2))
                          return (
                            <td
                              key={j + className}
                              className={cn(
                                className,
                                j === 0 ? "text-red" : ""
                              )}
                            >
                              {value}
                            </td>
                          );
                      if (!isMobile)
                        return (
                          <td
                            key={j + className}
                            className={cn(className, j === 0 ? "text-red" : "")}
                          >
                            {value}
                          </td>
                        );
                    })}

                    <div
                      className="absolute left-0 h-full bg-red-opacity-10 z-0 transition-all duration-150 ease-linear"
                      style={{ width: `${asksWidth[i]}%` }}
                    />
                  </tr>
                );
              })}

              <tr>
                <td
                  colSpan={4}
                  className="py-[7px] px-2.5 border-y border-borderColor-DARK bg-terciary"
                >
                  <div className="whitespace-nowrap flex justify-between items-center">
                    <p className="text-sm text-white font-bold ">
                      {getFormattedAmount((data?.middlePrice as any) || 0)}
                    </p>
                    <span className="text-[13px] text-white hidden sm:flex">
                      Spread
                    </span>
                    <span className="text-xs sm:text-[13px] text-white">
                      {spread.toFixed(3)}
                    </span>
                  </div>
                </td>
              </tr>
              {(data?.bids || []).map((bid: number[], i: number) => {
                return (
                  <tr key={i} className="text-font-80 text-xs relative">
                    {Array.from({ length: 4 }).map((_, j) => {
                      const className = getStyleFromDevice(j, "");
                      const value =
                        j === 0 ? bid[j] : getFormattedAmount(bid[j]);
                      if (isMobile && (j === 0 || j === 2))
                        return (
                          <td
                            key={j + className}
                            className={cn(
                              className,
                              j === 0 ? "text-green" : ""
                            )}
                          >
                            {value}
                          </td>
                        );
                      if (!isMobile)
                        return (
                          <td
                            key={j + className}
                            className={cn(
                              className,
                              j === 0 ? "text-green" : ""
                            )}
                          >
                            {value}
                          </td>
                        );
                    })}

                    <div
                      className="absolute left-0 h-full bg-green-opacity-10 z-0 transition-all duration-150 ease-linear"
                      style={{ width: `${bidsWidth[i]}%` }}
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <TradeSection
          asset={asset}
          trades={trades as TradeExtension[]}
          isLoading={isTradesLoading}
        />
      )}
    </section>
  );
};
