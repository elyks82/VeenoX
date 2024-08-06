import { FuturesAssetProps } from "@/models";
import { useWS } from "@orderly.network/hooks";
import { useEffect, useState } from "react";

enum OrderbookSection {
  ORDERBOOK,
  TRADE_HISTORY,
}

type OrderbookProps = {
  asset: FuturesAssetProps;
};

export const Orderbook = ({ asset }: OrderbookProps) => {
  const [trades, setTrades] = useState([]);
  const [activeSection, setActiveSection] = useState(
    OrderbookSection.ORDERBOOK
  );
  //   const {
  //     data: trades,
  //     isLoading,
  //     refetch,
  //   } = useQuery("marketTrades", () => fetchMarketTrades(asset.symbol));

  //   useEffect(() => {
  //     if (!asset) return;
  //     const interval = setInterval(refetch, 30000);
  //     return () => clearInterval(interval);
  //   }, [asset]);

  //   console.log("trades", trades);

  const ws = useWS();

  useEffect(() => {
    if (!asset) return;
    const unsubscribe = ws.subscribe(
      {
        id: `${asset.symbol}@trade`,
        event: "subscribe",
        topic: `${asset.symbol}@trade`,
        ts: Date.now(),
      },
      {
        onMessage: (data: any) => {
          //
          console.log(data);
        },
      }
    );
    () => {
      // Unsubscribes when the component unloads
      unsubscribe();
    };
  }, [asset]);

  return (
    <section>
      <div className="flex items-center w-full h-[44px] relative">
        <button
          className="w-1/2 h-full text-white text-sm"
          onClick={() => setActiveSection(0)}
        >
          Orderbook
        </button>
        <button
          className="w-1/2 h-full text-white text-sm"
          onClick={() => setActiveSection(1)}
        >
          Trade History
        </button>
        <div
          className={`h-[1px] w-1/2 bottom-0 transition-all duration-200 ease-in-out bg-white absolute ${
            !activeSection ? "left-0" : "left-1/2"
          }`}
        />
      </div>
      {/* {isLoading
        ? "Loading..."
        : trades?.map((trade, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-white text-sm"
            >
              <p>{trade.executed_price}</p>
              <p>{trade.executed_quantity}</p>
              <p>{trade.side}</p>
            </div>
          ))} */}
    </section>
  );
};
