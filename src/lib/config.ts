"use client";

import { getDefaultConfig } from 'connectkit';
import { createConfig } from 'wagmi';
import { lensTestnet, sepolia } from 'wagmi/chains';

export const config = createConfig(
  getDefaultConfig({
    appName: 'ChipDock',
    chains: [sepolia, lensTestnet],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
