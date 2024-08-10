import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FavoriteProps } from "../../models";

const INITIAL_FAVORITES: FavoriteProps[] = [
  {
    symbols: {
      token0: "BTC",
      token1: "ETH",
    },
    price_change_24h: 0.13,
  },
  {
    symbols: {
      token0: "ORDER",
      token1: "USDC",
    },
    price_change_24h: -11.34,
  },
];

export const Favorites = () => {
  const [favori, setFavori] = useState(INITIAL_FAVORITES);

  return (
    <div className="hidden sm:flex items-center justify-between w-full relative h-[36px] sm:h-[44px]  py-1 border-b border-borderColor">
      <div className="overflow-x-scroll flex items-center px-3">
        <FaStar className="text-yellow-500 text-base mr-1" />
        {favori.map((item, index) => (
          <button
            key={index}
            className="sm:text-sm text-xs text-white flex items-center rounded h-full px-2 hover:bg-terciary"
          >
            <span>
              {item.symbols.token0}/{item.symbols.token1}
            </span>
            <span
              className={`${
                item.price_change_24h > 0 ? "text-green" : "text-red"
              } ml-2`}
            >
              {item.price_change_24h}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
