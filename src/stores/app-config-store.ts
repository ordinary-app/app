import { create } from "zustand";

type AppConfigState = {
  contractAddress: `0x${string}`;
  explorerUrl: string;
};

export const useAppConfigStore = create<AppConfigState>((set) => ({
  contractAddress: "0x13036d898B64663A669f9eBb707805c57F8B1b56",
  explorerUrl: "https://sepolia.etherscan.io/",
}));
