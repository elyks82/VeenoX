import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import {
  arbitrum,
  base,
  bsc,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error("Project ID is not defined");

export const metadata = {
  name: "Veeno",
  description: "AppKit Example",
  url: "https://web3modal.com",
  icons: ["/logo/veeno.png"],
};

const chains = [
  mainnet,
  sepolia,
  arbitrum,
  optimism,
  base,
  polygon,
  bsc,
] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
