"use client";

import { getDefaultConfig } from 'connectkit';
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { chains } from "@lens-chain/sdk/viem";
import { env } from "@/lib/env";

const getChains = () => {
  const lensChain = env.NEXT_PUBLIC_ENVIRONMENT === "development" ? chains.testnet : chains.mainnet;
  return [lensChain, sepolia] as const;
};

export const config = createConfig(
  getDefaultConfig({
    appName: 'o-kitchen',
    appDescription: "Decentralized fandoms",
    appUrl: "https://o-harbor.vercel.app",
    appIcon: "https://o-harbor.vercel.app/logo.jpg",
    chains: getChains(),
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    transports: {
      [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_ID}`),
      [chains.mainnet.id]: http(),
      [chains.testnet.id]: http(),
    },
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
