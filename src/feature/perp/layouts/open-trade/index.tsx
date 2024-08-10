import { GraduateSlider } from "@/components/graduate-slider.tsx";
import { Tooltip } from "@/components/tooltip";
import { useGeneralContext } from "@/context";
import { Slider } from "@/lib/shadcn/slider";
import { useState } from "react";
import { IoCheckmarkOutline, IoChevronDown } from "react-icons/io5";

import "rsuite/Slider/styles/index.css";

type KeyBooleanType = "reduce_only" | "tp_sl";

const INITIAL_TRADE_INFO = {
  type: "Market",
  side: "Buy",
  size: 100, // Percentage
  price: null,
  reduce_only: false,
  tp_sl: false,
  tp: null,
  sl: null,
  leverage: 1,
};

const marketType = ["Market", "Limit"];
const proMarketType = ["Stop Limit", "Stop Market"];

type OpenTradeProps = {
  isMobile?: boolean;
};

export const OpenTrade = ({ isMobile = false }: OpenTradeProps) => {
  const { tradeInfo, setTradeInfo } = useGeneralContext();
  const [isTooltipMarketTypeOpen, setIsTooltipMarketTypeOpen] = useState(false);

  const handleTypeChange = (type: string) => {
    setTradeInfo((prevState) => ({
      ...prevState,
      type,
    }));
  };

  const handleSideChange = (side: string) => {
    setTradeInfo((prevState) => ({
      ...prevState,
      side,
    }));
  };

  const handleSizeChange = (size: number) => {
    setTradeInfo((prevState) => ({
      ...prevState,
      size,
    }));
  };

  const handleBooleanChange = (key: KeyBooleanType) => {
    setTradeInfo((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getStyleFromType = () => {
    return tradeInfo.side === "Buy"
      ? "left-[4px] bg-green"
      : "left-calc-slide-long bg-red";
  };
  const style = getStyleFromType();

  const getSectionBarPosition = () => {
    if (tradeInfo.type === "Market") return "left-0";
    else if (tradeInfo.type === "Limit") return "left-1/3";
    else return "left-2/3";
  };
  const barPosition = getSectionBarPosition();

  return (
    <section className="h-full w-full">
      {isMobile ? null : (
        <div className="flex flex-col p-4 border-b border-borderColor">
          <p className="text-xs text-font-60 mb-1">Max account leverage</p>
          <GraduateSlider />
        </div>
      )}
      <div className="flex items-center w-full h-[36px] sm:h-[44px] relative">
        {marketType.map((type, i) => (
          <button
            key={i}
            className="w-1/3 h-full text-white text-xs sm:text-sm"
            onClick={() => handleTypeChange(type)}
          >
            {type}
          </button>
        ))}
        <button
          className="w-1/3 h-full text-white text-xs sm:text-sm flex items-center justify-center"
          onClick={() => setIsTooltipMarketTypeOpen((prev) => !prev)}
        >
          {tradeInfo.type !== "Market" && tradeInfo.type !== "Limit"
            ? tradeInfo.type
            : "Pro"}
          <IoChevronDown
            className={`ml-1 mr-0 pr-0 ${
              isTooltipMarketTypeOpen ? "rotate-180" : ""
            } transition-transform duration-150 ease-in-out`}
          />
        </button>
        <Tooltip
          className="right-1 w-1/2 sm:w-1/3 left-auto shadow-2xl border-borderColor translate-x-0 z-20 top-[90%] p-2.5"
          isOpen={isTooltipMarketTypeOpen}
        >
          <button
            className="w-full text-white text-sm pb-1 text-start"
            onClick={() => {
              handleTypeChange("Stop Limit");
              setIsTooltipMarketTypeOpen(false);
            }}
          >
            Stop Limit
          </button>
          <button
            className="w-full text-white text-sm pt-1 text-start"
            onClick={() => {
              handleTypeChange("Stop Market");
              setIsTooltipMarketTypeOpen(false);
            }}
          >
            Stop Market
          </button>
        </Tooltip>
      </div>
      <div className="bg-terciary h-[1px] w-full relative">
        <div
          className={`h-[1px] w-1/3 bottom-0 transition-all duration-200 ease-in-out bg-font-80 absolute ${barPosition}`}
        />
      </div>
      <div className="flex flex-col justify-between w-full p-2 sm:p-4 h-calc-leverage-height">
        <div className="pb-0">
          <div className="flex items-center w-full">
            <div className="flex items-center p-0.5 sm:p-1 relative w-full bg-terciary border border-borderColor-DARK rounded">
              <button
                className="w-1/2 h-[28px] sm:h-[34px] text-white rounded-l text-xs sm:text-sm z-10"
                onClick={() => handleSideChange("Buy")}
              >
                Buy
              </button>
              <button
                className="w-1/2 z-10 h-[28px] sm:h-[34px] text-white rounded-r text-xs sm:text-sm"
                onClick={() => handleSideChange("Sell")}
              >
                Sell
              </button>
              <div
                className={`${style} w-1/2 h-[28px] sm:h-[34px] absolute z-0 rounded transition-all duration-300 ease-in-out`}
              />
            </div>
          </div>
          <div className="flex items-center w-full justify-between mt-4">
            <p className="text-xs text-font-60">Available to Trade</p>
            <p className="text-xs text-white font-medium">0 USDC</p>
          </div>

          {tradeInfo.type === "Stop Limit" ||
          tradeInfo.type === "Stop Market" ? (
            <div className="flex items-center h-[35px] bg-terciary justify-between w-full border border-borderColor-DARK rounded mt-3">
              <input
                name="size"
                className="w-full pl-2 text-white text-sm h-full"
                placeholder="Stop Price"
                type="number"
              />
              <p className="px-2 text-white text-sm">USD</p>
            </div>
          ) : null}
          {tradeInfo.type !== "Market" ? (
            <div className="flex items-center h-[35px] bg-terciary justify-between w-full border border-borderColor-DARK rounded mt-2">
              <input
                name="size"
                className="w-full pl-2 text-white text-sm h-full"
                placeholder="Price"
                type="number"
              />
              <p className="px-2 text-white text-sm">USD</p>
            </div>
          ) : null}
          <div className="flex items-center h-[35px] bg-terciary justify-between w-full border border-borderColor-DARK rounded mt-2">
            <input
              name="size"
              className="w-full pl-2 text-white text-sm h-full"
              placeholder="Size"
              type="number"
            />
            <p className="px-2 text-white text-sm">USD</p>
          </div>
          <div className="mt-2 flex items-center">
            <Slider
              defaultValue={[tradeInfo.size]}
              max={100}
              step={1}
              onValueChange={(value) => handleSizeChange(value[0])}
              isBuy={tradeInfo.side === "Buy"}
            />
            <div className="w-[57px] ml-4 h-fit bg-terciary border border-borderColor-DARK rounded">
              <input
                name="size"
                className="w-[57px] pl-2 text-white text-sm h-[30px]"
                placeholder={`${tradeInfo.size.toString()}%`}
                type="number"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-font-60">Est. Liq. price</p>
            <p className="text-xs text-white font-medium">
              -- <span className="text-font-60">USDC</span>
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-font-60">Account leverage</p>
            <p className="text-xs text-white font-medium">0x</p>
          </div>
          <div className="flex items-center justify-between mt-2 border-b border-borderColor-DARK pb-4">
            <p className="text-xs text-font-60">Fees</p>
            <p className="text-xs text-white font-medium">0.00% / 0.03%</p>
          </div>
          <button
            className="text-xs text-white mt-4 flex items-center justify-between w-full"
            onClick={() => handleBooleanChange("reduce_only")}
          >
            <p>Reduce only</p>
            <div className="w-[15px] h-[15px] rounded border border-borderColor-DARK bg-terciary">
              {tradeInfo.reduce_only ? (
                <IoCheckmarkOutline className="text-blue-400" />
              ) : null}
            </div>
          </button>
          <button
            className="text-xs text-white mt-2 flex items-center justify-between w-full"
            onClick={() => handleBooleanChange("tp_sl")}
          >
            <p>Take profit / Stop loss</p>
            <div className="w-[15px] h-[15px] rounded border border-borderColor-DARK bg-terciary flex items-center jusitfy-center">
              {tradeInfo.tp_sl ? (
                <IoCheckmarkOutline className="text-blue-400" />
              ) : null}
            </div>
          </button>

          {tradeInfo.tp_sl ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center h-[35px] bg-terciary w-2/3 border border-borderColor-DARK rounded mt-3">
                  <input
                    name="size"
                    className="w-full pl-2 h-full text-white text-xs"
                    placeholder="TP Price"
                    type="number"
                  />
                </div>
                <div className="flex items-center h-[35px] bg-terciary w-1/3 border border-borderColor-DARK rounded mt-3">
                  <input
                    name="size"
                    className="w-full h-full pl-2 text-white text-xs"
                    placeholder="Gain"
                    type="number"
                  />
                  <button className="pr-2 text-white text-xs flex items-center justify-center">
                    % <IoChevronDown className="h-full ml-1" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center h-[35px] bg-terciary w-2/3 border border-borderColor-DARK rounded mt-2">
                  <input
                    name="size"
                    className="w-full pl-2 h-full text-white text-xs"
                    placeholder="SL Price"
                    type="number"
                  />
                </div>
                <div className="flex items-center h-[35px] bg-terciary w-1/3 border border-borderColor-DARK rounded mt-2">
                  <input
                    name="size"
                    className="w-full h-full pl-2 text-white text-xs"
                    placeholder="Loss"
                    type="number"
                  />
                  <button className="pr-2 text-white text-xs flex items-center justify-center">
                    % <IoChevronDown className="h-full ml-1" />
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <button
          className={`w-full mt-2.5 sm:mt-auto h-[32px] sm:h-[35px] ${
            tradeInfo.side === "Buy" ? "bg-green" : "bg-red"
          } mt-4 text-white rounded transition-all duration-200 ease-in-out`}
        >
          {tradeInfo.side === "Buy" ? "Buy / Long" : "Sell / Short"}
        </button>
      </div>
    </section>
  );
};
