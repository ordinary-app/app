"use client";

import { toast } from "sonner";
import { storageClient } from "@/lib/storage-client";

export const uploadFile = async (file: File) => {
  try {
    const response = await storageClient.uploadFile(file);
    return response.gatewayUrl;
  } catch (error) {
    console.error(error);
    toast.error("Failed to upload file");
    throw error;
  }
};
