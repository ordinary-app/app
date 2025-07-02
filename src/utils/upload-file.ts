"use client";

import { toast } from "sonner";
import { storageClient } from "@/lib/storage-client";
import { resolveUrl } from "./resolve-url";

export const uploadFile = async (file: File) => {
  try {

    const response = await storageClient.uploadFile(file);
    console.log(`Upload file success-------`, response);
    
    return response.gatewayUrl;
  } catch (error) {
    console.error(error);
    toast.error("Failed to upload file");
    throw error;
  }
};
