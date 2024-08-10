import { fetchMarketHistory } from "@/api/fetchMarketHistory";
import {
  BarsSymbolInfoProps,
  CustomBarProps,
  FuturesAssetProps,
} from "@/models";
import { resolutionToTimeframe } from "@/utils/misc";
import { WS } from "@orderly.network/net";

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

export const Datafeed = (asset: FuturesAssetProps, ws: WS) => ({
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
        onResult(bars, { noData: false });
      } else {
        onResult([], { noData: true });
      }
    } else {
      onResult([], { noData: true });
    }
  },
  searchSymbols: () => {},
  subscribeBars: (
    symbolInfo: string,
    resolution: string,
    onRealtimeCallback: (arg0: CustomBarProps) => void
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
            const bar: CustomBarProps = {
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
      if (unsubscribe) unsubscribe();
    };
  },
  unsubscribeBars: () => {},
  getMarks: () => ({}),
  getTimeScaleMarks: () => ({}),
  getServerTime: () => ({}),
});
