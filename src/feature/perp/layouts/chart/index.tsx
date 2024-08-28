import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { cn } from "@/utils/cn";
import { formatSymbol } from "@/utils/misc";
import { usePositionStream, useWS } from "@orderly.network/hooks";
import { useEffect, useRef, useState } from "react";
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
  const { isChartLoading, setIsChartLoading } = useGeneralContext();
  const ref = useRef<HTMLDivElement>(null);
  const [tvWidget, setTvWidget] = useState<any>(null);
  const ws = useWS();
  const { orderPositions } = useGeneralContext();
  const [orders] = usePositionStream();
  const [chartLines, setChartLines] = useState<{ [key: string]: any }>({});

  const chartInit = () => {
    if (!asset) return;

    import("../../../../../public/static/charting_library").then(
      ({ widget: Widget }) => {
        if (!ref.current) return;

        const widgetInstance = new Widget({
          datafeed: Datafeed(asset, ws, setIsChartLoading) as any,
          symbol: formatSymbol(asset?.symbol),
          container: ref.current,
          container_id: ref.current.id,
          locale: "en",
          fullscreen: false,
          enabled_features: ENABLED_FEATURES,
          disabled_features: [
            ...DISABLED_FEATURES,
            ...(mobile
              ? ["left_toolbar"]
              : ["show_right_widgets_panel_by_default"]),
          ],
          timezone: Intl.DateTimeFormat().resolvedOptions()
            .timeZone as Timezone,
          autosize: true,
          theme: "Dark",
          loading_screen: { backgroundColor: "#1B1D22" },
          overrides: overrides as any,
          studies_overrides: {
            "volume.volume.color.0": "#ea3943",
            "volume.volume.color.1": "#0ECB81",
          },
          ...widgetOptionsDefault,
        });

        widgetInstance.onChartReady(() => {
          widgetInstance.applyOverrides((overrides as any) || {});
          setTvWidget(widgetInstance);
        });
      }
    );
  };

  const updatePositions = (chart: any) => {
    if ((orders?.rows?.length as number) > 0) {
      Object.values(chartLines).forEach((line) => line.remove());
      const newChartLines: { [key: string]: any } = {};

      (orders?.rows as any).forEach((position: any) => {
        const openPriceLine = chart
          .createOrderLine()
          .setText("Open Price")
          .setPrice(position?.average_open_price || 150)
          .setLineWidth(2)
          .setQuantity(position?.position_qty)
          .setBodyTextColor("#000")
          .setBodyBackgroundColor("#836EF9")
          .setBodyBorderColor("#836EF9")
          .setBodyTextColor("#FFF")
          .setLineColor("#836EF9")
          .setQuantityBackgroundColor("#836EF9")
          .setQuantityBorderColor("#836EF9");

        newChartLines[`open_${position?.algo_order?.algo_order_id}`] =
          openPriceLine;

        if (position.tp_trigger_price) {
          const tpLine = chart
            .createOrderLine()
            .setText("Take Profit")
            .setPrice(position.tp_trigger_price || 150)
            .setLineWidth(2)
            .setQuantity("")
            .setBodyTextColor("#000")
            .setBodyBackgroundColor("#427af4")
            .setBodyBorderColor("#427af4")
            .setBodyTextColor("#FFF")
            .setLineColor("#427af4");

          newChartLines[`tp_${position?.algo_order?.algo_order_id}`] = tpLine;
        }

        if (position.sl_trigger_price) {
          const slLine = chart
            .createOrderLine()
            .setText("Stop Loss")
            .setPrice(position?.sl_trigger_price || 150)
            .setLineWidth(2)
            .setQuantity("")
            .setBodyTextColor("#000")
            .setBodyBackgroundColor("#F5921A")
            .setBodyBorderColor("#F5921A")
            .setBodyTextColor("#FFF")
            .setLineColor("#F5921A");

          newChartLines[`sl_${position?.algo_order?.algo_order_id}`] = slLine;
        }
      });

      setChartLines(newChartLines);
    }
  };

  useEffect(() => {
    if (tvWidget?.activeChart && orderPositions?.length > 0) {
      const chart = tvWidget.activeChart();
      updatePositions(chart);
    }
  }, [tvWidget, orderPositions, orders?.rows]);

  useEffect(() => {
    chartInit();
    return () => {
      if (tvWidget !== null) {
        tvWidget.remove();
        setTvWidget(null);
      }
    };
  }, [asset?.symbol, custom_css_url, mobile]);

  return (
    <div className="relative w-full chart">
      <div
        className={`absolute z-10  bg-secondary w-full ${
          isChartLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-all duration-200 ease-in-out h-full`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <img src="/loader/loader.gif" className="w-[150px]" />
        </div>
      </div>
      <div className={cn(`w-full h-full`, className)} ref={ref} />
    </div>
  );
};

export default TradingViewChart;
