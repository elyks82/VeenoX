import { Popover, PopoverContent, PopoverTrigger } from "@/lib/shadcn/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/shadcn/tooltip";
import { FuturesAssetProps } from "@/models";
import {
  formatSymbol,
  get24hChange,
  getFormattedAmount,
  getRemainingTime,
} from "@/utils/misc";
import { useTickerStream } from "@orderly.network/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { PairSelector } from "./tooltip";

type TokenInfoProps = {
  asset: FuturesAssetProps;
};

export const TokenInfo = ({ asset: assetBuffer }: TokenInfoProps) => {
  const [triggerOrderlyTooltip, setTriggerOrderlyTooltip] = useState(false);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);

  const handleTokenSelectorOpening = () => {
    setIsTokenSelectorOpen((prev) => !prev);
  };

  // const { data: asset, refetch } = useQuery("assetInfo", () =>
  //   fetchAssetInfo(
  //     assetBuffer.symbol,
  //     prevPrice,
  //     setPrevPrice,
  //     setIsPriceChanged
  //   )
  // );

  // useEffect(() => {
  //   const interval = setInterval(refetch, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  const params = useParams();
  const marketInfo = useTickerStream(assetBuffer?.symbol);

  const [lastPriceInfo, setLastPriceInfo] = useState({
    last_price: assetBuffer?.mark_price,
    price_color: "text-white",
  });

  const handleLastPriceUpdate = () => {
    if (marketInfo.mark_price > lastPriceInfo.last_price) {
      setLastPriceInfo((prev) => ({
        ...prev,
        price_color: "text-green",
      }));
      setTimeout(
        () =>
          setLastPriceInfo((prev) => ({
            ...prev,
            price_color: "text-white",
          })),
        1000
      );
    } else if (marketInfo.mark_price < lastPriceInfo.last_price) {
      setLastPriceInfo((prev) => ({
        ...prev,
        price_color: "text-red",
      }));
      setTimeout(
        () =>
          setLastPriceInfo((prev) => ({
            ...prev,
            price_color: "text-white",
          })),
        1000
      );
    }
  };

  useEffect(() => {
    if (!marketInfo?.mark_price) return;
    handleLastPriceUpdate();
    if (marketInfo?.mark_price !== lastPriceInfo.last_price) {
      setLastPriceInfo((prev) => ({
        ...prev,
        last_price: marketInfo?.mark_price,
      }));
    }
  }, [marketInfo]);

  const priceChange = get24hChange(
    marketInfo?.["24h_open"],
    marketInfo?.["24h_close"]
  );
  const fundingChange = get24hChange(
    marketInfo?.est_funding_rate,
    marketInfo?.last_funding_rate
  );

  const getColorFromChangePercentage = (percentage: string) => {
    if (percentage > "0") return "text-green";
    else if (percentage < "0") return "text-white";
    else "text-red";
  };
  const colorPriceChange = getColorFromChangePercentage(
    priceChange.formatPercentage
  );
  const colorFundingChange = getColorFromChangePercentage(
    fundingChange.formatPercentage
  );

  return (
    <div className="flex items-center w-full h-[55px] sm:h-[65px] px-3 py-1 border-b border-borderColor whitespace-nowrap overflow-x-scroll">
      <div className="flex items-center gap-3 relative cursor-pointer text-white">
        <Popover>
          <PopoverTrigger>
            <div
              className="flex items-center mr-2"
              onClick={handleTokenSelectorOpening}
            >
              <img
                className="sm:w-[28px] sm:h-[28px] w-[22px] h-[22px] bg-gray-500 rounded-full"
                src={`https://oss.orderly.network/static/symbol_logo/${formatSymbol(
                  assetBuffer?.symbol,
                  true
                )}.png`}
              />
              <p className="text-white text-base sm:text-lg ml-2 sm:ml-3">
                {formatSymbol(assetBuffer.symbol)}
              </p>
              <IoChevronDown className="text-white text-base sm:text-lg min-w-[15px] ml-1" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="transform-x-[10px] w-[550px] bg-terciary border border-borderColor-DARK shadow-xl">
            <PairSelector />
          </PopoverContent>
        </Popover>
        <div className="flex items-center overflow-x-scroll min-w-[800px] pl-2">
          <p
            className={`${lastPriceInfo.price_color} transition-color duration-200 ease-in-out text-base sm:text-lg mr-5`}
          >
            {getFormattedAmount(marketInfo?.mark_price) || "Loading..."}
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-font-60">24h Change </p>
              <span className="text-xs flex items-center mt-1 text-font-60 font-medium">
                <p className={`${colorPriceChange} `}>
                  {getFormattedAmount(priceChange.difference) || "0.00"}
                </p>
                <p className="mx-0.5">/</p>

                <p className={`${colorPriceChange}`}>
                  {priceChange.formatPercentage || "0.00"}%
                </p>
              </span>
            </div>
            <div>
              <p className="text-xs text-font-60">Mark </p>
              <p className="text-xs mt-1 text-white font-medium">
                {marketInfo?.mark_price}
              </p>
            </div>
            <div>
              <p className="text-xs text-font-60">Index</p>
              <p className="text-xs mt-1 text-white font-medium">
                {marketInfo?.index_price}
              </p>
            </div>
            {/* */}
            <div className="relative">
              <p className="text-xs text-font-60">24h Volume</p>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span
                      className="flex items-center mt-1"
                      onMouseEnter={() => setTriggerOrderlyTooltip(true)}
                      onMouseLeave={() => setTriggerOrderlyTooltip(false)}
                    >
                      <img
                        className="h-[15px] w-[15px] mr-1.5"
                        src="/logo/orderly.svg"
                        alt="Orderly Network logo"
                      />
                      <p className="text-xs text-white font-medium">
                        {getFormattedAmount(marketInfo?.["24h_amount"])}
                      </p>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="h-fit overflow-clip w-[180px] p-2 bg-terciary border border-borderColor-DARK shadow-xl whitespace-pre-wrap"
                  >
                    24 hour total trading volume on the Orderly Network.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <p className="text-xs text-font-60">Pred. funding rate</p>
              <span className="text-xs box-border h-fit flex items-center mt-1 font-medium">
                <p className={colorFundingChange}>
                  {marketInfo?.last_funding_rate || "0.00"}%
                </p>
                <p className="mx-0.5 text-font-60">/</p>
                <p className="text-white">
                  {getRemainingTime(marketInfo?.next_funding_time) ||
                    "00:00:00"}
                </p>
              </span>
            </div>
            <div>
              <p className="text-xs text-font-60">Open interest </p>
              <p className="text-xs mt-1 text-white">
                {getFormattedAmount(marketInfo?.open_interest)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
