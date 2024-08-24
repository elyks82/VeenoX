"use client";
import { OrderlyConfigProvider } from "@orderly.network/hooks";

const brokerId = "orderly";

type OrderlyProviderProps = {
  children: React.ReactNode;
};

export default function OrderlyProvider({ children }: OrderlyProviderProps) {
  return (
    <OrderlyConfigProvider brokerId={brokerId} networkId="mainnet">
      {children}
    </OrderlyConfigProvider>
  );
}
