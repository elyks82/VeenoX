import { Dispatch, SetStateAction } from "react";

export const fetchAssetInfo = async (
  symbol: string,
  prevPrice: number,
  setPrevPrice: Dispatch<SetStateAction<number>>,
  setIsPriceChanged: Dispatch<SetStateAction<boolean>>
) => {
  const query = await fetch(
    `https://api-evm.orderly.org/v1/public/futures/${symbol}`
  );
  const response = await query.json();
  const newPrice = response?.data?.index_price;

  const handleColorChange = () => {
    if (newPrice > prevPrice) {
      return "text-green";
    } else if (newPrice < prevPrice) {
      return "text-red";
    } else {
      return "text-white";
    }
  };
  const color = handleColorChange();

  if (newPrice !== prevPrice) {
    setIsPriceChanged(true);
    setTimeout(() => setIsPriceChanged(false), 1000);
    setPrevPrice(newPrice);
  }

  return { response, color };
};
