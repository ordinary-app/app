"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import { follow, unfollow } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useLensAuthStore } from "@/stores/auth-store";
import { useAuthCheck } from "@/hooks/auth/use-auth-check";

interface FollowingStateOptions {
  onFollowChange?: (address: string, isFollowing: boolean) => void;
  onError?: (error: Error) => void;
}

export const useFollow = (options: FollowingStateOptions = {}) => {
  const [pendingFollows, setPendingFollows] = useState<Set<string>>(new Set());
  const { data: walletClient } = useWalletClient();
  const { sessionClient } = useLensAuthStore();
  const { checkAuthentication } = useAuthCheck();
  const { onFollowChange, onError } = options;

  const handleFollow = useCallback(async (
    targetAddress: string,
    currentlyFollowing: boolean,
    targetHandle?: string
  ) => {
    try {
      if (!checkAuthentication("关注用户")) {
        return false;
      }

      if (!sessionClient?.isSessionClient()) {
        throw Error("Failed to get public client");
      }

      // Prevent multiple simultaneous follow operations on the same address
      if (pendingFollows.has(targetAddress)) {
        return false;
      }

      setPendingFollows(prev => new Set(prev).add(targetAddress));

      let actionResult: any;
      if (currentlyFollowing) {
        actionResult = await unfollow(sessionClient, {
          account: targetAddress,
        })
          .andThen(handleOperationWith(walletClient as any))
          .andThen(sessionClient.waitForTransaction);
      } else {
        actionResult = await follow(sessionClient, {
          account: targetAddress,
        })
          .andThen(handleOperationWith(walletClient as any))
          .andThen(sessionClient.waitForTransaction);
      }

      if (actionResult.isErr()) {
        console.error("Failed to follow:", actionResult.error);
        const errorMessage = currentlyFollowing ? "Failed to unfollow account" : "Failed to follow account";
        toast.error(errorMessage);
        onError?.(new Error(errorMessage));
        return false;
      }

      const newFollowingState = !currentlyFollowing;
      onFollowChange?.(targetAddress, newFollowingState);
      
      const successMessage = `${newFollowingState ? "Followed" : "Unfollowed"} ${targetHandle || "account"} successfully`;
      toast.success(successMessage);
      
      return true;
    } catch (error) {
      console.error("Error following account:", error);
      const errorMessage = "Failed to update follow status";
      toast.error(errorMessage);
      onError?.(error as Error);
      return false;
    } finally {
      setPendingFollows(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetAddress);
        return newSet;
      });
    }
  }, [sessionClient, walletClient, checkAuthentication, onFollowChange, onError, pendingFollows]);

  const isFollowPending = useCallback((address: string) => {
    return pendingFollows.has(address);
  }, [pendingFollows]);

  return {
    handleFollow,
    isFollowPending,
    isConnected: !!sessionClient && !!walletClient,
  };
};