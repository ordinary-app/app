import React from "react";
import { Box, useMantineTheme } from '@mantine/core';
import { Post } from "@lens-protocol/client";
import { PostCard } from "@/components/post/post-card";
import { CompactPostCard } from "@/components/post/compact-post-card";
import { useFeedContext } from "@/contexts/feed-context";
import { FeedViewToggle } from "@/components/feed/feed-view-toggle";
import { MasonryGrid } from "@/components/feed/masonry-grid";

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
  const safeItems = posts && Array.isArray(posts) ? posts.filter((item) => item != null) : [];
  
  if (loading) {
    return (
      <div className="w-full">
        {showToggle && (
          <div className="flex justify-center items-center mb-6">
            <FeedViewToggle />
          </div>
        )}
        <div className="text-center py-8">loading...</div>
      </div>
    );
  }
  
  if (!posts.length) {
    return (
      <div className="w-full">
        <div className="text-center py-8 text-gray-400">{emptyText || "暂无内容"}</div>
      </div>
    );
  }
  if (viewMode === "masonry") {
    // 瀑布流布局
    return (
      <div className="w-full">
        {showToggle && (
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.lg }}>
            <FeedViewToggle />
          </Box>
        )}
        <MasonryGrid
          loading={loading}
          skeletonCount={skeletonCount}
          columns={{ base: 2, xs: 2, sm: 3, md: 4, lg: 4 }}
        >
          {safeItems.map((post) => (
            <CompactPostCard key={post?.id} post={post} />
          ))}
        </MasonryGrid>
      </div>
    );
  }
  // 列表布局
  return (
    <div className="w-full">
      {showToggle && (
        <div className="flex justify-center items-center mb-6">
          <FeedViewToggle />
        </div>
      )}
      <div className="flex flex-col gap-4 items-center">
        {safeItems.map((post, index) => (
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
      
      {loading && safeItems.length > 0 && (
        <div className="mt-6">
          {Array.from({ length: Math.min(3, skeletonCount) }).map((_, i) => (
            <div key={`skeleton-${i}`} className="animate-pulse mb-4">
              <div className="bg-gray-200 rounded-lg p-4 h-40">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
