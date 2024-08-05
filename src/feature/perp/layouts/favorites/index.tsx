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
    <div className="flex items-center w-full h-[44px] px-3 py-1 border-b border-borderColor overflow-x-scroll">
      <FaStar className="text-yellow-500 text-base mr-1" />
      {favori.map((item, index) => (
        <button
          key={index}
          className="text-sm text-white flex items-center rounded h-full px-3 hover:bg-terciary"
        >
          <span>
            {item.symbols.token0}/{item.symbols.token1}
          </span>
          <span
            className={`${
              item.price_change_24h > 0 ? "text-green-600" : "text-red-600"
            } ml-2`}
          >
            {item.price_change_24h}%
          </span>
        </button>
      ))}
    </div>
  );
};
