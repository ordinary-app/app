import { useState, useEffect, useCallback, useRef } from "react";
import { Post, PageSize, AnyPost } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useSharedPostActions } from "@/components/post/post-actions-context";
import { useLensAuthStore } from "@/stores/auth-store";
import { resolveUrl } from "@/utils/resolve-url";

type FeedType = "global" | "profile" | "custom";

interface useFeedOptions {
  type?: FeedType;
  profileAddress?: string;
  customFilter?: any;
  singlePost?: Post; // For single post actions
}

// Enhanced Post interface that matches post-list.tsx requirements
export interface EnhancedPost extends Omit
<Post, 'author' | 'timestamp' | 'id' |'gatewayUrl'|'contentUri'|'media'|'attachments'> {
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
  gatewayUrl?: string
  contentUri?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: string;
  media?: {
    type: "image" | "text"
    url?: string
  }
  attachments: Array<{
    item: string
    type: string
  }>;
}

export function useFeed(options: useFeedOptions = {}) {
  const { type = "global", profileAddress, customFilter, singlePost } = options;
  
  // Auth and client
  const { client, sessionClient, currentProfile } = useLensAuthStore();
  const { data: authenticatedUser, loading: authLoading } = useAuthenticatedUser();
  
  // Post actions context
  const { 
    getPostState, 
    initPostState
  } = useSharedPostActions();
  
  // Feed state
  const [posts, setPosts] = useState<EnhancedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Refs for polling
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPostIdRef = useRef<string | null>(null);
  
  const isLoggedIn = !!authenticatedUser && !authLoading;
  
  // Helper functions
  const getFilter = useCallback(() => {
    if (type === "global") {
      return { feeds: [{ globalFeed: true }] };
    } else if (type === "profile" && profileAddress) {
      return { authors: [profileAddress] };
    } else if (type === "custom" && customFilter) {
      return customFilter;
    }
    return { feeds: [{ globalFeed: true }] };
  }, [type, profileAddress, customFilter]);

  const transformLensPostsToEnhanced = useCallback((anyPosts: readonly AnyPost[]): EnhancedPost[] => {
    return anyPosts
      .filter((lensPost: any) => lensPost.__typename === 'Post')
      .map((lensPost: any) => {
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
            username: author.username,
            metadata: author.metadata,
            address: author.address,
            operations: author.operations,
          },
          isOriginal: checkIfOriginal(lensPost.metadata),
          likes: stats?.upvotes || 0,
          comments: stats?.comments || 0,
          isLiked: operations?.hasUpvoted || false,
          timestamp: formatTimestamp(lensPost.timestamp),
          attachments,
        };
      });
  }, []);

  const extractContentFromMetadata = (metadata: any): string => {
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
  };

  const extractAttachments = (metadata: any): Array<{ item: string; type: string }> => {
    if (!metadata) return [];
    const attachments: Array<{ item: string; type: string }> = [];
    if (metadata.__typename === 'ImageMetadata' || metadata.__typename === 'ArticleMetadata') {
      if (metadata.attachments && Array.isArray(metadata.attachments)) {
        metadata.attachments.forEach((att: any) => {
          if (att.item && att.type) {
            attachments.push({ item: att.item, type: att.type });
          }
        });
      }
    }
    if (metadata.__typename === 'ImageMetadata' && metadata.image) {
      const imageUrl = metadata.image.optimized?.uri || metadata.image.raw?.uri;
      if (imageUrl) {
        attachments.unshift({ item: imageUrl, type: metadata.image.type || 'image/jpeg' });
      }
    }
    return attachments;
  };

  const checkIfOriginal = (metadata: any): boolean => {
    if (!metadata?.attributes) return false;
    const licenseAttr = metadata.attributes.find((attr: any) => attr.key === "license");
    return licenseAttr && licenseAttr.value && licenseAttr.value !== null && licenseAttr.value !== "";
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  // Feed operations
  const loadPostsFromLens = useCallback(async (isRefresh = false, cursor: string | null = null) => {
    // Client should always be available for public posts
    if (!client) return;
    
    try {
      if (isRefresh) setRefreshing(true);
      else if (cursor) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      
      const result = await fetchPosts(client, {
        filter: getFilter(),
        pageSize: PageSize.Fifty,
        cursor: cursor || undefined,
      });
      
      if (result.isErr()) {
        setError(result.error.message || "Failed to fetch posts");
        return;
      }
      
      const { items, pageInfo } = result.value;
      if (items.length === 0 && !cursor) {
        setPosts([]);
        setHasMore(false);
        return;
      }
      
      const transformedPosts = transformLensPostsToEnhanced(items);
      
      // Initialize post states for actions
      transformedPosts.forEach(post => {
        initPostState(post as any);
      });
      
      if (transformedPosts.length > 0) {
        lastPostIdRef.current = transformedPosts[0].id;
      } else if (cursor) {
        setHasMore(false);
        return;
      }
      
      setCurrentCursor(pageInfo.next);
      setHasMore(!!pageInfo.next);
      
      if (isRefresh) {
        setPosts(transformedPosts);
        setLastRefreshTime(new Date());
      } else if (cursor) {
        setPosts(prev => [...prev, ...transformedPosts]);
      } else {
        setPosts(transformedPosts);
        setLastRefreshTime(new Date());
      }
      
      setNewPostsAvailable(false);
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [client, getFilter, transformLensPostsToEnhanced, initPostState]);

  const checkForNewPosts = useCallback(async () => {
    // Client should always be available for public posts
    if (!client) return;
    
    try {
      const result = await fetchPosts(client, {
        filter: getFilter(),
      });
      if (result.isErr()) return;
      
      const { items } = result.value;
      const transformedPosts = transformLensPostsToEnhanced(items);
      if (transformedPosts.length > 0 && transformedPosts[0].id !== lastPostIdRef.current) {
        setNewPostsAvailable(true);
      }
    } catch {}
  }, [client, getFilter, transformLensPostsToEnhanced]);

  const handleRefresh = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    loadPostsFromLens(true);
  }, [loadPostsFromLens]);

  const handleLoadMore = useCallback(() => {
    if (currentCursor && hasMore && !loadingMore) {
      loadPostsFromLens(false, currentCursor);
    }
  }, [currentCursor, hasMore, loadingMore, loadPostsFromLens]);

  const handleLoadNewPosts = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    setNewPostsAvailable(false);
    loadPostsFromLens(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadPostsFromLens]);

  // Initialize for feed only (singlePost is handled separately)
  useEffect(() => {
    if (singlePost) return; // Early return for single post - no initialization needed
    
    // Client should always be available for public posts
    if (!client) return;
    
    // Reset posts when filter changes 在filter变化时重置posts状态，防止状态混乱
    setPosts([]);
    setLoading(true);
    setError(null);
    setCurrentCursor(null);
    setHasMore(true);
    
    loadPostsFromLens();
    
    // Set up polling for new posts
    intervalRef.current = setInterval(checkForNewPosts, 45000);
    
    const handleFocus = () => {
      const timeSinceLastRefresh = Date.now() - lastRefreshTime.getTime();
      if (timeSinceLastRefresh > 120000) { // 2 minutes
        checkForNewPosts();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('focus', handleFocus);
    };
  }, [client, singlePost, type, profileAddress, customFilter]);

  // For single post actions - return minimal interface, actual actions handled by components
  if (singlePost) {
    const postState = getPostState(singlePost.id);
    return {
      // Single post state
      stats: postState?.stats ?? singlePost.stats,
      operations: postState?.operations ?? {
        hasUpvoted: false,
        hasBookmarked: false,
        hasReposted: false,
        hasQuoted: false,
        canComment: false,
        canRepost: false,
        canQuote: false,
        canBookmark: false,
        canCollect: false,
        canDelete: false,
        canTip: false,
      },
      isCommentSheetOpen: postState?.isCommentSheetOpen ?? false,
      isCollectSheetOpen: postState?.isCollectSheetOpen ?? false,
      
      // State
      isLoggedIn,
    };
  }

  // For feed
  return {
    // Feed state
    posts,
    loading,
    error,
    hasMore,
    loadingMore,
    refreshing,
    newPostsAvailable,
    lastRefreshTime,
    
    // Feed actions
    handleRefresh,
    handleLoadMore,
    handleLoadNewPosts,
    
    // State
    isLoggedIn,
  };
}