import { createClient } from "viem";
import { createConfig, http } from "wagmi";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  bsc,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

const chains = [
  mainnet,
  sepolia,
  arbitrum,
  optimism,
  base,
  polygon,
  bsc,
  arbitrumSepolia,
] as const;
export const config = createConfig({
  chains,

  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});
