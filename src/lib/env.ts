// Environment configuration
// This file provides a centralized way to access environment variables

export const env = {
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID!,
  NEXT_PUBLIC_APP_ADDRESS: process.env.NEXT_PUBLIC_APP_ADDRESS!,
  NEXT_PUBLIC_APP_ADDRESS_TESTNET: process.env.NEXT_PUBLIC_APP_ADDRESS_TESTNET!,
  LENS_API_KEY: process.env.LENS_API_KEY!,
  LENS_API_KEY_TESTNET: process.env.LENS_API_KEY_TESTNET!,
} as const;