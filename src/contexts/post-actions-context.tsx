"use client";

import { LoggedInPostOperations, Post, PostStats } from "@lens-protocol/client";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLensAuthStore } from "@/stores/auth-store";
//import { CommentSheet } from "@/components/comment/comment-sheet";

interface BooleanPostOperations {
  hasUpvoted: boolean;
  hasBookmarked: boolean;
  hasReposted: boolean;
  hasQuoted: boolean;
  canComment: boolean;
  canRepost: boolean;
  canQuote: boolean;
  canBookmark: boolean;
  canCollect: boolean;
  canDelete: boolean;
  canTip: boolean;
}

interface PostActionState {
  post: Post;
  stats: PostStats;
  operations: BooleanPostOperations;
  isCommentSheetOpen: boolean;
  isCollectSheetOpen: boolean;
  initialCommentUrlSynced: boolean;
  initialCollectUrlSynced: boolean;
}

interface PostActionsContextType {
  getPostState: (postId: string) => PostActionState | undefined;
  initPostState: (post: Post) => void;
  updatePostState: (postId: string, updates: Partial<Omit<PostActionState, "post">>) => void;
  updatePostStats: (postId: string, updates: Partial<PostStats>) => void;
  updatePostOperations: (postId: string, updates: Partial<any>) => void;
}

const PostActionsContext = createContext<PostActionsContextType | undefined>(undefined);

export const PostActionsProvider = ({ children }: { children: ReactNode }) => {
  const { sessionClient, currentProfile, loading } = useLensAuthStore();
  const [postStates, setPostStates] = useState<Map<string, PostActionState>>(new Map());
  const [visibleCommentPost, setVisibleCommentPost] = useState<Post | null>(null);
  const [visibleCollectPost, setVisibleCollectPost] = useState<Post | null>(null);

  const isReady = !loading && sessionClient !== null;

  const defaultOperations: BooleanPostOperations = useMemo(() => ({
    hasUpvoted: false,
    hasBookmarked: false,
    hasReposted: false,
    hasQuoted: false,
    canComment: false,
    canRepost: false,
    canQuote: false,
    canBookmark: false,
    canCollect: false,
    canTip: true,
    canDelete: false,
  }), []);

  const convertToBooleanOperations = useCallback((operations: LoggedInPostOperations): BooleanPostOperations => {
    return {
      hasUpvoted: operations.hasUpvoted,
      hasBookmarked: operations.hasBookmarked,
      hasReposted: operations.hasReposted.optimistic,
      hasQuoted: operations.hasQuoted.optimistic,
      canComment: operations.canComment.__typename === "PostOperationValidationPassed",
      canRepost: operations.canRepost.__typename === "PostOperationValidationPassed",
      canQuote: operations.canQuote.__typename === "PostOperationValidationPassed",
      canBookmark: true,
      canCollect: operations.canSimpleCollect.__typename === "SimpleCollectValidationPassed",
      canTip: operations.canTip,
      canDelete: operations.canDelete?.__typename === "PostOperationValidationPassed",
    };
  }, []);

  const initPostState = useCallback(
    (post: Post) => {
      setPostStates((prevStates) => {
        const existingState = prevStates.get(post.id);
        
        // 如果状态已存在且用户会话状态没有变化，不要重复初始化
        if (existingState && !isReady) {
          return prevStates;
        }
        
        const newStates = new Map(prevStates);
        
        // 优先使用从sessionClient获取的operations，确保反映当前用户状态
        const operations = (isReady && post.operations) 
          ? convertToBooleanOperations(post.operations) 
          : existingState?.operations || { ...defaultOperations };
        
        newStates.set(post.id, {
          post: post,
          stats: { ...post.stats },
          operations,
          isCommentSheetOpen: existingState?.isCommentSheetOpen || false,
          isCollectSheetOpen: existingState?.isCollectSheetOpen || false,
          initialCommentUrlSynced: existingState?.initialCommentUrlSynced || false,
          initialCollectUrlSynced: existingState?.initialCollectUrlSynced || false,
        });
        return newStates;
      });
    },
    [defaultOperations, convertToBooleanOperations, isReady],
  );

  const getPostState = useCallback(
    (postId: string): PostActionState | undefined => {
      return postStates.get(postId);
    },
    [postStates],
  );

  const updatePostStateInternal = useCallback(
    (postId: string, updateFn: (prevState: PostActionState) => PostActionState) => {
      setPostStates((prevStates) => {
        const currentState = prevStates.get(postId);
        if (currentState) {
          const newState = updateFn(currentState);
          if (newState !== currentState) {
            const newStates = new Map(prevStates);
            newStates.set(postId, newState);
            return newStates;
          }
        }
        return prevStates;
      });
    },
    [],
  );

  const updatePostState = useCallback(
    (postId: string, updates: Partial<Omit<PostActionState, "post">>) => {
      updatePostStateInternal(postId, (prevState) => ({
        ...prevState,
        ...updates,
      }));
    },
    [updatePostStateInternal],
  );

  const updatePostStats = useCallback(
    (postId: string, updates: Partial<PostStats>) => {
      updatePostStateInternal(postId, (prevState) => ({
        ...prevState,
        stats: { ...prevState.stats, ...updates },
      }));
    },
    [updatePostStateInternal],
  );

  const updatePostOperations = useCallback(
    (postId: string, updates: Partial<any>) => {
      updatePostStateInternal(postId, (prevState) => {
        const operations = prevState.operations || {};
        return {
          ...prevState,
          operations: { ...operations, ...updates },
        };
      });
    },
    [updatePostStateInternal],
  );

  const activeCommentPostEntry = useMemo(() => {
    for (const entry of postStates.entries()) {
      if (entry[1].isCommentSheetOpen) {
        return entry;
      }
    }
    return undefined;
  }, [postStates]);

  const activeCollectPostEntry = useMemo(() => {
    for (const entry of postStates.entries()) {
      if (entry[1].isCollectSheetOpen) {
        return entry;
      }
    }
    return undefined;
  }, [postStates]);

  useEffect(() => {
    if (activeCommentPostEntry) {
      setVisibleCommentPost(activeCommentPostEntry[1].post);
    }
  }, [activeCommentPostEntry]);

  useEffect(() => {
    if (activeCollectPostEntry) {
      setVisibleCollectPost(activeCollectPostEntry[1].post);
    }
  }, [activeCollectPostEntry]);

  const handleCommentSheetOpenChange = useCallback(
    (open: boolean) => {
      const postId = activeCommentPostEntry?.[0];
      const postSlug = activeCommentPostEntry?.[1]?.post.slug;

      if (!open && postId && postSlug) {
        updatePostState(postId, { isCommentSheetOpen: false });

        const params = new URLSearchParams(window.location.search);
        if (params.get("comment") === postSlug) {
          params.delete("comment");
          window.history.replaceState({}, "", `?${params.toString()}`);
        }

        setTimeout(() => {
          setVisibleCommentPost(null);
        }, 300);
      }
    },
    [activeCommentPostEntry, updatePostState],
  );

  const handleCollectSheetOpenChange = useCallback(
    (open: boolean) => {
      const postId = activeCollectPostEntry?.[0];
      const postSlug = activeCollectPostEntry?.[1]?.post.slug;

      if (!open && postId && postSlug) {
        updatePostState(postId, { isCollectSheetOpen: false });

        const params = new URLSearchParams(window.location.search);
        if (params.get("collect") === postSlug) {
          params.delete("collect");
          window.history.replaceState({}, "", `?${params.toString()}`);
        }

        setTimeout(() => {
          setVisibleCollectPost(null);
        }, 300);
      }
    },
    [activeCollectPostEntry, updatePostState],
  );

  const value = {
    getPostState,
    initPostState,
    updatePostState,
    updatePostStats,
    updatePostOperations,
  };

  // 添加useEffect来监听currentProfile变化，重新初始化所有帖子状态
  useEffect(() => {
    if (isReady && currentProfile) {
      // 当用户登录状态或profile发生变化时，重新初始化所有帖子状态
      setPostStates(prevStates => {
        const newStates = new Map<string, PostActionState>();
        
        // 重新初始化所有已存在的帖子状态，确保operations反映当前用户状态
        for (const [postId, state] of prevStates.entries()) {
          const post = state.post;
          newStates.set(postId, {
            ...state,
            // 重新计算operations以反映当前用户的权限和状态
            operations: post.operations 
              ? convertToBooleanOperations(post.operations) 
              : { ...defaultOperations }
          });
        }
        
        return newStates;
      });
    }
  }, [currentProfile, isReady, convertToBooleanOperations, defaultOperations]);

  const isCommentSheetCurrentlyOpen = activeCommentPostEntry !== undefined;
  const isCollectSheetCurrentlyOpen = activeCollectPostEntry !== undefined;
  
  return (
    <PostActionsContext.Provider value={value}>
      {children}

      {/*visibleCommentPost && (
        <CommentSheet
          post={visibleCommentPost}
          forcedOpen={isCommentSheetCurrentlyOpen}
          onOpenChange={handleCommentSheetOpenChange}
        />
      )*/}

      {/*visibleCollectPost && (
        <PostCollect
          post={visibleCollectPost}
          isOpen={isCollectSheetCurrentlyOpen}
          onOpenChange={handleCollectSheetOpenChange}
        />
      )*/}
    </PostActionsContext.Provider>
  );
//}
};

export const useSharedPostActions = () => {
  const context = useContext(PostActionsContext);
  if (context === undefined) {
    throw new Error("useSharedPostActions must be used within a PostActionsProvider");
  }
  return context;
};