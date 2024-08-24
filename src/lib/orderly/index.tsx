"use client";
import { OrderlyConfigProvider } from "@orderly.network/hooks";

const brokerId = "orderly";

export default function OrderlyProvider({ children }) {
  return (
    <OrderlyConfigProvider brokerId={brokerId} networkId="mainnet">
      {children}
    </OrderlyConfigProvider>
  );
}
