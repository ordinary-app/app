"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Search, Edit } from "lucide-react"
import Link from "next/link"
import { useCurrentProfileStorage } from "@/stores/profile-store"
import { useAccount, useDisconnect } from "wagmi";
import { getLensClient } from "@/lib/client"
import { useRouter } from "next/navigation"

export function Header() {
  const { disconnect: disconnectWallet } = useDisconnect();
  const { currentProfile, setCurrentProfile } = useCurrentProfileStorage();
  const router = useRouter()

  const handleDisconnect = async () => {
    disconnectWallet();
    const client = await getLensClient();

    if (client.isSessionClient()) {
      await client.logout();
      setCurrentProfile(null);
    }

    router.push("/");
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="font-semibold text-lg">Treehouse</span>
            </Link>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search fanworks..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/explore" className="text-gray-600 hover:text-gray-900 transition-colors">
              Explore
            </Link>
            <Link href="/create" className="text-gray-600 hover:text-gray-900 transition-colors">
              Write
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/create">
              <Button variant="outline" size="sm" className="rounded-full">
                <Edit className="h-4 w-4 mr-2" />
                Write
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentProfile?.metadata?.picture || "/lufei.jpg"} />
                    <AvatarFallback className="bg-gray-200">
                      {currentProfile?.username?.localName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">@{currentProfile?.username?.localName || "Anonymous"}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {currentProfile?.metadata?.bio || "Fanwork Creator"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDisconnect}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
