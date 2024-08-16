import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { useEffect, useRef, useState } from "react";
import { OpenTrade } from "../open-trade";
import { Orderbook } from "../orderbook";
import { TriggerMobileTradeCreator } from "./trigger";

type MobileOpenTradeProps = {
  asset: FuturesAssetProps;
  holding?: number;
};

export const MobileOpenTrade = ({ asset, holding }: MobileOpenTradeProps) => {
  const { showMobileTradeCreator, setShowMobileTradeCreator } =
    useGeneralContext();
  const tradeCreatorRef = useRef<HTMLDivElement>(null);
  const { tradeInfo } = useGeneralContext();
  const [position, setPosition] = useState("100%");

  useEffect(() => {
    if (showMobileTradeCreator) {
      const clientHeight = tradeCreatorRef?.current?.clientHeight || 0;
      setPosition(`calc(100% - ${clientHeight}px)`);
    }
  }, [showMobileTradeCreator, tradeInfo.type, tradeInfo.tp_sl]);
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
          top: showMobileTradeCreator ? position : "100%",
        }}
        className={`fixed h-fit w-full md:w-[350px] z-[100] left-0  transition-all duration-200 ease-in-out bg-secondary border-t border-borderColor shadow-2xl flex`}
      >
        <OpenTrade isMobile holding={holding} />
        <Orderbook asset={asset} isMobileOpenTrade isMobile />
      </div>
      {showMobileTradeCreator ? null : <TriggerMobileTradeCreator />}
    </>
  );
};
