"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer";
import { PostActionsProvider } from "@/contexts/post-actions-context";
import { FeedProvider } from "@/contexts/feed-context";
import { ActionBarProvider } from "@/contexts/action-bar-context";

const Header = dynamic(() => import("../../components/header"), { ssr: false });
const Web3Provider = dynamic(() => import("../Web3Provider"), { ssr: false });
const GlobalModals = dynamic(() => import("../../components/global-modals"), {
  ssr: false,
});
const AuthManager = dynamic(
  () => import("../../components/auth/auth-manager"),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Web3Provider>
        <PostActionsProvider>
          <ActionBarProvider>
            <FeedProvider>
              <AuthManager />
              <GlobalModals />
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster />
            </FeedProvider>
          </ActionBarProvider>
        </PostActionsProvider>
      </Web3Provider>
    </ThemeProvider>
  );
}
