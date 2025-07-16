import { resolveUrl } from "@/utils/resolve-url";

/**
 * Formats timestamp into human-readable relative time
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  return "Just now";
}

/**
 * Checks if a post is original content based on license attribute
 */
export function checkIfOriginal(metadata: any): boolean {
  if (!metadata?.attributes) return false;
  
  const licenseAttr = metadata.attributes.find((attr: any) => attr.key === "license");
  return licenseAttr && licenseAttr.value && licenseAttr.value !== null && licenseAttr.value !== "";
}

/**
 * Extracts attachments from Lens metadata
 */
export function extractAttachments(metadata: any): Array<{ item: string; type: string }> {
  if (!metadata) return [];
  
  const attachments: Array<{ item: string; type: string }> = [];
  
  // Handle primary image for ImageMetadata
  if (metadata.__typename === 'ImageMetadata' && metadata.image) {
    const imageUrl = metadata.image.optimized?.uri || metadata.image.raw?.uri;
    if (imageUrl) {
      attachments.push({ item: imageUrl, type: metadata.image.type || 'image/jpeg' });
    }
  }
  
  // Handle regular attachments
  if (metadata.attachments && Array.isArray(metadata.attachments)) {
    metadata.attachments.forEach((att: any) => {
      if (att.item && att.type) {
        attachments.push({ item: att.item, type: att.type });
      }
    });
  }
  
  return attachments;
}