"use client";

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/footer"
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../components/header'), { ssr: false });
const Web3Provider = dynamic(() => import('./Web3Provider'), { ssr: false });
const GlobalModals = dynamic(() => import('../components/global-modals'), { ssr: false });
const AuthManager = dynamic(() => import('../components/auth/auth-manager'), { ssr: false });

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "ChipDock",
//   description: "A modern web application for interacting with the Lens Protocol",
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Web3Provider>
            <AuthManager />
            <GlobalModals />
            <Header />
            <main>
              {children}
            </main>
            <Footer />
            <Toaster />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
