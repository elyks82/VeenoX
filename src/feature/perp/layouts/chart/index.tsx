import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { cn } from "@/utils/cn";
import { formatSymbol } from "@/utils/misc";
import { useWS } from "@orderly.network/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IChartingLibraryWidget,
  Timezone,
} from "../../../../../public/static/charting_library/charting_library";
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

interface ChartElement {
  id: string;
  name: string;
  [key: string]: any;
}

interface ChartState {
  drawings: ChartElement[];
  studies: ChartElement[];
  symbol: string;
  interval: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  asset,
  mobile = false,
  custom_css_url = "../themed.css",
  className = "",
}) => {
  const { isChartLoading, setIsChartLoading } = useGeneralContext();
  const ref = useRef<HTMLDivElement>(null);
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null);
  const ws = useWS();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const saveChartState = useCallback(
    (chart: any) => {
      if (!isInitialLoadComplete) {
        console.log("Initial load not complete, skipping save");
        return;
      }

      const currentState: ChartState = {
        drawings: chart.getAllShapes(),
        studies: chart.getAllStudies(),
        symbol: chart.symbol(),
        interval: chart.resolution(),
      };

      const savedStateString = localStorage.getItem("chartState");
      const savedState: ChartState = savedStateString
        ? JSON.parse(savedStateString)
        : { drawings: [], studies: [], symbol: "", interval: "" };

      const updateElements = (
        currentElements: ChartElement[],
        savedElements: ChartElement[]
      ) => {
        return currentElements.filter((curr) => {
          if (curr.name === "Volume") return false;
          const existingElement = savedElements.find(
            (saved) => saved.name === curr.name
          );
          if (existingElement) {
            return false;
          }
          return true;
        });
      };

      const updatedState: ChartState = {
        drawings: updateElements(currentState.drawings, savedState.drawings),
        studies: updateElements(currentState.studies, savedState.studies),
        symbol: currentState.symbol,
        interval: currentState.interval,
      };

      updatedState.drawings = [
        ...updatedState.drawings,
        ...savedState.drawings.filter((s) =>
          currentState.drawings.some((c) => c.name === s.name)
        ),
      ];
      updatedState.studies = [
        ...updatedState.studies,
        ...savedState.studies.filter((s) =>
          currentState.studies.some((c) => c.name === s.name)
        ),
      ];

      localStorage.setItem("chartState", JSON.stringify(updatedState));
    },
    [isInitialLoadComplete]
  );

  const loadSavedState = async (chart: any) => {
    return new Promise<void>((resolve) => {
      const savedState = localStorage.getItem("chartState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);

        if (typeof chart.setSymbol === "function") {
          try {
            chart.setSymbol(parsedState.symbol, parsedState.interval);
          } catch (error) {
            console.error("Error setting symbol:", error);
          }
        } else {
          console.warn("setSymbol is not available or not a function");
        }

        const promises = [];

        parsedState.drawings.forEach((drawing: any) => {
          try {
            promises.push(chart.createShape(drawing.point, drawing.options));
          } catch (error) {
            console.error("Error creating shape:", error);
          }
        });

        parsedState.studies.forEach((study: any) => {
          if (study.name !== "Volume") {
            try {
              promises.push(
                chart.createStudy(
                  study.name,
                  study.forceOverlay,
                  study.lock,
                  study.inputs,
                  study.overrides,
                  study.options
                )
              );
            } catch (error) {
              console.error("Error creating study:", error);
            }
          }
        });

        Promise.all(promises)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error("Error loading saved items:", error);
            resolve();
          });
      } else {
        resolve();
      }
    });
  };

  const setupChangeListeners = useCallback(
    (widget: IChartingLibraryWidget) => {
      const chart = widget.activeChart();

      const saveState = () => {
        saveChartState(chart);
      };

      try {
        chart.onDataLoaded().subscribe(null, saveState);
        chart.onSymbolChanged().subscribe(null, saveState);
        chart.onIntervalChanged().subscribe(null, saveState);
      } catch (error) {
        console.error("Error setting up chart listeners:", error);
      }

      const observer = new MutationObserver((mutations) => {
        console.log("DOM mutation detected");
        saveState();
      });

      const config = { attributes: true, childList: true, subtree: true };
      observer.observe(ref.current!, config);

      return () => {
        try {
          chart.onDataLoaded().unsubscribeAll();
          chart.onSymbolChanged().unsubscribeAll();
          chart.onIntervalChanged().unsubscribeAll();
        } catch (error) {
          console.error("Error removing chart listeners:", error);
        }
        observer.disconnect();
      };
    },
    [saveChartState]
  );

  const initChart = useCallback(() => {
    if (!asset || !ref.current) return;

    import("../../../../../public/static/charting_library").then(
      ({ widget: Widget }) => {
        const widgetOptions = {
          symbol: formatSymbol(asset?.symbol),
          datafeed: Datafeed(asset, ws, setIsChartLoading),
          interval: "1D",
          container: ref.current,
          library_path: "/static/charting_library/",
          locale: "en",
          enabled_features: ENABLED_FEATURES,
          disabled_features: [
            ...DISABLED_FEATURES,
            ...(mobile ? ["left_toolbar"] : []),
          ],
          fullscreen: false,
          autosize: true,
          theme: "Dark",
          overrides: overrides,
          loading_screen: { backgroundColor: "#1B1D22" },
          timezone: Intl.DateTimeFormat().resolvedOptions()
            .timeZone as Timezone,
          ...widgetOptionsDefault,
        };

        const widgetInstance = new Widget(widgetOptions);

        widgetInstance.onChartReady(async () => {
          setTvWidget(widgetInstance);

          const chart = widgetInstance.activeChart();

          try {
            await loadSavedState(chart);
          } catch (error) {
            console.error("Error loading saved state:", error);
          }
          setIsInitialLoadComplete(true);
          const cleanup = setupChangeListeners(widgetInstance);

          return cleanup;
        });
      }
    );
  }, [asset, mobile, ws, setupChangeListeners]);

  useEffect(() => {
    initChart();
    return () => {
      if (tvWidget) {
        tvWidget.remove();
        setTvWidget(null);
      }
    };
  }, [asset?.symbol, custom_css_url, mobile, initChart]);

  return (
    <div className="relative w-full chart">
      <div
        className={cn(
          `absolute z-10 bg-secondary w-full transition-all duration-200 ease-in-out h-full`,
          isChartLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="w-full h-full flex items-center justify-center">
          <img src="/loader/loader.gif" className="w-[150px]" alt="Loading" />
        </div>
      </div>
      <div className={cn(`w-full h-full`, className)} ref={ref} />
    </div>
  );
};

export default TradingViewChart;
