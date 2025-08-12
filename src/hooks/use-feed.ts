import { useState, useEffect, useCallback, useRef } from "react";
import { PageSize, Post } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import { useSharedPostActions } from "@/contexts/post-actions-context";
import { useLensAuthStore } from "@/stores/auth-store";
import { useFeedContext } from "@/contexts/feed-context";

type FeedType = "global" | "profile" | "custom";

interface useFeedOptions {
  type?: FeedType;
  profileAddress?: string;
  customFilter?: any;
}


export function useFeed(options: useFeedOptions = {}) {
  const { type = "global", profileAddress, customFilter } = options;
  
  // Auth and client
  const { client, sessionClient, currentProfile, loading: authStoreLoading } = useLensAuthStore();

  // Feed context for viewMode
  const { viewMode } = useFeedContext();

  // Post actions context
  const { 
    initPostState
  } = useSharedPostActions();
  
  // Feed state
  const [posts, setPosts] = useState<Post[]>([]);
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
  
  const isLoggedIn = !!currentProfile && !authStoreLoading;
  const isAuthReady = !authStoreLoading;
  
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
      
      const result = await fetchPosts(sessionClient || client, {
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
      
      const filteredPosts = items.filter(item => item.__typename === 'Post') as Post[];

      // Initialize post states for actions
      filteredPosts.forEach(post => {
        initPostState(post);
      });
      
      if (filteredPosts.length > 0) {
        lastPostIdRef.current = filteredPosts[0].id;
      } else if (cursor) {
        setHasMore(false);
        return;
      }
      
      setCurrentCursor(pageInfo.next);
      setHasMore(!!pageInfo.next);
      
      if (isRefresh) {
        setPosts(filteredPosts);
        setLastRefreshTime(new Date());
      } else if (cursor) {
        setPosts(prev => [...prev, ...filteredPosts]);
      } else {
        setPosts(filteredPosts);
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
  }, [client, sessionClient, getFilter, initPostState]);

  const checkForNewPosts = useCallback(async () => {
    // Client should always be available for public posts
    if (!client) return;

    try {
      const result = await fetchPosts(sessionClient || client, {
        filter: getFilter(),
      });
      if (result.isErr()) return;
      
      const { items } = result.value;
      const filteredPosts = items.filter(item => item.__typename === 'Post') as Post[];
      if (filteredPosts.length > 0 && filteredPosts[0].id !== lastPostIdRef.current) {
        setNewPostsAvailable(true);
      }
    } catch {}
  }, [client, sessionClient, getFilter]);

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
    
    if (!isAuthReady) return;
    
    // Reset posts when filter changes
    setPosts([]);
    setLoading(true);
    setError(null);
    setCurrentCursor(null);
    setHasMore(true);
    
    const initializeAndLoadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchPosts(sessionClient || client, {
          filter: getFilter(),
          pageSize: PageSize.Fifty,
        });
        
        if (result.isErr()) {
          setError(result.error.message || "Failed to fetch posts");
          return;
        }
        
        const { items, pageInfo } = result.value;
        if (items.length === 0) {
          setPosts([]);
          setHasMore(false);
          return;
        }
        
        const filteredPosts = items.filter(item => item.__typename === 'Post') as Post[];

        // Initialize post states for actions
        filteredPosts.forEach(post => {
          initPostState(post);
        });
        
        if (filteredPosts.length > 0) {
          lastPostIdRef.current = filteredPosts[0].id;
        }
        
        setCurrentCursor(pageInfo.next);
        setHasMore(!!pageInfo.next);
        setPosts(filteredPosts);
        setLastRefreshTime(new Date());
        setNewPostsAvailable(false);
      } catch (err) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    
    initializeAndLoadPosts();
    
    // Set up polling for new posts
    const pollForNewPosts = async () => {
      if (!client) return;

      try {
        const result = await fetchPosts(sessionClient || client, {
          filter: getFilter(),
        });
        if (result.isErr()) return;
        
        const { items } = result.value;
        const filteredPosts = items.filter(item => item.__typename === 'Post') as Post[];
        if (filteredPosts.length > 0 && filteredPosts[0].id !== lastPostIdRef.current) {
          setNewPostsAvailable(true);
        }
      } catch {}
    };
    
    intervalRef.current = setInterval(pollForNewPosts, 45000);
    
    const handleFocus = () => {
      const timeSinceLastRefresh = Date.now() - lastRefreshTime.getTime();
      if (timeSinceLastRefresh > 120000) { // 2 minutes
        pollForNewPosts();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('focus', handleFocus);
    };
  }, [client, sessionClient, isAuthReady, type, profileAddress, customFilter, viewMode]);

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