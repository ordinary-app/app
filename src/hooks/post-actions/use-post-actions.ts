import { Post, PostReactionType } from "@lens-protocol/client";
import { addReaction, bookmarkPost, undoBookmarkPost, undoReaction } from "@lens-protocol/client/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useSharedPostActions } from "@/contexts/post-actions-context";
import { useLensAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { resolveUrl } from "@/utils/resolve-url";

// For single post actions
export const usePostActions = (post: Post) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getPostState, initPostState, updatePostState, updatePostStats, updatePostOperations } =
    useSharedPostActions();

  const { sessionClient, currentProfile, loading } = useLensAuthStore();
  const isLoggedIn = !!currentProfile && !loading;

  useEffect(() => {
    initPostState(post);
  }, [post, initPostState]); // Only depend on post.id to avoid infinite loops
  
  const sharedState = getPostState(post.id);

  const { stats, operations, isCommentSheetOpen, isCollectSheetOpen } = useMemo(
    () => {
      
      return {
        stats: sharedState?.stats ?? post.stats,
        // Use shared state operations if available, otherwise use post operations
        operations: sharedState?.operations ?? (post.operations ? {
        hasUpvoted: post.operations.hasUpvoted,
        hasBookmarked: post.operations.hasBookmarked,
        hasReposted: post.operations.hasReposted?.optimistic ?? false,
        hasQuoted: post.operations.hasQuoted?.optimistic ?? false,
        canComment: post.operations.canComment?.__typename === "PostOperationValidationPassed",
        canRepost: post.operations.canRepost?.__typename === "PostOperationValidationPassed",
        canQuote: post.operations.canQuote?.__typename === "PostOperationValidationPassed",
        canBookmark: true,
        canCollect: post.operations.canSimpleCollect?.__typename === "SimpleCollectValidationPassed",
        canTip: post.operations.canTip ?? false,
        canDelete: post.operations.canDelete?.__typename === "PostOperationValidationPassed",
      } : {
        // Fallback to false if no operations available
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
      }),
      isCommentSheetOpen: sharedState?.isCommentSheetOpen ?? false,
      isCollectSheetOpen: sharedState?.isCollectSheetOpen ?? false,
    };
  },
    [sharedState, post.stats, post.operations, post]
  );

  const isCommentOpenParam = useMemo(
    () => searchParams.has("comment") && searchParams.get("comment") === post.slug,
    [searchParams, post.slug],
  );
  const isCollectOpenParam = useMemo(
    () => searchParams.has("collect") && searchParams.get("collect") === post.slug,
    [searchParams, post.slug],
  );

  useEffect(() => {
    if (sharedState && !sharedState.initialCommentUrlSynced) {
      const shouldOpen = isCommentOpenParam;
      if (shouldOpen && !sharedState.isCommentSheetOpen) {
        updatePostState(post.id, { isCommentSheetOpen: true, initialCommentUrlSynced: true });
      } else {
        updatePostState(post.id, { initialCommentUrlSynced: true });
      }
    }
  }, [isCommentOpenParam, post.id, sharedState, updatePostState]);

  useEffect(() => {
    if (sharedState && !sharedState.initialCollectUrlSynced) {
      const shouldOpen = isCollectOpenParam;
      if (shouldOpen && !sharedState.isCollectSheetOpen) {
        updatePostState(post.id, { isCollectSheetOpen: true, initialCollectUrlSynced: true });
      } else {
        updatePostState(post.id, { initialCollectUrlSynced: true });
      }
    }
  }, [isCollectOpenParam, post.id, sharedState, updatePostState]);

  const handleComment = useCallback(
    async (redirectToPost?: boolean) => {
      if (redirectToPost) {
        window.location.href = `${resolveUrl(post.slug)}?comment=${post.slug}`;
        return;
      }

      const newOpenState = !isCommentSheetOpen;

      updatePostState(post.id, { isCommentSheetOpen: newOpenState });

      const params = new URLSearchParams(searchParams);
      if (!newOpenState) {
        params.delete("comment");
      } else {
        params.set("comment", post.slug);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [post.id, post.author.username?.localName, post.slug, isCommentSheetOpen, updatePostState, router, searchParams],
  );

  const handleCollect = useCallback(async () => {
    const newOpenState = !isCollectSheetOpen;
    updatePostState(post.id, { isCollectSheetOpen: newOpenState });

    const params = new URLSearchParams(searchParams);
    if (!newOpenState) {
      params.delete("collect");
    } else {
      params.set("collect", post.slug);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [post.id, post.slug, isCollectSheetOpen, updatePostState, router, searchParams]);

  const handleCommentSheetOpenChange = useCallback(
    (open: boolean) => {
      if (isCommentSheetOpen !== open) {
        updatePostState(post.id, { isCommentSheetOpen: open });
      }

      const params = new URLSearchParams(searchParams);
      const currentParam = params.get("comment");
      if (!open && currentParam === post.slug) {
        params.delete("comment");
        router.replace(`?${params.toString()}`, { scroll: false });
      } else if (open && currentParam !== post.slug) {
        params.set("comment", post.slug);
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    },
    [post.id, post.slug, isCommentSheetOpen, updatePostState, router, searchParams],
  );

  const handleCollectSheetOpenChange = useCallback(
    (open: boolean) => {
      if (isCollectSheetOpen !== open) {
        updatePostState(post.id, { isCollectSheetOpen: open });
      }

      const params = new URLSearchParams(searchParams);
      const currentParam = params.get("collect");
      if (!open && currentParam === post.slug) {
        params.delete("collect");
        router.replace(`?${params.toString()}`, { scroll: false });
      } else if (open && currentParam !== post.slug) {
        params.set("collect", post.slug);
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    },
    [post.id, post.slug, isCollectSheetOpen, updatePostState, router, searchParams],
  );

  const handleBookmark = useCallback(async () => {
    if (!isLoggedIn || !sessionClient) {
      toast.error("Please connect your wallet to bookmark posts");
      return null;
    }

    const currentlyBookmarked = operations?.hasBookmarked || false;
    const currentCount = stats.bookmarks;

    // Optimistic update
    updatePostOperations(post.id, { hasBookmarked: !currentlyBookmarked });
    updatePostStats(post.id, { bookmarks: currentlyBookmarked ? Math.max(0, currentCount - 1) : currentCount + 1 });

    try {
      if (currentlyBookmarked) {
        await undoBookmarkPost(sessionClient, { post: post.id });
      } else {
        await bookmarkPost(sessionClient, { post: post.id });
      }
    } catch (error) {
      console.error("Failed to handle bookmark:", error);
      // Rollback on error
      updatePostOperations(post.id, { hasBookmarked: currentlyBookmarked });
      updatePostStats(post.id, { bookmarks: currentCount });
    }
  }, [post.id, operations, stats.bookmarks, updatePostOperations, updatePostStats, isLoggedIn, sessionClient]);

  const handleLike = useCallback(async () => {
    if (!isLoggedIn || !sessionClient) {
      toast.error("Please connect your wallet to like posts");
      return null;
    }

    const currentlyLiked = operations?.hasUpvoted || false;
    const currentCount = stats.upvotes;

    // Optimistic update
    updatePostOperations(post.id, { hasUpvoted: !currentlyLiked });
    updatePostStats(post.id, { upvotes: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1 });

    try {
      if (currentlyLiked) {
        await undoReaction(sessionClient, { post: post.id, reaction: PostReactionType.Upvote });
      } else {
        await addReaction(sessionClient, { post: post.id, reaction: PostReactionType.Upvote });
      }
    } catch (error) {
      console.error("Failed to handle like:", error);
      // Rollback on error
      updatePostOperations(post.id, { hasUpvoted: currentlyLiked });
      updatePostStats(post.id, { upvotes: currentCount });
    }
  }, [post.id, operations, stats.upvotes, updatePostOperations, updatePostStats, isLoggedIn, sessionClient]);

  return {
    handleComment,
    handleCollect,
    handleBookmark,
    handleLike,
    isCommentSheetOpen,
    isCollectSheetOpen,
    handleCommentSheetOpenChange,
    handleCollectSheetOpenChange,
    stats,
    operations,
    isLoggedIn,
  };
};
