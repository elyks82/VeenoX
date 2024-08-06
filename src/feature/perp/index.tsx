"use client";
import { FuturesAssetProps } from "@/models";
import { useQuery, useWalletConnector } from "@orderly.network/hooks";
import { API } from "@orderly.network/types";
import { useAccount } from "wagmi";
import { Favorites } from "./layouts/favorites";
import { TokenInfo } from "./layouts/token-info";

type PerpProps = {
  asset: FuturesAssetProps;
};

export const Perp = ({ asset }: PerpProps) => {
  const { data, error, isLoading } = useQuery<API.Symbol[]>("/v1/public/info");
  const { address, isDisconnected } = useAccount();
  console.log("account", address);
  const wallet = useWalletConnector();

  return (
    <>
      <div className="grid grid-cols-10 w-full border-b border-borderColor">
        <div className="col-span-6 border-r border-borderColor">
          <Favorites />
          <TokenInfo asset={asset} />
          <img src="/chart.png" className="h-[600px]" />
        </div>
        <div className="col-span-2 border-r border-borderColor"></div>
        <div className="col-span-2 border-r border-borderColor"></div>
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
