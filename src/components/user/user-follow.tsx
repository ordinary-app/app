"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import { follow, unfollow } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useLensAuthStore } from "@/stores/auth-store";
import { useReconnectWallet } from "@/hooks/auth/use-reconnect-wallet";
import { useRouter } from "next/navigation";

interface UserFollowButtonProps {
  account: {
    address: string;
    username?: { localName: string };
    operations?: {
      isFollowedByMe: boolean;
      isFollowingMe: boolean;
      canFollow: {
        __typename: string;
        reason?: string;
      };
    };
  };
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export const UserFollowButton = ({ 
  account, 
  className, 
  onFollowChange 
}: UserFollowButtonProps) => {
  const [following, setFollowing] = useState(() => !!account.operations?.isFollowedByMe);
  const [isPending, setIsPending] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { sessionClient } = useLensAuthStore();
  const reconnectWallet = useReconnectWallet();
  const router = useRouter();

  const toggleFollow = async () => {
    try {
      if (!sessionClient) {
        toast.error("Please connect your wallet first");
        return;
      }

      if (!walletClient) {
        reconnectWallet();
        toast.error("Please connect your wallet first");
        return;
      }

      if (!following) {
        if (account.operations?.canFollow.__typename === "AccountFollowOperationValidationFailed") {
          toast.error(`Cannot follow: ${account.operations.canFollow.reason}`);
          return;
        }

        if (account.operations?.canFollow.__typename === "AccountFollowOperationValidationUnknown") {
          toast.error("Cannot follow: Unknown validation rules");
          return;
        }
      }

      setIsPending(true);

      let actionResult: any;
      if (following) {
        actionResult = await unfollow(sessionClient, {
          account: account.address,
        })
          .andThen(handleOperationWith(walletClient as any))
          .andThen(sessionClient.waitForTransaction);
      } else {
        actionResult = await follow(sessionClient, {
          account: account.address,
        })
          .andThen(handleOperationWith(walletClient as any))
          .andThen(sessionClient.waitForTransaction);
      }

      if (actionResult.isErr()) {
        console.error("Failed to follow:", actionResult.error);
        toast.error(following ? "Failed to unfollow account" : "Failed to follow account");
        return;
      }

      const newFollowingState = !following;
      setFollowing(newFollowingState);
      onFollowChange?.(newFollowingState);
      toast.success(
        `${newFollowingState ? "Followed" : "Unfollowed"} ${account.username?.localName || "account"} successfully`,
      );

      router.refresh();
    } catch (error) {
      console.error("Error following account:", error);
      toast.error("Failed to update follow status");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      size="default"
      variant={following ? "outline" : "default"}
      onClick={toggleFollow}
      disabled={isPending}
      className={`text-sm ${className}`}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {following ? "Unfollowing" : "Following"}
        </>
      ) : following ? (
        "Following"
      ) : account.operations?.isFollowingMe ? (
        "Follow back"
      ) : (
        "Follow"
      )}
    </Button>
  );
};