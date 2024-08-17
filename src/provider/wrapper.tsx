import { GeneralProvider } from "@/context";
import { OrderlyProvider } from "@/lib/orderly";
import WagmiProvider from "@/lib/wallet-connect/provider";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { State } from "wagmi";

type ProviderType = {
  initialState: State;
  children: ReactNode;
};

export const Providers = ({ children, initialState }: ProviderType) => {
  return (
    <WagmiProvider initialState={initialState}>
      <OrderlyProvider>
        <ToastContainer
          icon={false}
          toastClassName="bg-primary text-white p-2 rounded shadow-md border border-borderColor-DARK relative"
          bodyClassName="bg-primary text-white"
        />
        <GeneralProvider>{children}</GeneralProvider>
      </OrderlyProvider>
    </WagmiProvider>
  );
};
