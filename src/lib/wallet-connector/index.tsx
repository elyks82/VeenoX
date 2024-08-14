"use client";
import { ConnectorProvider } from "@orderly.network/web3-onboard";
import injectedModule from "@web3-onboard/injected-wallets";
import { FC, PropsWithChildren } from "react";

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectorProvider
      apiKey={process.env.NEXT_PUBLIC_API_KEY_WC}
      options={{
        wallets: [injectedModule()],
        appMetadata: {
          name: "Veeno",
          icon: "/logo/veeno.png",
          description: "Veeno",
        },
      }}
    >
      {children}
    </ConnectorProvider>
  );
};
