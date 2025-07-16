import React from "react";
import { EnhancedPost } from "@/hooks/use-feed";
import { PostCard } from "@/components/post/post-card";
import { useFeedContext } from "@/contexts/feed-context";

// Export the EnhancedPost type for compatibility
export type Post = EnhancedPost;

interface PostListProps {
  posts: EnhancedPost[];
  loading?: boolean;
  emptyText?: string;
  renderMode?: "list" | "masonry";
}

export function PostList({ posts, loading, emptyText, renderMode }: PostListProps) {
  const { viewMode } = useFeedContext();
  const mode = renderMode || viewMode;
  if (loading) {
    return <div className="text-center py-8">loading...</div>;
  }
  if (!posts.length) {
    return <div className="text-center py-8 text-gray-400">{emptyText || "暂无内容"}</div>;
  }
  if (mode === "masonry") {
    // 预留瀑布流布局，后续可用 react-masonry-css 或自定义实现
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    );
  }
  // 默认列表模式
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
