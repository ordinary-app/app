import { Post, AnyPost } from "@lens-protocol/client";
import { resolveUrl } from "@/utils/resolve-url";

// Enhanced Post interface that matches post-list.tsx requirements
export interface EnhancedPost extends Omit<Post, 'author' | 'timestamp' | 'id' | 'gatewayUrl' | 'contentUri' | 'media' | 'attachments'> {
  id: string;
  content: string;
  author: {
    handle: string;
    displayName: string;
    avatar?: string;
    username?: { localName: string };
    metadata?: { name?: string; picture?: string };
    address?: string;
    operations?: {
      isFollowedByMe: boolean;
      isFollowingMe: boolean;
    };
  };
  isOriginal: boolean;
  gatewayUrl?: string;
  contentUri?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: string;
  media?: {
    type: "image" | "text";
    url?: string;
  };
  attachments: Array<{
    item: string;
    type: string;
  }>;
}

/**
 * Transforms a Lens Protocol post into an EnhancedPost format
 * that matches the application's post interface requirements.
 */
export function transformLensPostToEnhanced(lensPost: Post): EnhancedPost {
  const content = extractContentFromMetadata(lensPost.metadata);
  const author = lensPost.author || {};
  const stats = lensPost.stats || {};
  const attachments = extractAttachments(lensPost.metadata);
  const operations = lensPost.operations;
  
  return {
    ...lensPost,
    content,
    author: {
      handle: author.username?.localName || "unknown",
      displayName: author.metadata?.name || author.username?.localName || "Unknown User",
      avatar: author.metadata?.picture ? resolveUrl(author.metadata?.picture) : undefined,
      username: author.username ? { localName: author.username.localName } : undefined,
      metadata: author.metadata ? { 
        name: author.metadata.name || undefined, 
        picture: author.metadata.picture || undefined 
      } : undefined,
      address: author.address,
      operations: author.operations ? {
        isFollowedByMe: false,
        isFollowingMe: false,
      } : undefined,
    },
    isOriginal: checkIfOriginal(lensPost.metadata),
    likes: stats?.upvotes || 0,
    comments: stats?.comments || 0,
    isLiked: operations?.hasUpvoted || false,
    timestamp: formatTimestamp(lensPost.timestamp),
    attachments,
  };
}

/**
 * Transforms multiple Lens Protocol posts into EnhancedPost format
 */
export function transformLensPostsToEnhanced(anyPosts: readonly AnyPost[]): EnhancedPost[] {
  return anyPosts
    .filter((lensPost: any) => lensPost.__typename === 'Post')
    .map((lensPost: any) => transformLensPostToEnhanced(lensPost));
}

/**
 * Extracts content from different types of Lens metadata
 */
export function extractContentFromMetadata(metadata: any): string {
  if (!metadata) return "No content available";
  
  switch (metadata.__typename) {
    case 'TextOnlyMetadata':
    case 'ArticleMetadata':
    case 'ImageMetadata':
    case 'VideoMetadata':
    case 'AudioMetadata':
      return metadata.content || "No content available";
    default:
      return "No content available";
  }
}

/**
 * Extracts attachments from Lens metadata
 */
export function extractAttachments(metadata: any): Array<{ item: string; type: string }> {
  if (!metadata) return [];
  
  const attachments: Array<{ item: string; type: string }> = [];
  
  // Handle regular attachments
  if (metadata.__typename === 'ImageMetadata' || metadata.__typename === 'ArticleMetadata') {
    if (metadata.attachments && Array.isArray(metadata.attachments)) {
      metadata.attachments.forEach((att: any) => {
        if (att.item && att.type) {
          attachments.push({ item: att.item, type: att.type });
        }
      });
    }
  }
  
  // Handle primary image for ImageMetadata
  if (metadata.__typename === 'ImageMetadata' && metadata.image) {
    const imageUrl = metadata.image.optimized?.uri || metadata.image.raw?.uri;
    if (imageUrl) {
      attachments.unshift({ item: imageUrl, type: metadata.image.type || 'image/jpeg' });
    }
  }
  
  return attachments;
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
 * Extracts media information from metadata
 */
export function extractMediaFromMetadata(metadata: any): { type: "image" | "text"; url?: string } | undefined {
  if (!metadata) return undefined;
  
  // Handle image metadata
  if (metadata.__typename === 'ImageMetadata' && metadata.image) {
    const imageUrl = metadata.image.optimized?.uri || metadata.image.raw?.uri;
    return imageUrl ? { type: "image", url: imageUrl } : undefined;
  }
  
  // Handle video metadata
  if (metadata.__typename === 'VideoMetadata' && metadata.video) {
    const videoUrl = metadata.video.optimized?.uri || metadata.video.raw?.uri;
    return videoUrl ? { type: "image", url: videoUrl } : undefined; // Using "image" type for consistency
  }
  
  // Default to text type
  return { type: "text" };
}

/**
 * Extracts author information and transforms it to the expected format
 */
export function transformAuthor(author: any) {
  if (!author) return null;
  
  return {
    handle: author.username?.localName || "unknown",
    displayName: author.metadata?.name || author.username?.localName || "Unknown User",
    avatar: author.metadata?.picture ? resolveUrl(author.metadata?.picture) : undefined,
    username: author.username,
    metadata: author.metadata,
    address: author.address,
    operations: author.operations,
  };
}

/**
 * Safely extracts stats from a post
 */
export function extractPostStats(stats: any) {
  if (!stats) {
    return {
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      bookmarks: 0,
      quotes: 0,
      reposts: 0,
    };
  }
  
  return {
    upvotes: stats.upvotes || 0,
    downvotes: stats.downvotes || 0,
    comments: stats.comments || 0,
    bookmarks: stats.bookmarks || 0,
    quotes: stats.quotes || 0,
    reposts: stats.reposts || 0,
  };
}