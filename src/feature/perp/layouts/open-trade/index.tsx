import { Tooltip } from "@/components/tooltip";
import { useGeneralContext } from "@/context";
import { Slider } from "@/lib/shadcn/slider";
import { triggerAlert } from "@/lib/toaster";
import { FuturesAssetProps } from "@/models";
import { formatQuantity, getFormattedAmount } from "@/utils/misc";
import {
  useAccountInstance,
  useCollateral,
  useHoldingStream,
  useLeverage,
  useMaxQty,
  useOrderEntry,
  useAccount as useOrderlyAccount,
  usePositionStream,
  useSettleSubscription,
  useSymbolPriceRange,
  useSymbolsInfo,
} from "@orderly.network/hooks";
import { OrderEntity, OrderSide } from "@orderly.network/types";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import { Oval } from "react-loader-spinner";
import "rsuite/Slider/styles/index.css";
import { useAccount } from "wagmi";
import { Leverage } from "./components/leverage";

type OpenTradeProps = {
  isMobile?: boolean;
  holding?: number;
  asset: FuturesAssetProps;
};
const marketType = ["Market", "Limit"];

type Inputs = {
  direction: "BUY" | "SELL";
  type: "MARKET" | "LIMIT" | "STOPLIMIT";
  triggerPrice?: string;
  price?: string;
  quantity?: string;
  reduce_only: boolean;
  tp_trigger_price?: string;
  sl_trigger_price?: string;
};

type ButtonStatusType = {
  title: string;
  color: string;
};

const defaultValues: Inputs = {
  direction: "BUY" as any,
  type: "MARKET",
  triggerPrice: undefined,
  price: undefined,
  quantity: undefined,
  reduce_only: false,
  tp_trigger_price: undefined,
  sl_trigger_price: undefined,
};

export const OpenTrade = ({
  isMobile = false,
  asset,
  holding,
}: OpenTradeProps) => {
  const { setTradeInfo } = useGeneralContext();
  const accountInstance = useAccountInstance();
  const [isTooltipMarketTypeOpen, setIsTooltipMarketTypeOpen] = useState(false);
  const { state, account } = useOrderlyAccount();
  const { address } = useAccount();
  const [activeHoldings, setActiveHoldings] = useState(0);
  const [isSettleLoading, setIsSettleLoading] = useState(false);
  const {
    setIsEnableTradingModalOpen,
    setIsWalletConnectorOpen,
    setOrderPositions,
    setDepositAmount,
    depositAmount,
  } = useGeneralContext();

  const {
    totalCollateral,
    freeCollateral: freeCollat,
    totalValue,
    availableBalance,
    unsettledPnL,
    positions,
    accountInfo,
  } = useCollateral({
    dp: 2,
  });
  const { usdc } = useHoldingStream();

  useEffect(() => {
    if (usdc && usdc.holding !== activeHoldings) {
      setActiveHoldings(usdc.holding);
      setDepositAmount(null);
    }
  }, [usdc]);
  console.log("accountInstance", usdc);

  useSettleSubscription({
    onMessage: (data: any) => {
      const { status } = data;
      switch (status) {
        case "COMPLETED":
          triggerAlert("Success", "Settlement has been completed.");
          setIsSettleLoading(false);
          break;
        case "FAILED":
          triggerAlert("Error", "Settlement has failed.");
          setIsSettleLoading(false);
          break;
        default:
          break;
      }
    },
  });

  const [isTokenQuantity, setIsTokenQuantity] = useState(true);
  const [values, setValues] = useState(defaultValues);
  const [inputErrors, setInputErrors] = useState({
    input_quantity: false,
    input_price_max: false,
    input_price_min: false,
  });
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
      side: values.direction as OrderSide,
      order_type: values.type as any,
      order_quantity: values.quantity,
    },
    { watchOrderbook: true }
  );

  const newMaxQty = useMaxQty(asset?.symbol, values.direction as OrderSide);

  // const isAlgoOrder = values?.algo_order_id !== undefined;

  const rangeInfo = useSymbolPriceRange(
    asset.symbol,
    values.direction,
    undefined
  );

  const symbolInfo = useSymbolsInfo();

  const symbols = Object.values(symbolInfo)
    .filter((cur) => typeof cur !== "boolean")
    .map((cur) => {
      if (typeof cur === "boolean") return;
      const symbol = cur();
      return symbol;
    });
  const currentAsset = symbols?.find((cur) => cur.symbol === asset?.symbol);

  const submitForm = async () => {
    if (rangeInfo?.max && Number(values?.price) > rangeInfo?.max) return;
    if (rangeInfo?.min && Number(values?.price) < rangeInfo?.min) return;

    const errors = await getValidationErrors(
      values,
      asset.symbol,
      validator,
      currentAsset?.base_tick
    );
    if (errors && Object.keys(errors)?.length > 0) {
      if (errors?.total?.message) {
        triggerAlert("Error", errors?.total?.message);
        return;
      }
      if (errors?.order_quantity?.message)
        triggerAlert("Error", errors?.order_quantity?.message);
      return;
    }

    if (Number(values.quantity || 0) >= currentAsset?.base_max) {
      triggerAlert(
        "Error",
        `Invalid quantity. Max quantity ${currentAsset?.base_max} ${currentAsset?.symbol}`
      );
      return;
    }

    if (Number(values.quantity || 0) <= currentAsset?.base_min) {
      triggerAlert(
        "Error",
        `Invalid quantity. Min quantity ${currentAsset?.base_min} ${currentAsset?.symbol}`
      );
      return;
    }
    try {
      const val = getInput(values, asset.symbol, currentAsset?.base_tick);
      await onSubmit(val);
      triggerAlert("Success", "Order executed.");
      setOrderPositions(val as any);
      setValues({
        ...defaultValues,
        quantity: newMaxQty.toString(),
        direction: values.direction,
      });
      setSliderValue(100);
    } catch (err) {
      triggerAlert("Error", "The margin will be insufficient after");
    }
  };

  const getStyleFromType = () => {
    return values.direction === "BUY"
      ? "left-[3px] bg-green"
      : "left-calc-slide-long bg-red";
  };
  const style = getStyleFromType();

  const getSectionBarPosition = () => {
    if (values.type === "MARKET") return "left-0";
    else if (values.type === "LIMIT") return "left-1/3";
    else return "left-2/3";
  };
  const barPosition = getSectionBarPosition();

  const handleButtonLongClick = async () => {
    if (state.status === 0) setIsWalletConnectorOpen(true);
    else if (state.status === 2 || state.status === 4)
      setIsEnableTradingModalOpen(true);
    else {
      if (values.type === "LIMIT") {
        if (Number(values.price) > (rangeInfo?.max as number)) {
          setInputErrors((prev) => ({
            ...prev,
            input_price_max: true,
          }));
          return;
        } else if (Number(values.price) < (rangeInfo?.min as number)) {
          setInputErrors((prev) => ({
            ...prev,
            input_price_min: true,
          }));
          return;
        }
      }
      submitForm();
    }
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
      if (values.direction === "BUY")
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

  const [maxLeverage] = useLeverage();

  function percentageToValue(percentage: number | undefined) {
    return ((percentage as number) / 100) * newMaxQty;
  }
  function toPercentage(value: number) {
    const percentage = (value / newMaxQty) * 100;
    return percentage;
  }

  const getSymbolForPair = () => {
    const formatted = asset.symbol.split("_")[1];
    return formatted;
  };
  const handleValueChange = (name: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? ""
          : Number(value) === 0 || name !== "quantity"
          ? value
          : getFormattedAmount(value),
    }));

    if (name === "quantity") setSliderValue(toPercentage(Number(value)));
  };

  const [data] = usePositionStream();

  const [sliderValue, setSliderValue] = useState(toPercentage(newMaxQty));

  const handleInputErrors = (boolean: boolean, name: string) => {
    setInputErrors((prev) => ({
      ...prev,
      [name]: boolean,
    }));
  };

  useEffect(() => {
    if (newMaxQty) {
      setValues((prev) => ({
        ...prev,
        quantity: newMaxQty.toString(),
      }));
      setSliderValue(100);
    }
  }, [newMaxQty !== 0, maxLeverage, values.direction]);

  const formatPercentage = (value: number) => {
    return (value / 100).toFixed(3) + "%";
  };

  const imrFactor = accountInfo?.imr_factor[currentAsset?.symbol] || 0;
  const maxNotional = accountInfo?.max_notional[currentAsset?.symbol] || 0;
  const [positionPnL, proxy, states] = usePositionStream();

  const [isTooltipDepositOpen, setIsTooltipDepositOpen] = useState(false);

  useEffect(() => {
    if (!depositAmount) setIsTooltipDepositOpen(false);
  }, [depositAmount]);

  return (
    <section className="h-full w-full text-white">
      {isMobile ? null : <Leverage />}
      <div className="flex items-center w-full h-[36px] sm:h-[44px] relative">
        {marketType.map((type, i) => (
          <button
            key={i}
            className="w-1/3 h-full text-white text-xs font-medium"
            onClick={() => handleValueChange("type", type.toUpperCase())}
          >
            {type}
          </button>
        ))}
        <button
          className="w-1/3 h-full text-white text-xs opacity-50 cursor-not-allowed font-medium flex items-center justify-center"
          // onClick={() => setIsTooltipMarketTypeOpen((prev) => !prev)}
        >
          {values.type !== "MARKET" && values.type !== "LIMIT"
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
                onClick={() => handleValueChange("direction", "BUY")}
              >
                Buy
              </button>
              <button
                className="w-1/2 z-10 h-[28px] sm:h-[34px] text-white rounded-r text-xs sm:text-[13px]"
                onClick={() => handleValueChange("direction", "SELL")}
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
              {getFormattedAmount(freeCollateral)} USDC
            </p>
          </div>

          {values.type === "STOPLIMIT" ? (
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
          {values.type !== "MARKET" ? (
            <>
              <div
                className={`flex items-center h-[35px] bg-terciary justify-between w-full border ${
                  inputErrors.input_price_max || inputErrors.input_price_min
                    ? "border border-red"
                    : "border-borderColor-DARK"
                } rounded mt-2 transition-all duration-100 ease-in-out`}
              >
                <input
                  name="size"
                  className="w-full pl-2 text-white text-sm h-full"
                  placeholder="Price"
                  type="number"
                  onChange={(e) => {
                    handleInputErrors(false, "input_price_max");
                    handleInputErrors(false, "input_price_min");
                    handleValueChange("price", e.target.value);
                  }}
                  value={values.price}
                />
                <button
                  onClick={() =>
                    handleValueChange("price", markPrice.toString())
                  }
                  className="text-sm text-base_color font-medium mr-1"
                >
                  Last
                </button>
                <p className="px-2 text-white text-sm">USD</p>
              </div>
              <p
                className={`text-red w-full text-xs mt-1 mb-1.5 pointer-events-none ${
                  inputErrors.input_price_max || inputErrors.input_price_min
                    ? "opacity-100 static"
                    : "opacity-0 absolute"
                } transition-all duration-100 ease-in-out`}
              >
                {(Number(values.price) as number) >
                (rangeInfo?.max as number) ? (
                  <>
                    Price can&apos;t exceed {getFormattedAmount(rangeInfo?.max)}
                  </>
                ) : (
                  <>
                    Price can&apos;t be lower than{" "}
                    {getFormattedAmount(rangeInfo?.min)}
                  </>
                )}
              </p>
            </>
          ) : null}
          <div
            className={`flex items-center h-[35px] bg-terciary justify-between ${
              inputErrors.input_quantity
                ? "border border-red"
                : "border-borderColor-DARK"
            } w-full border  rounded mt-2`}
          >
            <input
              name="quantity"
              className={`w-full pl-2 text-white text-sm h-full`}
              placeholder="Quantity"
              onChange={(e) => {
                if (e.target.value === "") {
                  handleInputErrors(false, "input_quantity");
                  handleValueChange("quantity", "");
                } else if (Number(e.target.value) > maxQty) {
                  handleValueChange("quantity", e.target.value);
                  handleInputErrors(true, "input_quantity");
                } else {
                  handleValueChange("quantity", e.target.value);
                  handleInputErrors(false, "input_quantity");
                }
              }}
              type="number"
              disabled={!freeCollateral || !address}
              value={
                parseFloat(values.quantity as string) === 0
                  ? values.quantity
                  : getFormattedAmount(values.quantity).toString()
              }
            />
            <button
              className="rounded text-[12px] flex items-center
             justify-center min-w-[50px] pl-1 text-white font-medium h-[24px] ml-1 w-fit pr-2"
            >
              <p className="px-2 text-white text-sm">{getSymbolForPair()}</p>
              <IoChevronDown className="text-white text-xs " />
            </button>
            {/* <Popover>
              <PopoverTrigger className="h-full min-w-fit">
              
              </PopoverTrigger>
              <PopoverContent
                sideOffset={0}
                className="flex flex-col p-1.5 z-[102] w-fit whitespace-nowrap bg-secondary border border-borderColor shadow-xl"
              >
                <button
                  onClick={() => setIsTokenQuantity((prev) => !prev)}
                  className={`h-[22px] ${
                    isTokenQuantity ? "text-base_color font-bold" : "text-white"
                  } w-fit px-1 text-xs`}
                >
                  {formatSymbol(asset?.symbol, true)}
                </button>
                <button
                  onClick={() => setIsTokenQuantity((prev) => !prev)}
                  className={`h-[22px] ${
                    !isTokenQuantity
                      ? "text-base_color font-bold"
                      : "text-white"
                  } w-fit px-1 text-xs`}
                >
                  USDC
                </button>
              </PopoverContent>
            </Popover> */}
          </div>
          <p
            className={`text-red w-full text-[11px] mt-1 mb-1.5 pointer-events-none ${
              inputErrors.input_quantity
                ? "opacity-100 static"
                : "opacity-0 absolute"
            }`}
          >
            Quantity can&apos;t exceed {getFormattedAmount(maxQty)}{" "}
            {getSymbolForPair()}
          </p>
          <div className={`mt-2 flex items-center `}>
            <Slider
              value={[sliderValue]}
              max={100}
              step={1}
              onValueChange={(value) => {
                setSliderValue(value[0]);
                handleInputErrors(false, "input_quantity");
                const newQuantity = percentageToValue(value[0]);

                handleValueChange("quantity", newQuantity.toString());
              }}
              isBuy={values.direction === "BUY"}
            />
            <div className="w-[57px] px-2 flex items-center justify-center ml-4 h-fit bg-terciary border border-borderColor-DARK rounded">
              <input
                name="quantity"
                className="w-[30px] text-white text-sm h-[25px]"
                type="number"
                min={0}
                max={100}
                disabled={!freeCollateral || !address}
                onChange={(e) => {
                  if (!e.target.value) {
                    setSliderValue(0);
                    const newQuantity = percentageToValue(undefined);
                    handleValueChange("quantity", newQuantity.toString());
                    return;
                  }
                  if (
                    parseFloat(e.target.value) >= 0 &&
                    parseFloat(e.target.value) <= 100
                  ) {
                    const newQuantity = percentageToValue(
                      parseInt(e.target.value)
                    );
                    handleValueChange("quantity", newQuantity.toString());
                    setSliderValue(Number(e.target.value));
                  }
                }}
                value={
                  toPercentage(values.quantity as never)
                    .toFixed(0)
                    .toString() || "0"
                }
              />
              <p className="text-font-80 text-sm">%</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-font-60">Est. Liq. price</p>
            <p className="text-xs text-white font-medium">
              {getFormattedAmount(Number(estLiqPrice)) || "--"}{" "}
              <span className="text-font-60">USDC</span>
            </p>
          </div>
          <div className="flex items-center justify-between mt-2 border-b border-borderColor pb-3">
            <p className="text-xs text-font-60">Account leverage</p>
            <p className="text-xs text-white font-medium">
              {estLeverage || "--"}x
            </p>
          </div>

          <button
            className="text-xs text-white mt-3 flex items-center justify-between w-full"
            onClick={() => {
              setValues((prev) => ({
                ...prev,
                reduce_only: !prev.reduce_only,
              }));
            }}
          >
            <p>Reduce only</p>
            <div
              className={`w-[15px] p-0.5 h-[15px] rounded border ${
                values.reduce_only
                  ? "border-base_color"
                  : "border-[rgba(255,255,255,0.3)]"
              } transition-all duration-100 ease-in-out`}
            >
              <div
                className={`w-full h-full rounded-[1px] bg-base_color ${
                  values.reduce_only ? "opacity-100" : "opacity-0"
                } transition-all duration-100 ease-in-out`}
              />
            </div>
          </button>
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
          </button> */}
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
        {/* <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-font-60">Initial Margin Ratio</p>
          <p className="text-xs text-white font-medium">
            {(currentAsset?.base_imr * 100).toFixed(2)}%
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-font-60">Maintenance Margin Ratio</p>
          <p className="text-xs text-white font-medium">
            {(currentAsset?.base_mmr * 100).toFixed(2)}%
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-font-60">Max Quantity</p>
          <p className="text-xs text-white font-medium">
            {currentAsset?.base_max} {currentAsset?.base}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-font-60">Min Notional</p>
          <p className="text-xs text-white font-medium">
            {currentAsset?.min_notional} {currentAsset?.quote}
          </p>
        </div> */}
        <div className="pt-4 border-t border-borderColor hidden md:block">
          <div className="pb-4">
            <div className="flex items-center justify-between">
              <div
                className="relative"
                onMouseEnter={() => {
                  if (depositAmount) {
                    setIsTooltipDepositOpen(true);
                  }
                }}
                onMouseLeave={() => {
                  if (depositAmount) {
                    setIsTooltipDepositOpen(false);
                  }
                }}
              >
                <div
                  className={`absolute ${
                    isTooltipDepositOpen
                      ? "opacity-100 "
                      : "opacity-0 pointer-events-none translate-y-[1%]"
                  } transition-all duration-200 h-fit rounded-md border border-borderColor ease-in-out  top-[105%] w-[180px] p-2.5 left-1/2 -translate-x-1/2 bg-secondary z-[10] shadow-xl shadow-[rgba(0,0,0,0.2)]`}
                >
                  <p className="text-xs text-font-80">
                    Your deposit has been successfully received. The funds will
                    be available in your account shortly.
                  </p>
                </div>
                <p className="text-xs text-font-60 mb-[3px]">Total Value</p>
                <p
                  className={`text-base font-medium ${
                    depositAmount
                      ? "animate-pulse text-base_color"
                      : " text-white"
                  } transition-opacity duration-1000 ease-in-out`}
                >
                  {totalValue} {positionPnL.aggregated.unrealizedPnl}
                </p>
              </div>
              {/* <IoChevronDown className="text-xl" /> */}
              <div>
                <p className="text-xs text-font-60 mb-[3px] text-end">
                  Unreal PnL
                </p>
                <p
                  className={`text-sm font-medium ${
                    data?.aggregated.unrealPnL > 0
                      ? "text-green"
                      : data?.aggregated.unrealPnL < 0
                      ? "text-red"
                      : "text-white"
                  }`}
                >
                  {getFormattedAmount(data?.aggregated.unrealPnL)} (
                  {data?.aggregated.unrealPnlROI.toFixed(2)}
                  %)
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-xs text-font-60 mb-1">Unsettled PnL</p>
                <p
                  className={`text-sm font-medium ${
                    unsettledPnL > 0
                      ? "text-green"
                      : unsettledPnL < 0
                      ? "text-red"
                      : "text-white"
                  }`}
                >
                  {getFormattedAmount(unsettledPnL)}{" "}
                </p>
              </div>
              <button
                onClick={() => {
                  if (unsettledPnL !== 0 && accountInstance) {
                    setIsSettleLoading(true);
                    accountInstance?.settle();
                  }
                }}
                className={`${
                  unsettledPnL !== 0 ? "" : "opacity-40 pointer-events-none"
                } flex items-center border border-borderColor hover:bg-terciary 
                rounded px-2 py-1 text-xs text-white transition-all duration-100 ease-in-out`}
              >
                {isSettleLoading ? (
                  <Oval
                    visible={true}
                    height="13"
                    width="13"
                    color="#FFF"
                    secondaryColor="rgba(255,255,255,0.6)"
                    ariaLabel="oval-loading"
                    strokeWidth={6}
                    strokeWidthSecondary={6}
                    wrapperStyle={{
                      marginRight: "5px",
                    }}
                    wrapperClass=""
                  />
                ) : (
                  <MdRefresh className="text-[13px] mr-[5px]" />
                )}
                <span>Settle PnL</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-borderColor pt-4">
          <p className="text-xs text-font-60">Margin Required</p>
          <p className="text-xs text-white font-medium">
            {(imrFactor * 100).toFixed(4)}%
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pb-4">
          <p className="text-xs text-font-60">Fees (Maker / Taker)</p>
          <p className="text-xs text-white font-medium">
            {accountInfo?.futures_maker_fee_rate
              ? formatPercentage(accountInfo?.futures_maker_fee_rate as number)
              : "0.03"}{" "}
            /{" "}
            {accountInfo?.futures_taker_fee_rate
              ? formatPercentage(accountInfo?.futures_taker_fee_rate as number)
              : "0.03"}
          </p>
        </div>
      </div>
    </section>
  );
};

async function getValidationErrors(
  data: Inputs,
  symbol: string,
  validator: ReturnType<typeof useOrderEntry>["helper"]["validator"],
  base_tick: number
): Promise<
  ReturnType<ReturnType<typeof useOrderEntry>["helper"]["validator"]>
> {
  return validator(getInput(data, symbol, base_tick));
}

function getInput(
  data: Inputs,
  symbol: string,
  base_tick: number
): OrderEntity {
  return {
    symbol,
    side: data.direction as OrderSide,
    order_type: data.type.toUpperCase() as any,
    order_price: isNaN(Number(data.price)) ? undefined : Number(data.price),
    order_quantity: formatQuantity(Number(data.quantity), base_tick),
    trigger_price: data.triggerPrice,
    reduce_only: data.reduce_only,
  };
}
