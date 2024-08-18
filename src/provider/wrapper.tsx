"use client";
import { GeneralProvider } from "@/context";
import { OrderlyProvider } from "@/lib/orderly";
import WagmiProvider from "@/lib/wallet-connect/provider";
import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import { State } from "wagmi";

type ProviderType = {
  initialState: State;
  children: ReactNode;
};

const CloseButton = ({ closeToast }: any) => (
  <IoClose className="text-base text-white" onClick={closeToast} />
);

export const Providers = ({ children, initialState }: ProviderType) => {
  return (
    <WagmiProvider initialState={initialState}>
      <OrderlyProvider>
        <ToastContainer
          toastClassName="bg-secondary text-white p-2 rounded shadow-md border border-borderColor relative"
          bodyClassName="bg-secondary text-white"
          closeButton={CloseButton}
        />
        <GeneralProvider>{children}</GeneralProvider>
      </OrderlyProvider>
    </WagmiProvider>
  );
};
