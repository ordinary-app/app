import React from "react";
import { Box, useMantineTheme } from '@mantine/core';
import { Post } from "@lens-protocol/client";
import { PostCard } from "@/components/post/post-card";
import { CompactPostCard } from "@/components/post/compact-post-card";
import { useFeedContext } from "@/contexts/feed-context";
import { FeedViewToggle } from "@/components/feed/feed-view-toggle";
import { MasonryGrid, PostSkeleton } from "@/components/feed/masonry-grid";

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  emptyText?: string;
  showToggle?: boolean;
  skeletonCount?: number;
}

export function PostList({ posts, loading, emptyText, showToggle = true, skeletonCount = 6 }: PostListProps) 
{
  const { viewMode } = useFeedContext();
  const theme = useMantineTheme();
  const items = posts && Array.isArray(posts) ? posts.filter((item) => item != null) : [];
  
  const renderToggle = () => {
    if (!showToggle) return null;
    
    return viewMode === "masonry" ? (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.lg }}>
        <FeedViewToggle />
      </Box>
    ) : (
      <div className="flex justify-center items-center mb-6">
        <FeedViewToggle />
      </div>
    );
  };
  
  // 初始加载
  if (loading && items.length === 0) {
    if (viewMode === "masonry") {
      return (
        <div className="w-full">
          {renderToggle()}
          <MasonryGrid
            loading={true}
            skeletonCount={skeletonCount}
            columns={{ base: 2, xs: 2, sm: 3, md: 4, lg: 4 }}
          >
            {[]}
          </MasonryGrid>
        </div>
      );
    }
    
    return (
      <div className="w-full">
        {renderToggle()}
        <div className="flex flex-col gap-4 items-center">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={`skeleton-${i}`} className="w-full max-w-2xl">
              <PostSkeleton theme={theme} height={160} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!posts.length) {
    return (
      <div className="w-full">
        <div className="text-center py-8 text-gray-400">{emptyText || "no content"}</div>
      </div>
    );
  }

  // 瀑布流布局
  if (viewMode === "masonry") {
    return (
      <div className="w-full">
        {renderToggle()}
        <MasonryGrid
          loading={loading && items.length > 0}
          skeletonCount={skeletonCount}
          columns={{ base: 2, xs: 2, sm: 3, md: 4, lg: 4 }}
        >
          {items.map((post) => (
            <CompactPostCard key={post?.id} post={post} />
          ))}
        </MasonryGrid>
      </div>
    );
  }
  
  // 列表布局
  if (viewMode === "list") {
    return (
      <div className="w-full">
        {renderToggle()}
        <div className="flex flex-col gap-4 items-center">
          {items.map((post, index) => (
            <div
              key={post?.id || `item-${index}`}
              className="w-full"
              style={{ 
                contain: "layout style",
                animationDelay: `${index * 0.1}s`
              }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
        
        {loading && items.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 items-center">
            {Array.from({ length: Math.min(3, skeletonCount) }).map((_, i) => (
              <div key={`skeleton-${i}`} className="w-full max-w-2xl">
                <PostSkeleton theme={theme} height={160} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
