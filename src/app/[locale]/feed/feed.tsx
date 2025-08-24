"use client";

//import { useState, useEffect, useCallback, useRef } from "react"
//import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Heart,
  MessageCircle,
  Share,
  UserPlus,
  UserMinus,
  ExternalLink,
  Bookmark,
  Star,
  RefreshCw,
  ChevronUp,
} from "lucide-react";
//import { TokenIdDisplay } from "@/components/token-id-display"
//import { fetchPosts } from "@lens-protocol/client/actions"
//import { Post as LensPost, AnyPost, Cursor, PageSize } from "@lens-protocol/client"
//import { resolveUrl } from "@/utils/resolve-url"
//import { useLensAuthStore } from "@/stores/auth-store"
//import { toast } from "sonner"
import { PostList } from "@/components/feed/post-list";
import { useFeed } from "@/hooks/use-feed";
import { FeedHeader } from "@/components/feed/feed-header";
import { useFeedContext } from "@/contexts/feed-context";
import { FeedFloatingActions } from "@/components/feed/feed-floating-actions";

interface FeedProps {
  tagFilter?: string | null;
}

export function Feed({ tagFilter }: FeedProps) {
  const { viewMode } = useFeedContext();
  const {
    posts,
    loading,
    error,
    hasMore,
    loadingMore,
    refreshing,
    newPostsAvailable,
    lastRefreshTime,
    handleRefresh,
    handleLoadMore,
    handleLoadNewPosts,
  } = useFeed();

  // Filter posts by tag if tagFilter is provided
  const filteredPosts = tagFilter 
    ? posts?.filter(post => {
        // Check for tags in metadata
        const tags = (post.metadata as any)?.tags;
        if (Array.isArray(tags)) {
          return tags.some(tag => 
            tag.toLowerCase().includes(tagFilter.toLowerCase())
          );
        }
        return false;
      }) || []
    : posts || [];

  return (
    <TooltipProvider>
      <div className={`${viewMode === 'list' ? 'max-w-xl' : 'max-w-5xl'} mx-auto space-y-6`}>
        {/* Error notification */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {/* New posts notification */}
        {/*newPostsAvailable && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <Button
              onClick={handleLoadNewPosts}
              className="bg-harbor-600 hover:bg-harbor-700 text-white shadow-lg animate-bounce"
              size="sm"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              New posts available
            </Button>
          </div>
        )*/}
        {/* Post navigation bar */}
        <div className="text-center mb-8">
          <FeedHeader />
        </div>
        {/* Tag filter notification */}
        {tagFilter && (
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded mb-4 text-center">
            Showing posts with tag "#{tagFilter}"
          </div>
        )}
        {/* Post list */}
        <PostList
          posts={filteredPosts}
          loading={loading || loadingMore}
          emptyText={tagFilter ? `No posts found with tag "#${tagFilter}"` : "No More"}
          skeletonCount={6}
        />
        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mt-6 mb-12">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="chip-button text-white"
            >
              {loadingMore ? <>Loading...</> : <>Load More</>}
            </Button>
          </div>
        )}
        {/* Floating action bar */}
        <FeedFloatingActions
          onRefresh={handleRefresh}
          refreshing={refreshing}
          lastRefreshTime={lastRefreshTime}
        />
      </div>
    </TooltipProvider>
  );
}
