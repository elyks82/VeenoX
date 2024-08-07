import { fetchMarketHistory } from "@/api/fetchMarketHistory";
import { useWS } from "@orderly.network/hooks";

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

export const Datafeed = (asset) => ({
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
      intraday_multipliers: ["1", "15", "30", "60"],
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
    const params = {
      symbol: "PERP_SOL_USDC",
      timeframe: resolution,
      from: 1709148690,
      to: 1723028730,
    };
    const { from, to, firstDataRequest } = periodParams;
    console.log(params);
    const data = await fetchMarketHistory(params);
    console.log("data", data);

    if (data && data.s === "ok" && data.o) {
      const bars = data.t.map((timestamp, index) => ({
        time: timestamp * 1000, // Convert back to milliseconds
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index],
      }));
      console.log("bars", bars);
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
    console.log("Subscribing to bars", asset.symbol + "-" + subscriberUID);
    const timeframe = "1m";
    const ws = useWS();
    console.log("resolution", resolution);
    console.log("subscriber", subscriberUID);
    const unsubscribe = ws.subscribe(
      {
        id: `${asset?.symbol}@kline_${timeframe}`,
        topic: `${asset?.symbol}@kline_${timeframe}`,
        event: "subscribe",
      },
      {
        onMessage: (data: any) => {
          console.log("HERE IS : ", data);
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
