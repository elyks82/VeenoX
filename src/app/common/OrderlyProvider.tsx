"use client";
import { OrderlyConfigProvider } from "@orderly.network/hooks";
import type { FC, PropsWithChildren } from "react";

const brokerId = "orderly";

export const OrderlyProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <OrderlyConfigProvider brokerId={brokerId} networkId="mainnet">
      {children}
    </OrderlyConfigProvider>
  );
};
