import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { useRef } from "react";
import { OpenTrade } from "../open-trade";
import { Orderbook } from "../orderbook";
import { TriggerMobileTradeCreator } from "./trigger";

type MobileOpenTradeProps = {
  asset: FuturesAssetProps;
};

export const MobileOpenTrade = ({ asset }: MobileOpenTradeProps) => {
  const { showMobileTradeCreator, setShowMobileTradeCreator } =
    useGeneralContext();
  const tradeCreatorRef = useRef<HTMLDivElement>(null);
  const getPositionFromContainerRef = () => {
    const clientHeight = tradeCreatorRef?.current?.clientHeight || 0;
    return `calc(100% - ${clientHeight}px)`;
  };
  return (
    <>
      <div
        onClick={() => setShowMobileTradeCreator(false)}
        className={`fixed top-0 h-screen w-full z-[100] left-0 ${
          showMobileTradeCreator
            ? "opacity-20"
            : "opacity-0 pointer-events-none"
        } transition-all duration-200 ease-in-out bg-secondary z-30`}
      />
      <div
        ref={tradeCreatorRef}
        style={{
          top: showMobileTradeCreator ? getPositionFromContainerRef() : "100%",
        }}
        className={`fixed h-fit w-full md:w-[350px] z-[100] left-0  transition-all duration-200 ease-in-out bg-secondary border-t border-borderColor shadow-2xl flex`}
      >
        <OpenTrade isMobile />
        <Orderbook asset={asset} isMobileOpenTrade isMobile />
      </div>
      {showMobileTradeCreator ? null : <TriggerMobileTradeCreator />}
    </>
  );
};
