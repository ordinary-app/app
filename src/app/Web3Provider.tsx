"use client";

import { WagmiProvider, createConfig, useAccount } from "wagmi";
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { LensProvider } from "@lens-protocol/react";
import { client } from "@/lib/client";
import { config } from "@/lib/config";

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <LensProvider client={client}>{children}</LensProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
