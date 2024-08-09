"use client";
import { ConnectorProvider } from "@orderly.network/web3-onboard";
import injectedModule from "@web3-onboard/injected-wallets";
import { FC, PropsWithChildren } from "react";

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectorProvider
      apiKey="e810e59d-db22-489f-bd3c-56d20a54722f"
      options={{
        wallets: [injectedModule()],
        appMetadata: {
          name: "Veeno",
          icon: "/v.png",
          description: "Orderly",
        },
      }}
    >
      {children}
    </ConnectorProvider>
  );
};
