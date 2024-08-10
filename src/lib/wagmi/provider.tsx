// import {createConfig} from "wagmi/actions";
"use client";
import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";

// const client = createConfig();

const WagmiProvider = ({ children }: { children: ReactNode }) => (
  // To Lazy Load Wagmi random push again
  // useEffect(() => {
  //   loadComponents();
  //   async function loadComponents() {
  //     const {WalletConnectConnector} = await import(
  //       "wagmi/connectors/walletConnect"
  //     );
  //     setClient(
  //       createClient({
  //         autoConnect: true,
  //         connectors: [
  //           ...connectors,
  //           new WalletConnectConnector({
  //             chains,
  //             options: {
  //               qrcode: true,
  //             },
  //           }),
  //         ],
  //         provider,
  //         webSocketProvider,
  //       }),
  //     );
  //   }
  // }, []);

  <WagmiConfig config={{} as any}>{children}</WagmiConfig>
);
export default WagmiProvider;
