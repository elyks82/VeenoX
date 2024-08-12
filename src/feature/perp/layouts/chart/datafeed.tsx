import { fetchMarketHistory } from "@/api/fetchMarketHistory";
import {
  BarsSymbolInfoProps,
  CustomBarProps,
  FuturesAssetProps,
} from "@/models";
import { resolutionToMilliseconds, resolutionToTimeframe } from "@/utils/misc";
import { WS } from "@orderly.network/net";
import Cookies from "js-cookie";
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

export const Datafeed = (
  asset: FuturesAssetProps,
  ws: WS,
  setIsChartLoading: Dispatch<SetStateAction<boolean>>
) => ({
  onReady: (callback: Function) => {
    callback({ supported_resolutions: supportedResolutions });
  },
  resolveSymbol: (symbolName: string, onResolve: Function) => {
    const price = asset?.mark_price || 1; // Valeur par défaut pour éviter les erreurs
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
        const firstData = {
          time: data.t[data.t.length - 1] * 1000,
          open: data.o[data.o.length - 1],
          high: data.h[data.h.length - 1],
          low: data.l[data.l.length - 1],
          close: data.c[data.c.length - 1],
          volume: data.v[data.v.length - 1],
        };
        onResult(bars, { noData: false });
        if (firstDataRequest) {
          Cookies.set(symbolInfo.name, JSON.stringify(firstData));
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
    const timeframe = resolutionToTimeframe(resolution);
    setIsChartLoading(false);

    let lastDailyBar: CustomBarProps | null = Cookies.get(symbolInfo.name)
      ? JSON.parse(Cookies.get(symbolInfo.name)!)
      : null;

    // Fonction pour obtenir le temps de la prochaine bougie
    const getNextBarTime = (
      resolution: string,
      lastBarTime: number
    ): number => {
      const intervalMs = resolutionToMilliseconds(resolution);
      return lastBarTime + intervalMs;
    };

    let nextDailyBarTime: number | null = lastDailyBar
      ? getNextBarTime(resolution, lastDailyBar.time)
      : null;

    let initialDataLoaded = false;

    const unsubscribe = ws.subscribe(
      {
        id: `${asset?.symbol}@kline_${timeframe}`,
        topic: `${asset?.symbol}@kline_${timeframe}`,
        event: "subscribe",
      },
      {
        onMessage: (data: any) => {
          if (data) {
            const currentTimeInMs = data.endTime * 1000;
            const price = data.close;

            if (!initialDataLoaded) {
              if (lastDailyBar && currentTimeInMs < nextDailyBarTime!) {
                return;
              } else {
                initialDataLoaded = true;
              }
            }

            if (lastDailyBar) {
              const nextDailyBarTimeInMs = Number(nextDailyBarTime);

              if (currentTimeInMs >= nextDailyBarTimeInMs) {
                const bar: CustomBarProps = {
                  time: currentTimeInMs,
                  open: price,
                  high: price,
                  low: price,
                  close: price,
                  volume: data.volume,
                };

                lastDailyBar = bar;
                Cookies.set(symbolInfo.name, JSON.stringify(bar));
                onRealtimeCallback(bar);

                nextDailyBarTime = getNextBarTime(resolution, currentTimeInMs);
              } else {
                console.log("Updating the existing bar.");
                const bar: CustomBarProps = {
                  ...lastDailyBar,
                  high: Math.max(lastDailyBar.high, data.high),
                  low: Math.min(lastDailyBar.low, data.low),
                  close: price,
                  volume: lastDailyBar.volume + data.volume,
                };

                lastDailyBar = bar;
                Cookies.set(symbolInfo.name, JSON.stringify(lastDailyBar));
                onRealtimeCallback(bar);
              }
            } else {
              console.log("No previous data, creating initial bar.");
              const bar: CustomBarProps = {
                time: currentTimeInMs,
                open: price,
                high: price,
                low: price,
                close: price,
                volume: data.volume,
              };

              lastDailyBar = bar;
              Cookies.set(symbolInfo.name, JSON.stringify(bar));
              onRealtimeCallback(bar);

              nextDailyBarTime = getNextBarTime(resolution, currentTimeInMs);
            }
          }
        },
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
      sockets.delete(`${asset?.symbol}@kline_${timeframe}`);
    };
  },

  unsubscribeBars: () => {},
  getMarks: () => ({}),
  getTimeScaleMarks: () => ({}),
  getServerTime: () => ({}),
});
const resolutionToInterval = (resolution: string): number => {
  switch (resolution) {
    case "1D": // 1 jour
      return 86400000; // 24 heures en millisecondes
    case "1W": // 1 semaine
      return 604800000; // 7 jours en millisecondes
    case "1M": // 1 mois
      return 2592000000; // 30 jours en millisecondes
    case "1h": // 1 heure
      return 3600000; // 1 heure en millisecondes
    case "15m": // 15 minutes
      return 900000; // 15 minutes en millisecondes
    case "5m": // 5 minutes
      return 300000; // 5 minutes en millisecondes
    case "1m": // 1 minute
      return 60000; // 1 minute en millisecondes
    default:
      throw new Error(`Unknown resolution: ${resolution}`);
  }
};
