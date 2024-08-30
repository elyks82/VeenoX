"use client";
import { OrderlyConfigProvider } from "@orderly.network/hooks";

type OrderlyProviderProps = {
  children: React.ReactNode;
};

export default function OrderlyProvider({ children }: OrderlyProviderProps) {
  return (
    <OrderlyConfigProvider
      brokerId={process.env.NEXT_PUBLIC_BROKER_ID as string}
      networkId="mainnet"
    >
      {children}
    </OrderlyConfigProvider>
  );
}
