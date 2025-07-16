import React from "react";
import { EnhancedPost } from "@/utils/post-transformer";
import { PostCard } from "@/components/post/post-card";
import { useFeedContext } from "@/contexts/feed-context";
import { FeedViewToggle } from "@/components/feed/feed-view-toggle";

// Export the EnhancedPost type for compatibility
export type Post = EnhancedPost;

interface PostListProps {
  posts: EnhancedPost[];
  loading?: boolean;
  emptyText?: string;
  renderMode?: "list" | "masonry";
  showToggle?: boolean;
}

export function PostList({ posts, loading, emptyText, renderMode, showToggle = true }: PostListProps) 
{
  const { viewMode } = useFeedContext();
  const mode = renderMode || viewMode;
  
  if (loading) {
    return (
      <div className="w-full">
        {showToggle && (
          <div className="flex justify-center items-center mb-6">
            <div></div>
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
        {showToggle && (
          <div className="flex justify-center items-center mb-6">
            <div></div>
            <FeedViewToggle />
          </div>
        )}
        <div className="text-center py-8 text-gray-400">{emptyText || "暂无内容"}</div>
      </div>
    );
  }
  if (mode === "masonry") {
    // 瀑布流布局
    return (
      <div className="w-full">
        {showToggle && (
          <div className="flex justify-center items-center mb-6 px-4">
            <div></div>
            <FeedViewToggle />
          </div>
        )}
        <div className="w-full px-4">
          <div className="masonry-columns">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="masonry-item animate-fade-in"
                style={{ 
                  contain: "layout style",
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // 默认列表模式
  return (
    <div className="w-full">
      {showToggle && (
        <div className="flex justify-center items-center mb-6">
          <div></div>
          <FeedViewToggle />
        </div>
      )}
      <div className="flex flex-col gap-4 items-center">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="w-full animate-fade-in"
            style={{ 
              contain: "layout style",
              animationDelay: `${index * 0.1}s`
            }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
