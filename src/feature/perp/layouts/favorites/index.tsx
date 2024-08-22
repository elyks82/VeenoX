import { FavoriteProps } from "@/models";
import { formatSymbol, getTokenPercentage } from "@/utils/misc";
import { FaStar } from "react-icons/fa";

export const Favorites = ({ props }: FavoriteProps) => {
  const { data } = props;
  const favorites = data.filter((entry) => entry.isFavorite);

  const get24hChange = (closePrice: number, openPrice: number) => {
    return ((closePrice - openPrice) / openPrice) * 100;
  };

  return (
    <div className="hidden sm:flex items-center justify-between w-full relative h-[32px] sm:h-[36px]  py-1 border-b border-borderColor ">
      <div className="overflow-x-scroll flex items-center px-3 no-scrollbar">
        <FaStar className="text-yellow-500 text-xs" />
        {favorites.map((item, index) => {
          const change = get24hChange(item["24h_close"], item["24h_open"]);
          return (
            <button
              key={index}
              className="text-xs text-white flex items-center rounded h-full px-2 hover:bg-terciary"
            >
              <span>{formatSymbol(item.symbol)}</span>
              <span
                className={`${change > 0 ? "text-green" : "text-red"} ml-2`}
              >
                {getTokenPercentage(change)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
