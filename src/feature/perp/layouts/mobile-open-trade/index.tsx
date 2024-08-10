import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { OpenTrade } from "../open-trade";
import { Orderbook } from "../orderbook";
import { TriggerMobileTradeCreator } from "./trigger";

type MobileOpenTradeProps = {
  asset: FuturesAssetProps;
};

export const MobileOpenTrade = ({ asset }: MobileOpenTradeProps) => {
  const { showMobileTradeCreator, setShowMobileTradeCreator } =
    useGeneralContext();
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
        className={`fixed top-calc-mobile-position h-fit w-full sm:w-[350px] z-[100] left-0 ${
          showMobileTradeCreator ? "translate-y-0" : "translate-y-full"
        } transition-all duration-200 ease-in-out bg-secondary border-t border-borderColor shadow-2xl flex`}
      >
        <OpenTrade isMobile />
        <Orderbook asset={asset} isMobile />
      </div>
      <TriggerMobileTradeCreator />
    </>
  );
};
