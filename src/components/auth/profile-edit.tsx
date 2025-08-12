"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Upload, X } from "lucide-react";
import { uploadFile } from "@/utils/upload-file";
import { resolveUrl } from "@/utils/resolve-url";
import { uri } from "@lens-protocol/client";
import { setAccountMetadata } from "@lens-protocol/client/actions";
import { account as accountMetadataBuilder } from "@lens-protocol/metadata";
import { storageClient } from "@/lib/storage-client";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useLensAuthStore } from "@/stores/auth-store";
import { useReconnectWallet } from "@/hooks/auth/use-reconnect-wallet";

interface ProfileEditProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileEdit({ open, onClose }: ProfileEditProps) {
  const { data: walletClient } = useWalletClient();
  const { currentProfile, sessionClient: client, setCurrentProfile } = useLensAuthStore();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const reconnectWallet = useReconnectWallet();

  useEffect(() => {
    if (!currentProfile) return;
    setName(currentProfile?.metadata?.name ?? "")
    setBio(currentProfile?.metadata?.bio ?? "")
    setProfilePictureUrl(currentProfile?.metadata?.picture ?? "")
  }, [currentProfile])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setProfilePictureUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletClient) {
      reconnectWallet();
      return;
    }

    if (!name) {
      toast.error("Display name can not be empty.");
      return;
    }

    if (!bio) {
      toast.error("Bio can not be empty.");
      return;
    }
   

    setIsLoading(true);
    
    try {
      let pictureUri = currentProfile?.metadata?.picture;
      
      if (profilePicture) {
        const uploadedUrl = await uploadFile(profilePicture);
        pictureUri = uploadedUrl;
      }

      const metadata = accountMetadataBuilder({
        name: name || currentProfile?.username?.localName || "",
        bio: bio || currentProfile?.metadata?.bio || "",
        picture: pictureUri,
      });

      
      // Check if we have a session client
      if (!client || !client.isSessionClient()) {
        toast.error("Please login to update profile");
        return;
      }
      
      // Upload metadata to storage
      const { uri: metadataUri } = await storageClient.uploadAsJson(metadata);
      
      // Set account metadata using the session client
      const result = await setAccountMetadata(client, {
        metadataUri: uri(metadataUri),
      }).andThen(handleOperationWith(walletClient));
    
      if (result.isOk()) {
        setCurrentProfile({
          ...currentProfile,
          metadata: {
            ...currentProfile.metadata,
            name,
            bio,
            picture: pictureUri,
          },
          username: {
            ...currentProfile.username,
            localName: name,
          }
        })
        toast.success("Profile updated successfully!");
        onClose();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={profilePictureUrl || resolveUrl(currentProfile?.metadata?.picture) || "/gull.jpg"} 
                />
                <AvatarFallback className="text-2xl">
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="profile-picture" className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-3 py-2 border rounded-md hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Upload Picture</span>
                  </div>
                </Label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isLoading}
                />
                {profilePictureUrl && (profilePictureUrl !== currentProfile?.metadata?.picture) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProfilePicture(null);
                      setProfilePictureUrl("");
                    }}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                placeholder="Enter display name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="chip-button">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
