import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Post, PageSize, PostReferenceType } from "@lens-protocol/client";
import { fetchPost, fetchPostReferences } from "@lens-protocol/client/actions";
import { useSharedPostActions } from "@/contexts/post-actions-context";
import { useLensAuthStore } from "@/stores/auth-store";

interface UsePostOptions {
  postId: string;
  initialPost?: Post;
  autoFetch?: boolean;
}

interface UsePostReturn {
  // Post data
  post: Post | null;
  comments: any[];
  
  // Loading states
  loading: boolean;
  commentsLoading: boolean;
  error: string | null;
  commentsError: string | null;
  
  // Pagination
  hasMoreComments: boolean;
  loadingMoreComments: boolean;
  commentsPageInfo: { next?: string } | null;
  
  // Actions
  refetchPost: () => Promise<void>;
  loadComments: () => Promise<void>;
  loadMoreComments: () => Promise<void>;
  refreshComments: (retryCount?: number, expectNew?: boolean) => Promise<void>;
  setComments: (newComments: any[]) => void;
  
  // Shared post actions state
  stats: any;
  operations: any;
  isCommentSheetOpen: boolean;
  isCollectSheetOpen: boolean;
  
  // Auth state
  isLoggedIn: boolean;
}

/**
 * A hook to manage the state and actions for a single post.
 * It fetches the post by its ID, its comments, and syncs its state with useSharedPostActions.
 */
export function usePost(options: UsePostOptions): UsePostReturn {
  const { postId, initialPost, autoFetch = true } = options;
  
  // Auth and client
  const { client, sessionClient, currentProfile, loading: authStoreLoading } = useLensAuthStore();
  
  // Post actions context
  const { 
    getPostState, 
    initPostState,
    updatePostState,
    updatePostStats,
    updatePostOperations
  } = useSharedPostActions();
  
  // Post state
  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [loading, setLoading] = useState(!initialPost && autoFetch);
  const [error, setError] = useState<string | null>(null);
  
  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [commentsPageInfo, setCommentsPageInfo] = useState<{ next?: string } | null>(null);
  
  // Enhanced comment state for retry logic
  const currentCommentCount = useRef<number>(0);
  const expectingNewComment = useRef<boolean>(false);
  
  const isLoggedIn = !!currentProfile && !authStoreLoading;
  const isAuthReady = !authStoreLoading;
  
  // Get post state from shared context
  const postState = useMemo(() => {
    return getPostState(postId);
  }, [getPostState, postId]);
  
  // Fetch post data
  const fetchPostData = useCallback(async () => {
    if (!client || !postId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 获取帖子数据时，使用sessionClient可以获取与当前用户相关的操作数据
      const lensPost = await fetchPost(sessionClient || client, { post: postId }).unwrapOr(null);
      if (!lensPost) {
        setError("Post not found");
        return;
      }
      
      // Check if it's actually a Post (not a Repost or Quote)
      if (lensPost.__typename !== 'Post') {
        setError("Invalid post type");
        return;
      }
      
      // Set post and initialize state for actions
      const lensPostTyped = lensPost as Post;
      setPost(lensPostTyped);
      initPostState(lensPostTyped);
      
    } catch (err) {
      setError("Failed to fetch post");
    } finally {
      setLoading(false);
    }
  }, [client, sessionClient, postId, initPostState]);
  
  // Fetch comments
  const fetchComments = useCallback(async (cursor?: string, isRefresh = false) => {
    if (!client || !postId) return;
    
    try {
      if (isRefresh) {
        setCommentsLoading(true);
        setCommentsError(null);
      } else if (cursor) {
        setLoadingMoreComments(true);
      } else {
        setCommentsLoading(true);
        setCommentsError(null);
      }
      
      // 获取评论时，使用sessionClient可以获取与当前用户相关的操作数据
      const result = await fetchPostReferences(sessionClient || client, {
        referencedPost: postId,
        referenceTypes: [PostReferenceType.CommentOn],
        pageSize: PageSize.Ten,
        ...(cursor ? { cursor } : {}),
      });
      
      if (result.isErr()) {
        setCommentsError(result.error.message || "Failed to fetch comments");
        return;
      }
      
      const { items, pageInfo } = result.value;
      
      if (isRefresh || !cursor) {
        setComments([...items]);
      } else {
        setComments(prev => [...prev, ...items]);
      }
      
      setCommentsPageInfo({ next: pageInfo.next || undefined });
      setHasMoreComments(!!pageInfo.next);
      
    } catch (err) {
      setCommentsError("Failed to fetch comments");
    } finally {
      setCommentsLoading(false);
      setLoadingMoreComments(false);
    }
  }, [client, sessionClient, postId]);
  
  // Public actions
  const refetchPost = useCallback(async () => {
    await fetchPostData();
  }, [fetchPostData]);
  
  const loadComments = useCallback(async () => {
    await fetchComments();
  }, [fetchComments]);
  
  const loadMoreComments = useCallback(async () => {
    if (commentsPageInfo?.next && hasMoreComments && !loadingMoreComments) {
      await fetchComments(commentsPageInfo.next);
    }
  }, [fetchComments, commentsPageInfo, hasMoreComments, loadingMoreComments]);
  
  const refreshComments = useCallback(async (retryCount = 0, expectNew = false) => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    
    if (retryCount === 0 && expectNew) {
      // Only mark that we're expecting a new comment if explicitly told to
      expectingNewComment.current = true;
    }
    
    await fetchComments(undefined, true);
    
    // Only retry if:
    // 1. We're expecting a new comment (e.g., after posting)
    // 2. We haven't exceeded max retries
    if (expectingNewComment.current && retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return refreshComments(retryCount + 1, expectNew);
    }
    
    // Reset expectation flag
    expectingNewComment.current = false;
  }, [fetchComments]);
  
  // Manual comment setting function (for compatibility with existing code)
  const setCommentsManually = useCallback((newComments: any[]) => {
    setComments(newComments);
    currentCommentCount.current = newComments.length;
    setCommentsPageInfo(null);
    setHasMoreComments(false);
  }, []);
  
  // Initialize post data
  useEffect(() => {
    if (autoFetch && !initialPost && isAuthReady) {
      fetchPostData();
    }
  }, [autoFetch, initialPost, isAuthReady]);
  
  // Initialize post state if we have initial post
  useEffect(() => {
    if (initialPost && isAuthReady) {
      initPostState(initialPost);
    }
  }, [initialPost, isAuthReady]);
  
  // Auto-load comments when post is available
  useEffect(() => {
    if (post && autoFetch && isAuthReady) {
      loadComments();
    }
  }, [post, autoFetch, isAuthReady]);
  
  return {
    // Post data
    post,
    comments,
    
    // Loading states
    loading,
    commentsLoading,
    error,
    commentsError,
    
    // Pagination
    hasMoreComments,
    loadingMoreComments,
    commentsPageInfo,
    
    // Actions
    refetchPost,
    loadComments,
    loadMoreComments,
    refreshComments,
    setComments: setCommentsManually,
    
    // Shared post actions state
    stats: postState?.stats,
    operations: postState?.operations,
    isCommentSheetOpen: postState?.isCommentSheetOpen ?? false,
    isCollectSheetOpen: postState?.isCollectSheetOpen ?? false,
    
    // Auth state
    isLoggedIn,
  };
}