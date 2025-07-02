import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Web3Provider } from "@/app/Web3Provider"
import { GlobalModals } from "@/components/global-modals"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Treehouse",
  description: "A modern web application for interacting with the Lens Protocol",
}

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
              <GlobalModals />
              {children}
            <Toaster />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
