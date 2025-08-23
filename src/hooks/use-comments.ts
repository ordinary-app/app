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

  // Mock comments data for demonstration
  const mockComments: Comment[] = [
    {
      id: '1',
      content: 'This is a great post! Really enjoyed reading it.',
      author: {
        username: { localName: 'alice' },
        metadata: { name: 'Alice Johnson', picture: '/gull.jpg' }
      },
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      likes: 5,
      replies: [
        {
          id: '1-1',
          content: 'I agree! The content is very insightful.',
          author: {
            username: { localName: 'bob' },
            metadata: { name: 'Bob Smith', picture: '/gull.jpg' }
          },
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
          likes: 2
        }
      ]
    },
    {
      id: '2',
      content: 'Thanks for sharing this information. Very helpful!',
      author: {
        username: { localName: 'charlie' },
        metadata: { name: 'Charlie Brown', picture: '/gull.jpg' }
      },
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      likes: 3
    }
  ];

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual Lens Protocol API call to fetch comments
      // For now, use mock data for demonstration
      setComments(mockComments);
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
      // Create new comment object for demonstration
      const newComment: Comment = {
        id: Date.now().toString(),
        content: content.trim(),
        author: {
          username: currentProfile.username,
          metadata: currentProfile.metadata
        },
        timestamp: new Date().toISOString(),
        likes: 0
      };

      // Add to comments list for demonstration
      setComments(prev => [newComment, ...prev]);

      // TODO: Send to Lens Protocol API
      // const result = await sessionClient?.publication.comment({
      //   on: postId,
      //   content: content.trim()
      // });

      toast.success('Comment added successfully!');
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
      // Update local state for demonstration
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
          }
          return comment;
        })
      );

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
      const newReply: Comment = {
        id: `${commentId}-${Date.now()}`,
        content: content.trim(),
        author: {
          username: currentProfile.username,
          metadata: currentProfile.metadata
        },
        timestamp: new Date().toISOString(),
        likes: 0
      };

      // Update local state for demonstration
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          return comment;
        })
      );

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
