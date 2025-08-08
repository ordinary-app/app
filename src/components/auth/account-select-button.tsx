"use client";

import { Account, err } from "@lens-protocol/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "../ui/button";
import { UserAvatar } from "../user-avatar";
import { useLensAuthStore } from "@/stores/auth-store";
import { useProfileSelectStore } from "@/stores/profile-select-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { env } from "@/lib/env";

export function SelectAccountButton({ account, onSuccess }: { account: Account; onSuccess?: () => void }) {
  const { address: walletAddress } = useAccount();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const { client, setCurrentProfile, setSessionClient } = useLensAuthStore();
  const setProfileSelectModalOpen = useProfileSelectStore((state) => state.setProfileSelectModalOpen);
  const router = useRouter();

  const login = async () => {
    setIsLoggingIn(true);
    try {
      if (!client) throw new Error("No Lens client found");
      if (!walletAddress) throw new Error("No wallet address found");
      const authenticated = await client.login({
        accountOwner: {
          account: account.address,
          owner: walletAddress,
          app:
            env.NEXT_PUBLIC_ENVIRONMENT === "development"
              ? env.NEXT_PUBLIC_APP_ADDRESS_TESTNET
              : env.NEXT_PUBLIC_APP_ADDRESS,
        },
        signMessage: async (message: string) => {
          return await signMessageAsync({ message });
        },
      });
      if (authenticated.isErr()) {
        throw new Error(`Failed to get authenticated client: ${authenticated.error.message}`);
      }

      setSessionClient(authenticated.value)
     
      const credentials = await authenticated.value.getCredentials();
      if (credentials.isErr()) {
        console.error("Failed to get credentials", credentials.error);
        throw new Error("Unable to retrieve authentication credentials");
      }

      const refreshToken = credentials.value?.refreshToken;
      
      if (!refreshToken) {
        console.error("Failed to get refresh token - missing from credentials");
        throw new Error("Authentication token unavailable");
      }

      toast.success("Login successful!");
      setCurrentProfile(account);
      setProfileSelectModalOpen(false);
      onSuccess?.();
      // 登录成功后跳转到 feed 页面
      router.push("/feed");
    } catch (err) {
      console.error("Error logging in:", err);
      toast.error(err instanceof Error ? err.message : "Failed to log in. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-between gap-2 text-md w-full"
      onClick={login}
      disabled={isLoggingIn}
    >
      <div className="flex items-center truncate overflow-hidden text-ellipsis max-w-[260px] gap-2">
        <UserAvatar account={account} className="w-8 h-8 flex-shrink-0" />
        <div className="truncate overflow-hidden text-ellipsis max-w-[260px]">
          {account.username?.localName ?? account.address}
        </div>
      </div>
      {isLoggingIn && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
}
