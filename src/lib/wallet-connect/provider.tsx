"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { State, WagmiProvider as WagmiCloneProvider } from "wagmi";
import { OrderlyProvider } from "../orderly";
import { config } from "./config";

const queryClient = new QueryClient();

export default function WagmiProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiCloneProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <OrderlyProvider>{children}</OrderlyProvider>
      </QueryClientProvider>
    </WagmiCloneProvider>
  );
}
