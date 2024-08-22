import { Tooltip } from "@/components/tooltip";
import { useGeneralContext } from "@/context";
import { Slider } from "@/lib/shadcn/slider";
import { FuturesAssetProps } from "@/models";
import { getFormattedAmount } from "@/utils/misc";
import {
  useOrderEntry,
  useOrderStream,
  useAccount as useOrderlyAccount,
} from "@orderly.network/hooks";
import { OrderEntity } from "@orderly.network/types";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import "rsuite/Slider/styles/index.css";
import { Leverage } from "./components/leverage";

type KeyBooleanType = "reduce_only" | "tp_sl";
type OpenTradeProps = {
  isMobile?: boolean;
  holding?: number;
  asset: FuturesAssetProps;
};
const marketType = ["Market", "Limit"];

type Inputs = {
  direction: "Buy" | "Sell";
  type: "Market" | "Limit" | "StopLimit";
  triggerPrice?: string;
  price?: string;
  quantity?: string;
};

const defaultValues: Inputs = {
  direction: "Buy",
  type: "Market",
  triggerPrice: undefined,
  price: undefined,
  quantity: undefined,
};

export const OpenTrade = ({
  isMobile = false,
  asset,
  holding,
}: OpenTradeProps) => {
  const { setTradeInfo } = useGeneralContext();
  const [isTooltipMarketTypeOpen, setIsTooltipMarketTypeOpen] = useState(false);
  const { state } = useOrderlyAccount();
  const { setIsEnableTradingModalOpen, setIsWalletConnectorOpen } =
    useGeneralContext();
  // const { data: markPrices }: { data: Record<string, number> } =
  //   useMarkPricesStream();
  // console.log("markPrices");

  const [values, setValues] = useState(defaultValues);
  const {
    freeCollateral,
    markPrice,
    maxQty,
    estLiqPrice,
    estLeverage,
    onSubmit,
    helper: { calculate, validator },
  } = useOrderEntry(
    {
      symbol: asset.symbol,
      side: values.direction === "Buy" ? "BUY" : ("SELL" as any),
      order_type: values.type as any,
      order_quantity: values.quantity,
    },
    { watchOrderbook: true }
  );

  const [orders, { cancelOrder }] = useOrderStream({ symbol: asset.symbol });

  const onCancel = async (orderId: number) => {
    try {
      const res = await cancelOrder("" as any);
      console.log("res", res);
    } catch (e) {
      console.log("HERRRE", e);
    }
  };

  const submitForm = async () => {
    // setLoading(true);
    try {
      const val = getInput(values, asset.symbol);
      console.log("val", val);
      const test = await onSubmit(val);
      console.log("After onSubmit", test);
    } catch (err) {
      console.error(`Unhandled error in "submitForm":`, err);
    } finally {
      console.log("final");
      setValues(defaultValues);
    }
  };

  const getStyleFromType = () => {
    return values.direction === "Buy"
      ? "left-[3px] bg-green"
      : "left-calc-slide-long bg-red";
  };
  const style = getStyleFromType();

  const getSectionBarPosition = () => {
    if (values.type === "Market") return "left-0";
    else if (values.type === "Limit") return "left-1/3";
    else return "left-2/3";
  };
  const barPosition = getSectionBarPosition();

  const handleButtonLongClick = async () => {
    if (state.status === 0) setIsWalletConnectorOpen(true);
    else if (state.status === 2 || state.status === 4)
      setIsEnableTradingModalOpen(true);
    else {
      const errors = await getValidationErrors(
        values,
        asset?.symbol,
        validator
      );
      if (!Object.keys(errors)?.length) {
        submitForm();
      } else {
      }
    }
  };

  type ButtonStatusType = {
    title: string;
    color: string;
  };

  const getButtonStatus = (): ButtonStatusType => {
    if (state.status === 0)
      return {
        title: "Connect wallet",
        color: "bg-base_color",
      };
    else if (state.status === 2 || state.status === 4)
      return {
        title: "Enable trading",
        color: "bg-base_color",
      };
    else if (state.status > 4) {
      if (values.direction === "Buy")
        return {
          title: "Buy / Long",
          color: "bg-green",
        };
      return {
        title: "Sell / Short",
        color: "bg-red",
      };
    } else
      return {
        title: "Connect wallet",
        color: "bg-base_color",
      };
  };
  const buttonStatus = getButtonStatus();
  const handleValueChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value === "" ? "" : value }));
  };

  const convertToToken = (value: number) => {
    const price = asset.mark_price;
    return value / price;
  };
  function calculateMaxPercentage(value: number) {
    return (value / 100) * convertToToken(freeCollateral);
  }
  function percentageToValue(percentage: number) {
    return (percentage / 100) * convertToToken(freeCollateral);
  }
  function toPercentage(value: number) {
    const percentage = (value / convertToToken(freeCollateral)) * 100;
    return percentage;
  }

  const getSymbolForPair = () => {
    const formatted = asset.symbol.split("_")[1];
    return formatted;
  };

  // useEffect(() => {
  //   if (values.type === "Market")
  //     setValues((prev) => ({ ...prev, price: markPrices[asset.symbol] }));
  // }, [values.type]);

  return (
    <section className="h-full w-full">
      {/* <input
        className="bg-red"
        onChange={(e) => {
          setValues((prev) => ({ ...prev, quantity: e.target.value }));
        }}
      />
      <button onClick={() => submitForm()}>CLCKC</button> */}
      {isMobile ? null : <Leverage />}
      <div className="flex items-center w-full h-[36px] sm:h-[44px] relative">
        {marketType.map((type, i) => (
          <button
            key={i}
            className="w-1/3 h-full text-white text-xs font-medium"
            onClick={() => handleValueChange("type", type)}
          >
            {type}
          </button>
        ))}
        <button
          className="w-1/3 h-full text-white text-xs font-medium flex items-center justify-center"
          onClick={() => setIsTooltipMarketTypeOpen((prev) => !prev)}
        >
          {values.type !== "Market" && values.type !== "Limit"
            ? values.type
            : "Pro"}
          <IoChevronDown
            className={`ml-1 mr-0 pr-0 ${
              isTooltipMarketTypeOpen ? "rotate-180" : ""
            } transition-transform duration-150 ease-in-out`}
          />
        </button>
        <Tooltip
          className="right-1 w-[100px] left-auto shadow-2xl border-borderColor-DARK translate-x-0 z-20 top-[90%] p-2.5 py-1"
          isOpen={isTooltipMarketTypeOpen}
        >
          <button
            className="w-full text-white text-xs pb-1 text-start"
            onClick={() => {
              handleValueChange("type", "StopLimit");
              setIsTooltipMarketTypeOpen(false);
            }}
          >
            Stop Limit
          </button>
          <button
            className="w-full text-white text-xs pt-1 text-start whitespace-nowrap"
            onClick={() => {
              handleValueChange("type", "StopMarket");
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
      <div className="flex flex-col w-full p-2 sm:p-4 h-calc-leverage-height">
        <div className="pb-0">
          <div className="flex items-center w-full">
            <div className="flex items-center p-0.5 sm:p-[3px] relative w-full bg-terciary border border-borderColor-DARK rounded">
              <button
                className="w-1/2 h-[28px] sm:h-[34px] text-white rounded-l text-xs sm:text-[13px] z-10"
                onClick={() => handleValueChange("direction", "Buy")}
              >
                Buy
              </button>
              <button
                className="w-1/2 z-10 h-[28px] sm:h-[34px] text-white rounded-r text-xs sm:text-[13px]"
                onClick={() => handleValueChange("direction", "Sell")}
              >
                Sell
              </button>
              <div
                className={`${style} w-1/2 h-[28px] sm:h-[34px] absolute z-0 rounded-[3px] transition-all duration-300 ease-in-out`}
              />
            </div>
          </div>
          <div className="flex items-center w-full justify-between mt-4">
            <p className="text-xs text-font-60">Available to Trade</p>
            <p className="text-xs text-white font-medium">
              {getFormattedAmount(holding)} USDC
            </p>
          </div>

          {values.type === "StopLimit" ? (
            <div className="flex items-center h-[35px] bg-terciary justify-between w-full border border-borderColor-DARK rounded mt-3">
              <input
                name="size"
                className="w-full pl-2 text-white text-sm h-full"
                placeholder="Stop Price"
                onChange={(e) =>
                  handleValueChange("triggerPrice", e.target.value)
                }
                type="number"
              />
              <p className="px-2 text-white text-sm">USD</p>
            </div>
          ) : null}
          {values.type !== "Market" ? (
            <div className="flex items-center h-[35px] bg-terciary justify-between w-full border border-borderColor-DARK rounded mt-2">
              <input
                name="size"
                className="w-full pl-2 text-white text-sm h-full"
                placeholder="Price"
                type="number"
                onChange={(e) => handleValueChange("price", e.target.value)}
              />
              <p className="px-2 text-white text-sm">USD</p>
            </div>
          ) : null}
          <div className="flex items-center h-[35px] bg-terciary justify-between w-full border border-borderColor-DARK rounded mt-2">
            <input
              name="quantity"
              className="w-full pl-2 text-white text-sm h-full"
              placeholder="Quantity"
              onChange={(e) => {
                if (e.target.value === "") handleValueChange("quantity", "");
                else handleValueChange("quantity", e.target.value);
              }}
              type="number"
              value={getFormattedAmount(values.quantity).toString()}
            />
            <p className="px-2 text-white text-sm">{getSymbolForPair()}</p>
          </div>
          <div className="mt-2 flex items-center">
            <Slider
              defaultValue={[calculateMaxPercentage(freeCollateral)]}
              max={100}
              step={1}
              onValueChange={(value) => {
                setValues((prev) => ({
                  ...prev,
                  quantity: percentageToValue(value[0]) as never,
                }));
              }}
              isBuy={values.direction === "Buy"}
            />
            <div className="w-[57px] px-2 flex items-center justify-center ml-4 h-fit bg-terciary border border-borderColor-DARK rounded">
              <input
                name="quantity"
                className="w-[30px] text-white text-sm h-[30px]"
                type="number"
                value={
                  Number(toPercentage(values.quantity as never))
                    .toFixed(0)
                    .toString() || 0
                }
              />
              <p className="text-font-80">%</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-font-60">Est. Liq. price</p>
            <p className="text-xs text-white font-medium">
              {estLiqPrice || "--"} <span className="text-font-60">USDC</span>
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-font-60">Account leverage</p>
            <p className="text-xs text-white font-medium">
              {estLeverage || "--"}x
            </p>
          </div>
          <div className="flex items-center justify-between mt-2 border-b border-borderColor-DARK pb-4">
            <p className="text-xs text-font-60">Fees</p>
            <p className="text-xs text-white font-medium">0.00% / 0.03%</p>
          </div>
          {/* <button
            className="text-xs text-white mt-4 flex items-center justify-between w-full"
            onClick={() => handleBooleanChange("reduce_only")}
          >
            <p>Reduce only</p>
            <div className="w-[15px] h-[15px] rounded border border-borderColor-DARK bg-terciary">
              {values.reduce_only ? (
                <IoCheckmarkOutline className="text-blue-400" />
              ) : null}
            </div>
          </button> */}
          {/* <button
            className="text-xs text-white mt-2 flex items-center justify-between w-full"
            onClick={() => handleBooleanChange("tp_sl")}
          >
            <p>Take profit / Stop loss</p>
            <div className="w-[15px] h-[15px] rounded border border-borderColor-DARK bg-terciary flex items-center jusitfy-center">
              {values.tp_sl ? (
                <IoCheckmarkOutline className="text-blue-400" />
              ) : null}
            </div>
          </button>

          {values.tp_sl ? (
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
          ) : null} */}
        </div>
        <div className={`${isMobile ? "hidden" : "flex"} h-[100px] w-full`} />
        <button
          onClick={handleButtonLongClick}
          className={`w-full mt-2.5 h-[32px] sm:h-[35px] ${buttonStatus?.color} 
          ${
            isMobile ? "mb-0" : "mb-4"
          } text-white rounded transition-all duration-200 ease-in-out text-xs sm:text-sm`}
        >
          {buttonStatus?.title}
        </button>
        <div className="pt-4 border-t border-borderColor hidden md:block">
          <div className="pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-font-60 mb-[3px]">
                  Total value (USDC)
                </p>
                <p className="text-base text-white font-medium">
                  {getFormattedAmount(holding)}
                </p>
              </div>
              <div>
                <p className="text-xs text-font-60 mb-1">Unreal PnL (USDC)</p>
                <p className="text-sm text-white font-medium text-end">
                  0.00 (0.00%)
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div>
                <p className="text-xs text-font-60 mb-1">
                  Unsettled PnL (USDC)
                </p>
                <p className="text-sm text-white font-medium">0.00</p>
              </div>
              <button className="flex items-center bg-terciary border border-borderColor-DARK rounded px-2 py-1 text-xs text-white">
                <span>Settle PnL</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

async function getValidationErrors(
  data: Inputs,
  symbol: string,
  validator: ReturnType<typeof useOrderEntry>["helper"]["validator"]
): Promise<
  ReturnType<ReturnType<typeof useOrderEntry>["helper"]["validator"]>
> {
  return validator(getInput(data, symbol));
}

function getInput(data: Inputs, symbol: string): OrderEntity {
  return {
    symbol,
    side: data.direction === "Buy" ? "BUY" : ("SELL" as any),
    order_type: data.type.toUpperCase() as any,
    order_price: data.price,
    order_quantity: data.quantity,
    trigger_price: data.triggerPrice,
  };
}
