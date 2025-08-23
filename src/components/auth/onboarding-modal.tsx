"use client";

import { AnyClient, never } from "@lens-protocol/client";
import { canCreateUsername, createAccountWithUsername, fetchAccount } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { account as accountMetadataBuilder } from "@lens-protocol/metadata"; // Updated imports
import { CheckCircle2, ChevronLeft, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { useReconnectWallet } from "@/hooks/auth/use-reconnect-wallet";
import { storageClient } from "@/lib/storage-client";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useLensAuthStore } from "@/stores/auth-store";

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

type ValidationStatus = "idle" | "checking" | "valid" | "invalid";

export function OnboardingModal({ open, onOpenChange, onSuccess }: OnboardingModalProps) {
  const { address: walletAddress } = useAccount();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle");
  const [validationMessage, setValidationMessage] = useState<string>("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { data: walletClient } = useWalletClient();
  const reconnectWallet = useReconnectWallet();
  const { setCurrentProfile, sessionClient } = useLensAuthStore();

  const validateUsername = useCallback(async (name: string) => {
    if (!name || name.length <= 2) {
      setValidationStatus("idle");
      setValidationMessage("");
      return false;
    }
    const lowerCaseName = name.toLowerCase();

    setValidationStatus("checking");

    try {
      if (!sessionClient || !sessionClient.isSessionClient()) {
        throw new Error("Failed to get session client");
      }

      const result = await canCreateUsername(sessionClient, {
        localName: lowerCaseName,
      });

      if (result.isErr()) {
        setValidationStatus("invalid");
        console.error("Error checking username availability:", result.error);
        setValidationMessage("Error checking username availability");
        return false;
      }

      const data = result.value;
      console.log("Username validation data:", data);
      switch (data.__typename) {
        case "NamespaceOperationValidationPassed":
          setValidationStatus("valid");
          setValidationMessage("Username is available");
          return true;
        case "NamespaceOperationValidationFailed":
          setValidationStatus("invalid");
          setValidationMessage(data.reason || "Username validation failed");
          return false;
        case "NamespaceOperationValidationUnknown":
          setValidationStatus("invalid");
          setValidationMessage("Username validation status unknown");
          return false;
        case "UsernameTaken":
          setValidationStatus("invalid");
          setValidationMessage("Username is already taken");
          return false;
        default:
          setValidationStatus("invalid");
          setValidationMessage("Unknown validation error");
          return false;
      }
    } catch (error) {
      console.error("Username validation error:", error);
      setValidationStatus("invalid");
      setValidationMessage("Error validating username");
      return false;
    }
  }, [sessionClient]);

  const handleUsernameChange = useCallback(
    (value: string) => {
      setUsername(value);

      if (validationStatus !== "idle" && validationStatus !== "checking") {
        setValidationStatus("idle");
        setValidationMessage("");
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      if (value && value.length > 2) {
        debounceTimerRef.current = setTimeout(() => {
          validateUsername(value);
        }, 500);
      }
    },
    [validateUsername, validationStatus],
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleUsernameSubmit = async () => {
    if (!username || !walletAddress) return;

    // If validation hasn't been done yet or is in progress, validate now
    if (validationStatus === "idle" || validationStatus === "checking") {
      setValidationStatus("checking");
      const isValid = await validateUsername(username);
      console.log("Username validation result:", isValid);
      if (!isValid) {
        toast.error(validationMessage || "Username is not available");
        return;
      }
    } else if (validationStatus === "invalid") {
      toast.error(validationMessage || "Username is not available");
      return;
    }

    await submitProfile()
  };

  async function submitProfile () {
    if (!walletClient) {
      reconnectWallet();
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    let metadataUri: string | undefined;
    let client: AnyClient | null = null;

    try {
      client = sessionClient;
      if (!client || !client.isSessionClient()) {
        throw new Error("Failed to get public client");
      }

      // Construct Metadata
      const metadata = accountMetadataBuilder({
        name: username,
        bio: undefined,
        picture: undefined,
      });

      // Upload Metadata JSON
      const uploadMetaToast = toast.loading("Uploading profile metadata...");
      try {
        const { uri } = await storageClient.uploadAsJson(metadata);
        metadataUri = uri;
        toast.dismiss(uploadMetaToast);
        console.log("Metadata uploaded:", metadataUri);
      } catch (metaUploadError) {
        toast.dismiss(uploadMetaToast);
        console.error("Error uploading metadata:", metaUploadError);
        toast.error("Failed to upload profile metadata. Please try again.");
        setLoading(false);
        return;
      }

      // Create Account, Fetch and Switch account
      const createToast = toast.loading("Creating your account...");
      const result = await createAccountWithUsername(client, {
        username: {
          localName: username.toLowerCase(),
        },
        metadataUri: metadataUri,
      })
        .andThen(handleOperationWith(walletClient as any))
        .andThen(client.waitForTransaction)
        .andThen((txHash) => fetchAccount(client!, { txHash }))
        .andThen((account) => {
          if (!account) return never("Account not found");
          console.log("Account created:", account);
          setCurrentProfile(account);
          if (client?.isSessionClient()) {
            return client.switchAccount({
              account: account.address,
            });
          }
          return never("Client is not a session client");
        });

      toast.dismiss(createToast);

      if (result.isErr()) {
        console.error("Error in account creation flow:", result.error);
        toast.error(`Error: ${result.error || "Failed to complete account setup"}`);
        setLoading(false);
        return;
      }

      // 7. Setup Authentication
      //const authToast = toast.loading("Setting up authentication...");
      //const credentials = await client.getCredentials();

      /*
      if (credentials.isErr()) {
        toast.dismiss(authToast);
        toast.error("Failed to get credentials. Please reload and log in.");
        setLoading(false);
        onOpenChange(false);
        return;
      }

      const refreshToken = credentials.value?.refreshToken;
      if (!refreshToken) {
        toast.dismiss(authToast);
        toast.error("Failed to get refresh token. Please reload and log in.");
        setLoading(false);
        onOpenChange(false);
        return;
      }

      toast.dismiss(authToast);
      */
      toast.success("Account created successfully!");

      await onSuccess();
      onOpenChange(false);

      // router.push(`/u/${username}`);
      // window.location.reload();
    

    } catch (err: any) {
      console.error("Error during final account creation:", err);
      toast.error(`Failed to create account: ${err.message || "An unknown error occurred."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpenState: boolean) => {
    if (!newOpenState) {
      setUsername("");
      setLoading(false);
      setValidationStatus("idle");
      setValidationMessage("");
      // Clear any pending timers
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }
    onOpenChange(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[400px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base h-8 flex gap-2 items-center">
            <Button
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              aria-label="Close"
              size="sm"
              disabled={loading}
            >
              <ChevronLeft className="size-4" />
            </Button>
            Choose a username
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex gap-4 flex-col">
          <p className="text-xs text-muted-foreground">
            Welcome to o-kitchen! Let's start by choosing your username. Make it a good one - this can't be changed
            later.
          </p>
          <div className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  disabled={loading}
                  className={
                    validationStatus === "invalid" ? "pr-10 border-red-500 focus-visible:ring-red-500" : "pr-10"
                  }
                />
                {validationStatus === "checking" && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
                {validationStatus === "valid" && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                )}
                {validationStatus === "invalid" && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>
              <div className="h-5 mt-1">
                {validationStatus === "invalid" && validationMessage && (
                  <p className="text-xs text-red-500">{validationMessage}</p>
                )}
                {validationStatus === "valid" && validationMessage && (
                  <p className="text-xs text-green-500">{validationMessage}</p>
                )}
              </div>
            </div>
          </div>
          <div className="">
            <Button
              onClick={handleUsernameSubmit}
              disabled={loading || !username || validationStatus !== "valid"}
              className="w-full"
            >
              {loading ? "Processing..." : "Signup"}
            </Button>
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
