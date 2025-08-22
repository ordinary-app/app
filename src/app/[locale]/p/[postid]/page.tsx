'use client';

import { usePost } from '@/hooks/use-post';
import { useParams } from 'next/navigation';
import { PostActionsBar } from '@/components/post/post-actions-bar';
import { PostCard } from '@/components/post/post-card';
import { FeedFloatingActions } from "@/components/feed/feed-floating-actions";
import { TooltipProvider } from "@/components/ui/tooltip";
//import { PostTags } from '@/components/post/post-tags';
//import { CommentPreview } from '@/components/comment/comment-preview';

export default function PostPage() {
  const params = useParams();
  const postId = params.postid as string;
  
  const { 
    post,
    loading,
    error,
  } = usePost({
    postId,
    autoFetch: true
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Post not found</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
        <PostCard post={post} disableNavigation />
        <FeedFloatingActions onRefresh={() => {}} refreshing={false} />
      </div>
    </TooltipProvider>
  );
}