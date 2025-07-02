import { create } from "zustand";
import { Account } from "@lens-protocol/client";

interface CurrentProfileStorage {
  currentProfile: Account | null;
  setCurrentProfile: (profile: Account | null) => void;
}

export const useCurrentProfileStorage = create<CurrentProfileStorage>((set) => ({
  currentProfile: null,
  setCurrentProfile: (profile: Account | null) => set({ currentProfile: profile }),
}));
