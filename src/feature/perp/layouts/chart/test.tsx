import { TradingView } from "@orderly.network/trading-view";
import { FC } from "react";

export const AdvancedChart: FC<{ symbol: string }> = ({ symbol }) => {
  return (
    <div className="w-full min-h-[35rem]">
      <TradingView
        symbol={"PERP_TON_USDC"}
        libraryPath="/static/charting_library/"
        tradingViewScriptSrc="/static/charting_library/charting_library.js"
        loadingElement={
          <div className="w-full h-full flex items-center justify-center">
            <img src="/loader/loader.gif" className="w-[150px]" />
          </div>
        }
        tradingViewCustomCssUrl="/static/pro.css"
        overrides={{
          "mainSeriesProperties.candleStyle.borderDownColor": "#DC2140",
          "mainSeriesProperties.candleStyle.borderUpColor": "#1F8040",

          "mainSeriesProperties.candleStyle.downColor": "#DC2140",
          "mainSeriesProperties.candleStyle.upColor": "#1F8040",

          "mainSeriesProperties.candleStyle.wickDownColor": "#DC2140",
          "mainSeriesProperties.candleStyle.wickUpColor": "#1F8040",
        }}
        displayControlSetting={{
          position: true,
          buySell: true,
          limitOrders: true,
          stopOrders: true,
          tpsl: true,
          positionTpsl: true,
        }}
      />
    </div>
  );
};
