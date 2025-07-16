import { useState, useEffect, useCallback, useRef } from "react";
import { PageSize } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useSharedPostActions } from "@/contexts/post-actions-context";
import { useLensAuthStore } from "@/stores/auth-store";
import { EnhancedPost, transformLensPostsToEnhanced } from "@/utils/post-transformer";

type FeedType = "global" | "profile" | "custom";

interface useFeedOptions {
  type?: FeedType;
  profileAddress?: string;
  customFilter?: any;
}


export function useFeed(options: useFeedOptions = {}) {
  const { type = "global", profileAddress, customFilter } = options;
  
  // Auth and client
  const { client, sessionClient, currentProfile } = useLensAuthStore();
  const { data: authenticatedUser, loading: authLoading } = useAuthenticatedUser();
  
  // Post actions context
  const { 
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
  }, [client, getFilter, initPostState]);

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
  }, [client, getFilter]);

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

  // Initialize feed
  useEffect(() => {
    
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
  }, [client, type, profileAddress, customFilter]);

  // Feed interface
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