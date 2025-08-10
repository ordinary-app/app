// store/lensAuth.ts
import { create } from "zustand";
import { PublicClient, testnet, SessionClient, mainnet } from "@lens-protocol/client";
import { env } from "@/lib/env";

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
    environment: env.NEXT_PUBLIC_ENVIRONMENT === "development" ? testnet : mainnet,
    origin: "https://o-harbor.vercel.app",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    apiKey: env.NEXT_PUBLIC_ENVIRONMENT === "development"
    ? env.LENS_API_KEY_TESTNET
    : env.LENS_API_KEY,
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
