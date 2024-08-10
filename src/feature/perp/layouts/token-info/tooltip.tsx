import { MarketTickerProps } from "@/models";
import { formatSymbol, getFormattedAmount } from "@/utils/misc";
import { useMarkets } from "@orderly.network/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

enum MarketsType {
  FAVORITES = 0,
  RECENT = 1,
  ALL = 2,
}

export const PairSelector = () => {
  const router = useRouter();
  const sections: string[] = ["All Coins", "x10", "x20", "x50"];
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [searchInput, setSearchInput] = useState("");
  const [
    data,
    {
      addToHistory,
      favoriteTabs,
      updateFavoriteTabs,
      updateSymbolFavoriteState,
    },
  ]: any = useMarkets(MarketsType.ALL);

  const getFilteredMarketData = () => {
    if (!data?.length) return [];
    if (activeSection === "All Coins")
      return data
        ?.sort(
          (a: MarketTickerProps, b: MarketTickerProps) =>
            b.leverage - a.leverage
        )
        ?.filter((item: MarketTickerProps) => {
          const formattedSymbol = item.symbol.split("_")[1];
          return (
            formattedSymbol.toLowerCase().includes(searchInput) ||
            formattedSymbol.includes(searchInput)
          );
        });
    else if (activeSection !== "All Coins" && !searchInput)
      return data?.filter(
        (item: MarketTickerProps) =>
          item.leverage === parseInt(activeSection.replace("x", ""))
      );
    else
      return data
        ?.sort(
          (a: MarketTickerProps, b: MarketTickerProps) =>
            b.leverage - a.leverage
        )
        ?.filter((item: MarketTickerProps) => {
          const formattedSymbol = item.symbol.split("_")[1];
          return (
            formattedSymbol.toLowerCase().includes(searchInput) ||
            formattedSymbol.includes(searchInput)
          );
        });
  };
  const filteredMarketData = getFilteredMarketData();

  return (
    <div>
      <div className="w-full h-[35px] rounded bg-terciary border border-borderColor-DARK">
        <input
          className="w-full h-full px-2.5 text-white text-sm"
          placeholder="Search coins"
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="flex items-center py-2 gap-2.5 mt-1 text-xs text-white">
        {sections.map((section: string, i: number) => (
          <button
            key={i}
            className={`${
              activeSection === section ? "text-blue-500" : "text-white"
            } font-medium transition-all duration-100 ease-in-out`}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>
      <div className="w-full overflow-scroll max-h-[250px]">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-font-60">
              <th className="font-normal py-1 text-start">Symbol</th>
              <th className="font-normal text-end">Last Price</th>
              <th className="font-normal text-end">24h Change</th>
              <th className="font-normal text-end">Volume</th>
              <th className="font-normal text-end">Open Interest</th>
            </tr>
          </thead>
          {filteredMarketData?.length > 0 ? (
            filteredMarketData?.map((token: MarketTickerProps, i: number) => {
              const isUp = token.change > 0;
              return (
                <tbody
                  key={i}
                  className="hover:bg-terciary transition-all duration-100 ease-in-out"
                  onClick={() => router.push(`/perp/${token.symbol}`)}
                >
                  <tr className="text-font-80">
                    <td className="py-1">
                      <div className="flex w-full items-center">
                        {formatSymbol(token.symbol)}
                        <span className="bg-blue-600 rounded text-[11px] px-1 py-[1px] ml-2">
                          x{token.leverage}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">
                      {getFormattedAmount(token.mark_price)}
                    </td>
                    <td
                      className={`text-end ${isUp ? "text-green" : "text-red"}`}
                    >
                      {getFormattedAmount(token.change)}%
                    </td>
                    <td className="text-end">
                      {getFormattedAmount(token["24h_volume"])}
                    </td>
                    <td className="text-end">
                      {getFormattedAmount(token.open_interest)}
                    </td>
                  </tr>
                </tbody>
              );
            })
          ) : (
            <caption className="caption-bottom h-[180px] w-full">
              <div className="w-full h-full flex items-center justify-center flex-col">
                <img className="h-[90px] w-auto" src="/empty/no-result.svg" />
                <p className="text-xs text-font-60 font-medium">
                  No result found
                </p>
              </div>
            </caption>
          )}
        </table>
      </div>
    </div>
  );
};
