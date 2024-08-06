import { fetchAssetInfo } from "@/api/fetchAssetInfo";
import { Tooltip } from "@/components/tooltip";
import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { formatSymbol } from "@/utils/misc";
import { useQuery as useOrderlyQuery } from "@orderly.network/hooks";
import { API } from "@orderly.network/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { useQuery } from "react-query";

type TokenInfoProps = {
  asset: FuturesAssetProps;
};

export const TokenInfo = ({ asset: assetBuffer }: TokenInfoProps) => {
  const { prevPrice, isPriceChanged, setPrevPrice, setIsPriceChanged } =
    useGeneralContext();
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const {
    data: perpAssets,
    error,
    isLoading: isPerpAssetLoading,
  } = useOrderlyQuery<API.Symbol[]>("/v1/public/futures");

  const handleTokenSelectorOpening = () => {
    setIsTokenSelectorOpen((prev) => !prev);
  };

  const { data: asset, refetch } = useQuery("assetInfo", () =>
    fetchAssetInfo(
      assetBuffer.symbol,
      prevPrice,
      setPrevPrice,
      setIsPriceChanged
    )
  );

  useEffect(() => {
    const interval = setInterval(refetch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center w-full h-[80px] px-3 py-1 border-b border-borderColor ">
      <div
        className="flex items-center gap-3 relative cursor-pointer text-white"
        onClick={handleTokenSelectorOpening}
      >
        <div className="w-[40px] h-[40px] bg-gray-500 rounded-full" />
        <p className="text-white text-lg ">
          {formatSymbol(assetBuffer.symbol)}
        </p>
        <IoChevronDown className="text-white text-lg" />
        <p
          className={`${
            isPriceChanged ? asset?.color : "text-white"
          } transition-color duration-200 ease-in-out`}
        >
          {asset?.response?.data?.index_price ||
            assetBuffer?.index_price ||
            "Loading..."}
        </p>

        <Tooltip
          isOpen={isTokenSelectorOpen}
          className="left-0 translate-x-0 max-h-[350px] overflow-scroll w-[300px]"
        >
          {perpAssets?.map((pair, index) => (
            <div className="flex items-center" key={index}>
              <Link href={`/perp/${pair.symbol}`}>
                <p>{formatSymbol(pair.symbol)}</p>
              </Link>
            </div>
          ))}
        </Tooltip>
      </div>
    </div>
  );
};
