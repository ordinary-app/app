"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Menu, X } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { usePathname, useRouter } from "next/navigation";
import { useLensAuthStore } from "@/stores/auth-store";
import { ConnectKitButton } from "connectkit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfileSelectStore } from "@/stores/profile-select-store";
import { UserAvatar } from "@/components/user-avatar";
import { toast } from "sonner";
import copy from "copy-to-clipboard";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("header");
  const navT = useTranslations("navigation");
  const { disconnect: disconnectWallet } = useDisconnect();
  const { currentProfile, setCurrentProfile, sessionClient, setSessionClient } =
    useLensAuthStore();
  const router = useRouter();
  const { address, isConnected, isConnecting, status } = useAccount();
  const { setProfileSelectModalOpen } = useProfileSelectStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // handle wagmi wallet connect error
    if (address && !isConnected && isConnecting) {
      disconnectWallet();
    }
  }, [address, isConnected, isConnecting]);

  // Auto-open profile select modal when wallet is connected but no profile is selected
  useEffect(() => {
    if (isConnected && address && !currentProfile) {
      setProfileSelectModalOpen(true);
    }
  }, [isConnected, address, currentProfile, setProfileSelectModalOpen]);

  const navItems = [
    { href: "/", label: navT("home") },
    { href: "/feed", label: navT("feed") },
    //{ href: '/discover', label: navT('discover') },
    { href: "/what-is-chip", label: navT("onchainProof") },
  ];

  const handleDisconnect = async () => {
    disconnectWallet();
    await sessionClient?.logout();
    setCurrentProfile(null);
    setSessionClient(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-gray-900 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 md:h-14 ">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600 hover:text-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          {/* Logo */}
          <Link href="/" className="hidden md:flex items-center space-x-2">
            <div className="text-2xl"></div>
            <div className="font-bold text-xl bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">
              Ordinary
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`font-medium transition-colors text-gray-600 hover:text-harbor-600 cursor-pointer dark:text-gray-300 ${
                    isActive ? "text-harbor-600" : ""
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Create Button - 只在用户登录时显示 */}
            {currentProfile && (
              <Button
                asChild
                variant="default"
                size="sm"
                className="chip-button text-white"
              >
                <Link href="/create">{t("upload")}</Link>
              </Button>
            )}

            {currentProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8 border-2 border-gray-200">
                      <AvatarImage
                        src={currentProfile?.metadata?.picture || "/gull.jpg"}
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-700">
                        {currentProfile?.username?.localName
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 border-gray-200"
                  align="end"
                  forceMount
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium dark:text-neutral-100 text-gray-800">
                        @{currentProfile?.username?.localName || t("anonymous")}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground dark:text-neutral-400">
                        {currentProfile?.metadata?.bio || t("fanworkLover")}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {navT("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {t("settings")} ({t("developing")})
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={handleDisconnect}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("disconnect")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full shrink-0"
                  >
                    <UserAvatar />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end" forceMount>
                  <DropdownMenuItem
                    onClick={() => {
                      setProfileSelectModalOpen(true);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("selectProfile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => disconnectWallet()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logOut")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ConnectKitButton.Custom>
                {({ show }) => {
                  return (
                    <Button
                      onClick={show}
                      className="chip-button text-white font-semibold"
                    >
                      {t("connect")}
                    </Button>
                  );
                  // }
                }}
              </ConnectKitButton.Custom>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-2 p-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800 transition-colors py-2 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {navT("home")}
              </Link>
              <Link
                href="/feed"
                className="text-gray-600 hover:text-gray-800 transition-colors py-2 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {navT("feed")}
              </Link>
              <Link
                href="/what-is-chip"
                className="text-gray-600 hover:text-gray-800 transition-colors py-2 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {navT("onchainProof")}
              </Link>

              {/* {!currentProfile && (
                <ConnectKitButton.Custom>
                  {({ show }) => (
                    <Button
                      onClick={() => {
                        if (show) show()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Connect Wallet
                    </Button>
                  )}
                </ConnectKitButton.Custom>
              )} */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
