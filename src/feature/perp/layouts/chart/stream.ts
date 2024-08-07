import { useWS } from "@orderly.network/hooks";
import { useEffect } from "react";

export const Chart = ({ asset }) => {
  const ws = useWS();

  const timeframe = "1m";

  useEffect(() => {
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
  }, []);
  return <div />;
};
