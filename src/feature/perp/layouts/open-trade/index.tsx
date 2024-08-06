import { Slider } from "@/lib/shadcn/slider";
import { useState } from "react";
import { IoCheckmarkOutline, IoChevronDown } from "react-icons/io5";
import { Slider as SliderRsuite } from "rsuite";
import "rsuite/Slider/styles/index.css";

enum TypeSection {
  MARKET,
  LIMIT,
}

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

export const OpenTrade = () => {
  const [tradeInfo, setTradeInfo] = useState(INITIAL_TRADE_INFO);

  const handleTypeChange = (type: TypeSection) => {
    setTradeInfo((prevState) => ({
      ...prevState,
      type: type ? "Limit" : "Market",
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

  const handleBooleanChange = (key: string) => {
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

  const getLeverageFromMarkValue = (mark: number) => {
    switch (mark) {
      case 0:
        return 1;
      case 10:
        return 2;
      case 20:
        return 3;
      case 30:
        return 4;
      case 40:
        return 5;
      case 50:
        return 10;
      case 60:
        return 20;
      case 70:
        return 30;
      case 80:
        return 40;
      case 90:
        return 50;
      default:
        return 1;
    }
  };

  return (
    <section className="h-full">
      <div className="flex flex-col p-4 border-b border-borderColor">
        <p className="text-xs text-font-60 mb-4">Max account leverage</p>
        <SliderRsuite
          defaultValue={50}
          min={0}
          step={10}
          max={90}
          graduated
          progress
          className="custom-slider"
          renderMark={(mark) => {
            const leverage = getLeverageFromMarkValue(mark);
            return (
              <span
                className={`text-xs text-white text-center ${
                  mark === 90 ? "ml-0" : mark === 0 ? "mr-0" : ""
                }`}
              >
                x{leverage}
              </span>
            );
          }}
        />{" "}
      </div>
      <div className="flex items-center w-full h-[44px] relative">
        <button
          className="w-1/2 h-full text-white text-sm"
          onClick={() => handleTypeChange(0)}
        >
          Market
        </button>
        <button
          className="w-1/2 h-full text-white text-sm"
          onClick={() => handleTypeChange(1)}
        >
          Limit
        </button>
      </div>
      <div className="bg-terciary h-[1px] w-full relative">
        <div
          className={`h-[1px] w-1/2 bottom-0 transition-all duration-200 ease-in-out bg-slate-400 absolute ${
            tradeInfo.type === "Market" ? "left-0" : "left-1/2"
          }`}
        />
      </div>
      <div className="flex flex-col justify-between w-full p-4 h-calc-leverage-height">
        <div className="pb-0">
          <div className="flex items-center w-full">
            <div className="flex items-center p-1 relative w-full bg-terciary border border-borderColor-DARK rounded">
              <button
                className="w-1/2  h-[36px] text-white rounded-l text-sm z-10"
                onClick={() => handleSideChange("Buy")}
              >
                Buy
              </button>
              <button
                className="w-1/2 z-10 h-[36px] text-white rounded-r text-sm"
                onClick={() => handleSideChange("Sell")}
              >
                Sell
              </button>
              <div
                className={`${style} w-1/2 h-[36px] absolute z-0 rounded transition-all duration-300 ease-in-out`}
              />
            </div>
          </div>
          <div className="flex items-center w-full justify-between mt-4">
            <p className="text-xs text-font-60">Available to Trade</p>
            <p className="text-xs text-white font-medium">0 USDC</p>
          </div>
          <div className="flex items-center h-[35px] bg-terciary justify-between w-full border border-borderColor-DARK rounded mt-3">
            <input
              name="size"
              className="w-full pl-2 text-white text-sm"
              placeholder="Size"
              type="number"
            />
            <p className="pr-2 text-white text-sm">USD</p>
          </div>
          <div className="mt-2 flex items-center">
            <Slider
              defaultValue={[tradeInfo.size]}
              max={100}
              step={1}
              onValueChange={(value) => handleSizeChange(value[0])}
              isBuy={tradeInfo.side === "Buy"}
            />
            <div className="w-[57px] pl-2 pr-0 ml-4 h-fit bg-terciary border border-borderColor-DARK rounded">
              <input
                name="size"
                className="w-[57px]  text-white text-sm h-[30px]"
                placeholder={`${tradeInfo.size.toString()}%`}
                type="number"
              />{" "}
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
          className={`w-full mt-auto h-[40px] ${
            tradeInfo.side === "Buy" ? "bg-green" : "bg-red"
          } mt-4 text-white rounded transition-all duration-200 ease-in-out`}
        >
          {tradeInfo.side === "Buy" ? "Buy / Long" : "Sell / Short"}
        </button>
      </div>
    </section>
  );
};
