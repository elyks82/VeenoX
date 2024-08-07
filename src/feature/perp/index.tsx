"use client";
import { FuturesAssetProps } from "@/models";
import { useWalletConnector } from "@orderly.network/hooks";
import { useAccount } from "wagmi";
import TradingViewChart from "./layouts/chart";
import { Favorites } from "./layouts/favorites";
import { OpenTrade } from "./layouts/open-trade";
import { Orderbook } from "./layouts/orderbook";
import { TokenInfo } from "./layouts/token-info";

type PerpProps = {
  asset: FuturesAssetProps;
};

export const Perp = ({ asset }: PerpProps) => {
  const { address, isDisconnected } = useAccount();
  const wallet = useWalletConnector();

  const options = {
    symbol: "PERP_BTC_USDC",
    timeframe: "1D",
    from: 1709459200,
    to: 1729459200,
  };

  // const { data, refetch } = useQuery("marketHistory", () =>
  //   fetchMarketHistory(options)
  // );
  // useEffect(() => {
  //   const resp = fetchMarketHistory(options);
  //   console.log(resp);
  // }, [asset]);
  // console.log("data", data);

  return (
    <>
      <div className="grid grid-cols-10 w-full border-b border-borderColor">
        <div className="col-span-6 border-r border-borderColor">
          <Favorites />
          <TokenInfo asset={asset} />
          <TradingViewChart asset={asset} className={""} />
        </div>
        <div className="col-span-2 border-r border-borderColor">
          <Orderbook asset={asset} />
        </div>
        <div className="col-span-2">
          <OpenTrade />
        </div>
      </div>
      {/* <pre className="text-sm">
        <button onClick={() => connect({ connector: connectors[3] })}>
          {isDisconnected ? "Connect wallet" : address?.slice(0, 6)}
        </button>
        <button onClick={() => disconnect()}>Disconnect wallet</button>
        {isLoading && <div>Loading...</div>}
        {/* {data && (
        <div className="text-slate-500">{JSON.stringify(data, null, 2)}</div>
      )}
      </pre> */}
    </>
  );
};
