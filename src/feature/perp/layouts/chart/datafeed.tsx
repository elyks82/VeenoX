import { fetchMarketHistory } from "@/api/fetchMarketHistory";
import {
  BarsSymbolInfoProps,
  CustomBarProps,
  FuturesAssetProps,
} from "@/models";
import { getNextBarTime, resolutionToTimeframe } from "@/utils/misc";
import { WS } from "@orderly.network/net";
import { Dispatch, SetStateAction } from "react";

export const supportedResolutions = [
  "1",
  "3",
  "5",
  "15",
  "60",
  "120",
  "240",
  "1D",
  "7D",
  "1M",
];

const sockets = new Map<string, WS>();
const lastBarsCache = new Map();

export const Datafeed = (
  asset: FuturesAssetProps,
  ws: WS,
  setIsChartLoading: Dispatch<SetStateAction<boolean>>
) => ({
  onReady: (callback: Function) => {
    callback({ supported_resolutions: supportedResolutions });
  },
  resolveSymbol: (symbolName: string, onResolve: Function) => {
    const price = asset?.mark_price || 1;
    const params = {
      name: symbolName,
      description: "",
      type: "crypto",
      session: "24x7",
      ticker: asset?.symbol,
      minmov: 1,
      pricescale: Math.min(
        10 ** String(Math.round(10000 / price)).length,
        10000000000000000
      ),
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "30", "60"],
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: "streaming",
    };
    onResolve(params);
  },
  getBars: async (
    symbolInfo: BarsSymbolInfoProps,
    resolution: string,
    periodParams: { from: number; to: number; firstDataRequest: boolean },
    onResult: Function
  ) => {
    const { from, to, firstDataRequest } = periodParams;

    const params = {
      symbol: symbolInfo.ticker,
      timeframe: resolution,
      from: from,
      to: to,
    };
    const data = await fetchMarketHistory(params);

    if (data && data.s === "ok" && data.o) {
      const bars = data.t.map((timestamp: number, index: number) => ({
        time: timestamp * 1000,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index],
      }));

      if (bars.length) {
        const mostRecentCandle = bars[bars.length - 1];
        onResult(bars, { noData: false });
        if (firstDataRequest) {
          lastBarsCache.set(symbolInfo.name, mostRecentCandle);
          console.log("lastBar", lastBarsCache.get(symbolInfo.name));
        }
      } else {
        onResult([], { noData: true });
      }
    } else {
      onResult([], { noData: true });
    }
  },
  searchSymbols: () => {},
  subscribeBars: (
    symbolInfo: BarsSymbolInfoProps,
    resolution: string,
    onRealtimeCallback: (bar: CustomBarProps) => void
  ) => {
    try {
      setIsChartLoading(false);
      const timeframe = resolutionToTimeframe(resolution);
      let lastDailyBarCache: CustomBarProps | null =
        lastBarsCache.get(symbolInfo.name) || null;
      let nextDailyBarTime: number | null = lastDailyBarCache
        ? getNextBarTime(resolution, lastDailyBarCache.time)
        : null;
      let initialDataLoaded = false;
      const unsubscribe = ws.subscribe(
        {
          id: `${symbolInfo.ticker}@kline_${timeframe}`,
          topic: `${symbolInfo.ticker}@kline_${timeframe}`,
          event: "subscribe",
        },
        {
          onMessage: (data: any) => {
            if (data) {
              const currentTimeInMs = data.endTime;
              const price = data.close;

              console.log("currentTimeInMs", currentTimeInMs);
              console.log("lastDailyBarCache", lastDailyBarCache?.time);
              // console.log(
              //   "nextDailyBarTimenextDailyBarTime",
              //   currentTimeInMs >= nextDailyBarTime
              // );
              if (lastDailyBarCache) {
                if (currentTimeInMs >= nextDailyBarTime!) {
                  console.log("Create  candle");
                  const bar: CustomBarProps = {
                    time: currentTimeInMs,
                    open: price,
                    high: price,
                    low: price,
                    close: price,
                    volume: data.volume,
                  };

                  lastDailyBarCache = bar;
                  lastBarsCache.set(symbolInfo.name, bar);
                  onRealtimeCallback(bar);

                  nextDailyBarTime = getNextBarTime(
                    resolution,
                    currentTimeInMs
                  );
                } else {
                  console.log("Update  candle");
                  const updatedBar: CustomBarProps = {
                    ...lastDailyBarCache,
                    high: Math.max(lastDailyBarCache.high, data.high),
                    low: Math.min(lastDailyBarCache.low, data.low),
                    close: price,
                    volume: lastDailyBarCache.volume + data.volume,
                  };

                  lastDailyBarCache = updatedBar;
                  lastBarsCache.set(symbolInfo.name, updatedBar);
                  nextDailyBarTime = getNextBarTime(
                    resolution,
                    currentTimeInMs
                  );

                  onRealtimeCallback(updatedBar);
                }
              } else {
                const bar: CustomBarProps = {
                  time: data.endTime,
                  open: data.open,
                  high: data.high,
                  low: data.low,
                  close: data.close,
                  volume: data.volume,
                };
                console.log("I set machin");
                lastDailyBarCache = bar;
                lastBarsCache.set(symbolInfo.name, bar);
              }
            }
          },
        }
      );

      return () => {
        if (unsubscribe) unsubscribe();
        sockets.delete(`${symbolInfo.name}@kline_${timeframe}`);
      };
    } catch (e) {
      console.log("e", e);
    }
    sockets.set(asset.name + "-" + subscriberUID, socket);
  },

  unsubscribeBars: (subscriberUID) => {
    console.log("Unsubscribe", baseAsset.name + "-" + subscriberUID);
    sockets.get(baseAsset.name + "-" + subscriberUID).close();
  },
  getMarks: () => ({}),
  getTimeScaleMarks: () => ({}),
  getServerTime: () => ({}),
});
