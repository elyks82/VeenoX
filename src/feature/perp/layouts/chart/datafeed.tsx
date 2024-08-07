import { fetchMarketHistory } from "@/api/fetchMarketHistory";
import { resolutionToTimeframe } from "@/utils/misc";

export const supportedResolutions = [
  "1",
  "5",
  "15",
  "60",
  "120",
  "240",
  "24H",
  "7D",
  "30D",
];

const lastBarsCache = new Map();

export const Datafeed = (asset, ws) => ({
  onReady: (callback: Function) => {
    callback({ supported_resolutions: supportedResolutions });
  },
  resolveSymbol: (symbolName: string, onResolve: Function) => {
    const price = asset?.mark_price;
    const params = {
      name: symbolName,
      description: "",
      type: "crypto",
      session: "24x7",
      ticker: symbolName,
      minmov: 1,
      pricescale: Math.min(
        10 ** String(Math.round(10000 / price)).length,
        10000000000000000
      ),
      has_intraday: true,
      intraday_multipliers: ["1", "3", "5", "15", "30", "60"],
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: "streaming",
    };
    onResolve(params);
  },
  getBars: async (
    symbolInfo,
    resolution: string,
    periodParams,
    onResult: Function
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    const params = {
      symbol: "PERP_SOL_USDC",
      timeframe: resolution,
      from: from,
      to: to,
    };
    const data = await fetchMarketHistory(params);

    if (data && data.s === "ok" && data.o) {
      const bars = data.t.map((timestamp, index) => ({
        time: timestamp * 1000, // Convert back to milliseconds
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index],
      }));
      if (bars.length) {
        onResult(bars, { noData: false });
        if (firstDataRequest) {
          lastBarsCache.set(asset.symbol, bars[bars.length - 1]);
        }
      } else {
        onResult([], { noData: true });
      }
    } else {
      onResult([], { noData: true });
    }

    if (periodParams.firstDataRequest) {
      lastBarsCache.set(asset.symbol, data[data.data.length - 1]);
    }
  },
  searchSymbols: () => {},
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    const timeframe = resolutionToTimeframe(resolution);
    const unsubscribe = ws.subscribe(
      {
        id: `${asset?.symbol}@kline_${timeframe}`,
        topic: `${asset?.symbol}@kline_${timeframe}`,
        event: "subscribe",
      },
      {
        onMessage: (data: any) => {
          if (data && data) {
            const bar = {
              time: data.endTime,
              open: data.open,
              high: data.high,
              low: data.low,
              close: data.close,
              volume: data.volume,
            };
            onRealtimeCallback(bar);
          }
        },
      }
    );
    () => {
      // Unsubscribes when the component unloads
      unsubscribe();
    };
  },
  unsubscribeBars: (subscriberUID) => {
    console.log("Unsubscribe", asset.symbol + "-" + subscriberUID);
    // sockets.get(baseAsset.name + "-" + subscriberUID).close();
  },
  getMarks: () => ({}),
  getTimeScaleMarks: () => ({}),
  getServerTime: () => ({}),
});
