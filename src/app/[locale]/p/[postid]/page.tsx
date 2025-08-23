'use client';

import { usePost } from '@/hooks/use-post';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PostActionsBar } from '@/components/post/post-actions-bar';
import { PostCard } from '@/components/post/post-card';
import { FeedFloatingActions } from "@/components/feed/feed-floating-actions";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BackButton } from "@/components/ui/back-button";
import { StorageDisplay } from "@/components/ui/storage-display";
import { CommentSection } from "@/components/ui/comment-section";
import { useComments } from "@/hooks/use-comments";

export default function PostPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const postId = params.postid as string;
  
  // 评论功能
  const isInlineMode = true;
  
  const { 
    post,
    loading,
    error,
  } = usePost({
    postId,
    autoFetch: true
  });

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    addComment,
    likeComment,
    replyToComment,
    refetch: refetchComments
  } = useComments({
    postId,
    autoFetch: isInlineMode
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
        {/* Back Button */}
        <BackButton />
        
        <PostCard post={post} disableNavigation />
        
        {/* Storage API Section */}
        <StorageDisplay post={post} className="mt-6" />
        
        {/* Comments Header */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Comments ({post.stats.comments})</h3>
        </div>
        
        {/* Comments Section - Only show in inline mode */}
        {isInlineMode && (
          <CommentSection
            postId={postId}
            comments={comments}
            onAddComment={addComment}
            onLikeComment={likeComment}
            onReplyToComment={replyToComment}
            className="mt-4"
          />
        )}
        
        {/* Comment Sheet - Commented out for now */}
        {/* <CommentSheet 
          postId={postId}
          postTitle={"content" in post.metadata && typeof post.metadata.content === "string" 
            ? post.metadata.content.substring(0, 50) + "..." 
            : "Post"}
        /> */}
        
        <FeedFloatingActions onRefresh={() => {}} refreshing={false} />
      </div>
    </TooltipProvider>
  );
}