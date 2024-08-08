"use client";
import { FuturesAssetProps } from "@/models";
import { useWalletConnector } from "@orderly.network/hooks";
import { useAccount } from "wagmi";
import TradingViewChart from "./layouts/chart";
import { Favorites } from "./layouts/favorites";
import { OpenTrade } from "./layouts/open-trade";
import { Orderbook } from "./layouts/orderbook";
import { Position } from "./layouts/position";
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
      <div className="grid grid-cols-10 w-full border-b border-borderColor h-[500px]">
        <div className="col-span-8 border-r border-b border-borderColor">
          <Position asset={asset} />
        </div>

        <div className="col-span-2 border-b border-borderColor">
          <div className="p-4 border-b border-borderColor">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-font-60 mb-[3px]">
                  Total value (USDC)
                </p>
                <p className="text-base text-white font-medium">0.00</p>
              </div>
              <div>
                <p className="text-xs text-font-60 mb-1">Unreal PnL (USDC)</p>
                <p className="text-sm text-white font-medium text-end">
                  0.00 (0.00%)
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div>
                <p className="text-xs text-font-60 mb-1">
                  Unsettled PnL (USDC)
                </p>
                <p className="text-sm text-white font-medium">0.00</p>
              </div>
              <button className="flex items-center bg-terciary border border-borderColor-DARK rounded px-2 py-1 text-xs text-white">
                <span>Settle PnL</span>
              </button>
            </div>
          </div>
          <div className="p-4">
            <button className="w-full text-sm text-white h-[40px] flex items-center justify-center border border-borderColor-DARK bg-terciary rounded">
              Deposit
            </button>
            <button className="w-full text-sm text-white mt-2.5 h-[40px] flex items-center justify-center border border-borderColor-DARK bg-terciary rounded">
              Withdraw
            </button>
          </div>
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
