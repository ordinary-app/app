import { create } from "zustand";

type AppConfigState = {
  contractAddress: `0x${string}`;
  explorerUrl: string;
};

export const useAppConfigStore = create<AppConfigState>((set) => ({
  contractAddress: "0xdaEC15eFfE7c76F3221cB367bC49519a6E5C28B2",
  explorerUrl: "https://sepolia.etherscan.io/tx/",
}));
