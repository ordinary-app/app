"use client";

//import { useState, useEffect, useCallback, useRef } from "react"
//import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  X,
  Hash,
  ChevronDown,
} from "lucide-react";
//import { TokenIdDisplay } from "@/components/token-id-display"
//import { fetchPosts } from "@lens-protocol/client/actions"
//import { Post as LensPost, AnyPost, Cursor, PageSize } from "@lens-protocol/client"
//import { resolveUrl } from "@/utils/resolve-url"
//import { useLensAuthStore } from "@/stores/auth-store"
//import { toast } from "sonner"
import { PostList } from "@/components/feed/post-list";
import { TagFilterSidebar } from "@/components/feed/tag-filter-sidebar";
import { FeedViewToggle } from "@/components/feed/feed-view-toggle";
import { useFeed } from "@/hooks/use-feed";
import { useTranslations } from "next-intl";
import { FeedHeader } from "@/components/feed/feed-header";
import { useFeedContext } from "@/contexts/feed-context";
import { FeedFloatingActions } from "@/components/feed/feed-floating-actions";

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
    newPostsAvailable,
    lastRefreshTime,
    handleRefresh,
    handleLoadMore,
    handleLoadNewPosts,
    clearTagSearch,
    toggleTagSelection,
    selectOnlyTag,
    selectedTags,
    availableTags,
    tagsLoading,
    tagsError,
    fetchAvailableTags,
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
        
        {/* 新帖子提示 */}
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
        )}
        
        )*/}
        {/* 帖子导航栏 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {selectedTags.length > 0 
              ? selectedTags.map(tag => `#${tag}`).join(' ')
              : "Latest"
            }
          </h1>
          <p className="text-gray-600">
            {selectedTags.length > 0 ? t("tagSearch.tagResults") : "on global feed"}
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
                {/*refreshing ? 'Refreshing...' : 'Refresh'*/}
              </Button>
            </div>
          )}
          <FeedHeader />
        </div>
        
        {/* 主内容布局：左侧标签过滤，右侧视图切换+内容 */}
        <div className="flex gap-6">
          <TagFilterSidebar
            availableTags={availableTags}
            selectedTags={selectedTags}
            loading={tagsLoading}
            error={tagsError || null}
            onToggleTag={toggleTagSelection}
            onSelectOnly={selectOnlyTag}
            onClear={clearTagSearch}
            onRefresh={fetchAvailableTags}
          />

          <div className="flex-1 space-y-4">
            <div className="flex justify-end">
              <FeedViewToggle />
            </div>

            <PostList
              posts={posts || []}
              loading={loading || loadingMore}
              emptyText={selectedTags.length > 0 
                ? `${t("tagSearch.noResults")} ${selectedTags.map(tag => `#${tag}`).join(', ')}`
                : "No More"
              }
              showToggle={false}
              skeletonCount={6}
            />
          </div>
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
