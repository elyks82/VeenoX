"use client";
import { useQuery, useWalletConnector } from "@orderly.network/hooks";
import { API } from "@orderly.network/types";
import { useAccount, useConnect } from "wagmi";
import { Favorites } from "./layouts/favorites";
import { TokenInfo } from "./layouts/token-info";

export const Trade = () => {
  const { data, error, isLoading } = useQuery<API.Symbol[]>("/v1/public/info");
  const { address, isDisconnected } = useAccount();
  console.log("account", address);
  const wallet = useWalletConnector();
  const { connect, connectors, pendingConnector } = useConnect({
    onError: () => {
      //   setStatus("error");
    },
    onSuccess() {
      //   Cookies.set(`user-address`, address, {
      //     secure: process.env.NODE_ENV !== "development",
      //     sameSite: "strict",
      //   });
      console.log("connected");
    },
  });
  return (
    <>
      <div className="flex w-full">
        <div className="flex flex-col w-2/3 border-r border-borderColor">
          <Favorites />
          <TokenInfo />
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
