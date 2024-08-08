import { fetchAssetInfo } from "@/api/fetchAssetInfo";
import { Tooltip } from "@/components/tooltip";
import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { formatSymbol, getFormattedAmount } from "@/utils/misc";
import { useQuery as useOrderlyQuery } from "@orderly.network/hooks";
import { API } from "@orderly.network/types";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { useQuery } from "react-query";
import { PairSelector } from "./tooltip";

type TokenInfoProps = {
  asset: FuturesAssetProps;
};

export const TokenInfo = ({ asset: assetBuffer }: TokenInfoProps) => {
  const { prevPrice, isPriceChanged, setPrevPrice, setIsPriceChanged } =
    useGeneralContext();
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const { data: perpAssets, isLoading: isPerpAssetLoading } =
    useOrderlyQuery<API.Symbol[]>("/v1/public/futures");

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

  const formattedAsset = asset?.response?.data;

  return (
    <div className="flex items-center w-full h-[70px] px-3 py-1 border-b border-borderColor ">
      <div
        className="flex items-center gap-3 relative cursor-pointer text-white"
        onClick={handleTokenSelectorOpening}
      >
        <div className="flex items-center">
          <img
            className="w-[30px] h-[30px] bg-gray-500 rounded-full"
            src={`https://oss.orderly.network/static/symbol_logo/${formatSymbol(
              assetBuffer?.symbol,
              true
            )}.png`}
          />
          <p className="text-white text-lg ml-3 mr-1">
            {formatSymbol(assetBuffer.symbol)}
          </p>
          <IoChevronDown className="text-white text-lg" />
        </div>
        <div className="h-[30px] w-[1px] bg-borderColor mx-2" />
        <div className="flex items-center overflow-x-scroll">
          <p
            className={`${
              isPriceChanged ? asset?.color : "text-white"
            } transition-color duration-200 ease-in-out text-lg mr-5`}
          >
            {asset?.response?.data?.index_price ||
              assetBuffer?.index_price ||
              "Loading..."}
          </p>
          <div className="mr-3.5">
            <p className="text-xs text-font-60">24h Change </p>
            <p className="text-[13px] mt-1 text-white font-medium">
              {asset?.response?.data?.price_change_24h || "Loading..."}
            </p>
          </div>
          <div className="mr-3.5">
            <p className="text-xs text-font-60">Mark </p>
            <p className="text-[13px] mt-1 text-white font-medium">
              {formattedAsset?.mark_price || "14%"}
            </p>
          </div>
          <div className="mr-3.5">
            <p className="text-xs text-font-60">Index</p>
            <p className="text-[13px] mt-1 text-white font-medium">
              {formattedAsset?.index_price || "Loading..."}
            </p>
          </div>
          <div className="mr-3.5">
            <p className="text-xs text-font-60">24h Volume</p>
            <p className="text-[13px] mt-1 text-white font-medium">
              {formattedAsset?.["24h_volume"] || "Loading..."}
            </p>
          </div>
          <div className="mr-3.5">
            <p className="text-xs text-font-60">Pred. funding rate</p>
            <p className="text-[13px] mt-1 text-white font-medium">
              {formattedAsset?.last_funding_rate || "Loading..."}
            </p>
          </div>
          <div className="mr-3.5">
            <p className="text-xs text-font-60">Open interest </p>
            <p className="text-[13px] mt-1 text-white font-medium">
              {getFormattedAmount(formattedAsset?.open_interest) ||
                "Loading..."}
            </p>
          </div>
        </div>

        <Tooltip
          isOpen={isTokenSelectorOpen}
          className="left-0 translate-x-0 max-h-[350px] overflow-scroll w-[500px]"
        >
          <PairSelector asset={asset} />
        </Tooltip>
      </div>
    </div>
  );
};
