import { FuturesAssetProps } from "@/models";
import { cn } from "@/utils/cn";
import { formatSymbol } from "@/utils/misc";
import { useWS } from "@orderly.network/hooks";
import { useEffect, useRef } from "react";
import { Timezone } from "../../../../../public/static/charting_library/charting_library";
import { DISABLED_FEATURES, ENABLED_FEATURES } from "./constant";
import { Datafeed } from "./datafeed";
import { widgetOptionsDefault } from "./helper";
import { overrides } from "./theme";

interface TradingViewChartProps {
  asset: FuturesAssetProps;
  mobile?: boolean;
  custom_css_url?: string;
  className?: string;
}

const TradingViewChart = ({
  asset,
  mobile = false,
  custom_css_url = "../themed.css",
  className = "",
}: TradingViewChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const ws = useWS();
  const chartInit = () => {
    if (!asset) return () => {};
    import("../../../../../public/static/charting_library").then(
      ({ widget: Widget }) => {
        if (!ref.current) return;

        const tvWidget = new Widget({
          datafeed: Datafeed(asset, ws) as any,
          symbol: formatSymbol(asset?.symbol),
          container: ref.current,
          container_id: ref.current.id,
          locale: "en",
          fullscreen: false,
          enabled_features: ENABLED_FEATURES,
          disabled_features: [
            ...DISABLED_FEATURES,
            ...(mobile ? ["left_toolbar"] : []),
          ],
          timezone: Intl.DateTimeFormat().resolvedOptions()
            .timeZone as Timezone,
          autosize: true,
          theme: "Dark",
          // toolbar_bg: "rgba(21, 25, 41, 1)",
          loading_screen: { backgroundColor: "rgba(21, 25, 41, 1)" },
          studies_overrides: {
            "volume.volume.color.0": "rgba(14, 203, 129,0.3)",
            "volume.volume.color.1": "rgba(234, 57, 67, 0.3)",
          },
          ...widgetOptionsDefault,
        });

        (window as any).tvWidget = tvWidget;

        (window as any).tvWidget.onChartReady(() => {
          (window as any).tvWidget?.applyOverrides(overrides() || {});
        });
      }
    );
  };

  useEffect(() => {
    (window as any).tvWidget = null;

    chartInit();

    return () => {
      if ((window as any).tvWidget !== null) {
        (window as any).tvWidget?.remove();
        (window as any).tvWidget = null;
      }
    };
  }, [asset?.symbol, custom_css_url, mobile]);

  return (
    <div className="relative w-full">
      <div
        className={cn(`w-full h-[450px] sm:h-[600px]`, className)}
        ref={ref}
      />
    </div>
  );
};

export default TradingViewChart;
