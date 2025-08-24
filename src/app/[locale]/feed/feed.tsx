"use client";

//import { useState, useEffect, useCallback, useRef } from "react"
//import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { Badge } from "@/components/ui/badge"
import {
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  RefreshCw
} from "lucide-react";
import { FeedFloatingActions } from "@/components/feed/feed-floating-actions";
import { FeedHeader } from "@/components/feed/feed-header";
import { PostList } from "@/components/feed/post-list";
import { useFeedContext } from "@/contexts/feed-context";
import { useFeed } from "@/hooks/use-feed";
import { useTranslations } from "next-intl";

export function Feed() {
  const t = useTranslations("feed");
  
  const { viewMode } = useFeedContext();
  const {
    posts,
    loading,
    error,
    hasMore,
    loadingMore,
    refreshing,
    lastRefreshTime,
    handleRefresh,
    handleLoadMore,
    handleLoadNewPosts,
  } = useFeed();

  return (
    <TooltipProvider>
      <div className={`${viewMode === 'list' ? 'max-w-xl' : 'max-w-5xl'} mx-auto space-y-6`}>
        {/* 出错提示 */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        
        {/* 帖子导航栏 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Latest
          </h1>
          <p className="text-gray-600">
            on global feed
          </p>
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
              </Button>
            </div>
          )}
          <FeedHeader />
        </div>    
        
        {/* 帖子列表 */}
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
              className="chip-button text-white"
            >
              {loadingMore ? <>Loading...</> : <>Load More</>}
            </Button>
          </div>
        )}
        {/* 浮动操作栏 */}
        <FeedFloatingActions
          onRefresh={handleRefresh}
          refreshing={refreshing}
          lastRefreshTime={lastRefreshTime}
        />
      </div>
    </TooltipProvider>
  );
}
