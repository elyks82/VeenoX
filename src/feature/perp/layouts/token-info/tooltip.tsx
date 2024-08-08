import { FuturesAssetProps } from "@/models";
import { useMarkets } from "@orderly.network/hooks";

type PairSelectorProps = {
  asset: FuturesAssetProps;
};

enum MarketsType {
  FAVORITES = 0,
  RECENT = 1,
  ALL = 2,
}

export const PairSelector = ({ asset }: PairSelectorProps) => {
  const [
    data,
    {
      addToHistory,
      favoriteTabs,
      updateFavoriteTabs,
      updateSymbolFavoriteState,
    },
  ] = useMarkets(MarketsType.ALL);

  console.log("my data", data);

  return (
    <div className="p-4">
      <div className="w-full mb-2.5 h-[35px] rounded bg-terciary border border-borderColor-DARK">
        <input
          className="w-full h-full px-2.5 text-white text-sm"
          placeholder="Search coins"
        />
      </div>
      <div className="flex items-center gap-2.5 text-xs text-font-60">
        <button className="">All Coins</button>
        <button className="">x10</button>
        <button className="">x20</button>
        <button className="">x50</button>
      </div>
      <div className="w-full overflow-x-scroll">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-font-60">
              <th className="py-1">Symbol</th>
              <th>Last Price</th>
              <th>24h Change</th>
              <th>Volume</th>
              <th>Open Interest</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};
