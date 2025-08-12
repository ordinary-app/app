"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { LensProvider } from "@lens-protocol/react";
import { config } from "@/lib/config";
import { useLensAuthStore } from "@/stores/auth-store";

const queryClient = new QueryClient();

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { client } = useLensAuthStore();

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

export default Web3Provider;
