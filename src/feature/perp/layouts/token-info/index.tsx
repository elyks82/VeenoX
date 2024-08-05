import { Tooltip } from "@/components/tooltip";
import { useQuery } from "@orderly.network/hooks";
import { API } from "@orderly.network/types";
import { useState } from "react";

export const TokenInfo = () => {
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  // https://api-evm.orderly.org/
  const { data, error, isLoading } =
    useQuery<API.Symbol[]>("/v1/public/futures");

  const handleTokenSelectorOpening = () => {
    setIsTokenSelectorOpen((prev) => !prev);
  };

  return (
    <div className="flex items-center w-full h-[80px] px-3 py-1 border-b border-borderColor ">
      <div
        className="flex items-center gap-3 relative"
        onClick={handleTokenSelectorOpening}
      >
        <div className="w-[40px] h-[40px] bg-gray-500 rounded-full" />
        <div className="flex flex-col">
          <span className="text-white text-sm">BTC/ETH</span>
          <span className="text-slate-500 text-xs">0.0001</span>
        </div>
        <Tooltip
          isOpen={isTokenSelectorOpen}
          className="left-0 translate-x-0 max-h-[350px] overflow-scroll w-[300px]"
        >
          {data?.map((pair, index) => (
            <div className="flex items-center" key={index}>
              <p>{pair.symbol}</p>
            </div>
          ))}
        </Tooltip>
      </div>
    </div>
  );
};
