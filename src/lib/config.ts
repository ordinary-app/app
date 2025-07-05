"use client";

import { getDefaultConfig } from 'connectkit';
import { createConfig, http } from 'wagmi';
import { lensTestnet, sepolia } from 'wagmi/chains';

const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '[::1]'; // IPv6 localhost

export const config = createConfig(
  getDefaultConfig({
    appName: 'ChipDock',
    chains: [sepolia],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    ...(!isLocalhost && {
      transports: {
        [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`), // or your preferred Sepolia RPC URL
      },
    })
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
