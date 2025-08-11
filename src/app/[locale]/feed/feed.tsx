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
//import { useWalletCheck } from "@/hooks/use-wallet-check"
//import { toast } from "sonner"
import { PostList } from "@/components/feed/post-list";
import { useFeed } from "@/hooks/use-feed";

export function Feed() {
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

  return (
    <TooltipProvider>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 错误信息显示 */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {/* 新帖子提示 */}
        {newPostsAvailable && (
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
        )}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Latest</h1>
          <p className="text-gray-600">on global feed</p>
          {/* 第一条帖子上方的信息栏 */}
          {posts && posts.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-4 text-sm">
              <div className="text-gray-400">
                Last updated: {lastRefreshTime?.toLocaleTimeString()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center h-9"
              >
                <RefreshCw
                  className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
                />
                {/*refreshing ? 'Refreshing...' : 'Refresh'*/}
              </Button>
            </div>
          )}
        </div>
        <PostList
          posts={posts || []}
          loading={loading || loadingMore}
          emptyText="No More"
          skeletonCount={6}
        />
        {/* 加载更多按钮 */}
        {hasMore && (
          <div className="flex justify-center mt-6 mb-12">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="harbor-button text-white"
            >
              {loadingMore ? <>Loading...</> : <>Load More</>}
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
