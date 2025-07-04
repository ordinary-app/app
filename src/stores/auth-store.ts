// store/lensAuth.ts
import { create } from "zustand";
import { PublicClient, testnet, SessionClient } from "@lens-protocol/client";

type LensAuthState = {
  client: ReturnType<typeof PublicClient.create>;
  sessionClient: SessionClient | null;
  currentProfile: any | null;
  loading: boolean;
  error: string | null;
  setSessionClient: (session: SessionClient | null) => void;
  setCurrentProfile: (currentProfile: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useLensAuthStore = create<LensAuthState>((set) => ({
  client: PublicClient.create({
    environment: testnet,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  sessionClient: null,
  currentProfile: null,
  loading: false,
  error: null,
  setSessionClient: (session) => set({ sessionClient: session }),
  setCurrentProfile: (currentProfile) => set({ currentProfile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
