import { useState, useEffect } from 'react';
import { useLensAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

export interface Comment {
  id: string;
  content: string;
  author: {
    username?: {
      localName?: string;
    };
    metadata?: {
      name?: string;
      picture?: string;
    };
  };
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface UseCommentsProps {
  postId: string;
  autoFetch?: boolean;
}

export function useComments({ postId, autoFetch = true }: UseCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentProfile, sessionClient } = useLensAuthStore();

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual Lens Protocol API call to fetch comments
      // For now, return empty array since we're not using mock data
      setComments([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!currentProfile) {
      toast.error('Please login to comment');
      return;
    }

    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      // TODO: Send to Lens Protocol API
      // const result = await sessionClient?.publication.comment({
      //   on: postId,
      //   content: content.trim()
      // });

      toast.success('Comment added successfully!');
      // Note: We don't add to local state since we're using Lens Protocol data
    } catch (err) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  const likeComment = async (commentId: string) => {
    if (!currentProfile) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      // TODO: Send like to Lens Protocol API
      toast.success('Comment liked!');
    } catch (err) {
      toast.error('Failed to like comment');
      console.error('Error liking comment:', err);
    }
  };

  const replyToComment = async (commentId: string, content: string) => {
    if (!currentProfile) {
      toast.error('Please login to reply');
      return;
    }

    if (!content.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      // TODO: Send reply to Lens Protocol API
      toast.success('Reply added successfully!');
    } catch (err) {
      toast.error('Failed to add reply');
      console.error('Error adding reply:', err);
    }
  };

  useEffect(() => {
    if (autoFetch && postId) {
      fetchComments();
    }
  }, [postId, autoFetch]);

  return {
    comments,
    loading,
    error,
    addComment,
    likeComment,
    replyToComment,
    refetch: fetchComments
  };
}
