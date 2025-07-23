import React from "react";
import Masonry from "react-layout-masonry";
import { Post } from "@lens-protocol/client";
import { PostCard } from "@/components/post/post-card";
import { CompactPostCard } from "@/components/post/compact-post-card";
import { useFeedContext } from "@/contexts/feed-context";
import { FeedViewToggle } from "@/components/feed/feed-view-toggle";

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
    // 瀑布流布局=======暂时不能用，貌似 Masonry 和react18不兼容
    return (
      <div className="w-full">
        {showToggle && (
          <div className="flex justify-center items-center mb-6 px-4">
            <FeedViewToggle />
          </div>
        )}
        <div className="w-full px-4">
          <Masonry columns={{ 350: 1, 640: 2, 1024: 3 }} gap={16}>
            {loading &&
              safeItems.length === 0 &&
              Array.from({ length: skeletonCount }, (_, i) => (
                <div key={`skeleton-${i}`} style={{ contain: "layout style" }}>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <div className="h-3 bg-gray-200 rounded flex-1"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-12 bg-gray-200 rounded"></div>
                          <div className="h-6 w-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {safeItems.map((post, index) => (
              <div
                key={post?.id || `item-${index}`}
                style={{ contain: "layout style" }}
                className="animate-fade-in"
              >
                <CompactPostCard post={post} />
              </div>
            ))}

            {loading &&
              safeItems.length > 0 &&
              Array.from({ length: Math.min(3, skeletonCount) }, (_, i) => (
                <div key={`loading-skeleton-${i}`} style={{ contain: "layout style" }}>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <div className="h-3 bg-gray-200 rounded flex-1"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-12 bg-gray-200 rounded"></div>
                          <div className="h-6 w-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Masonry>
        </div>
      </div>
    );
  }
  // 默认列表模式
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
