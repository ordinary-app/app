import { useState, useEffect } from 'react';
import { useLensAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { postId, uri, PostReferenceType } from '@lens-protocol/client';
import { post, fetchPostReferences } from '@lens-protocol/client/actions';

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
  postOperations?: {
    canComment?: {
      __typename: 'PostOperationValidationPassed' | 'PostOperationValidationFailed' | 'PostOperationValidationUnknown';
      reason?: string;
      unsatisfiedRules?: any[];
      extraChecksRequired?: any[];
    };
  };
  // Comment filtering options
  referenceTypes?: PostReferenceType[];
  byAuthors?: string[];
}

export function useComments({ 
  postId: commentPostId, 
  autoFetch = true, 
  postOperations,
  referenceTypes = [PostReferenceType.CommentOn],
  byAuthors
}: UseCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageInfo, setPageInfo] = useState<{ next?: string } | null>(null);
  const { currentProfile, sessionClient, client } = useLensAuthStore();

  // Check if user can comment based on post rules
  const canUserComment = (): boolean => {
    if (!postOperations?.canComment) {
      return false;
    }

    switch (postOperations.canComment.__typename) {
      case 'PostOperationValidationPassed':
        return true;
      
      case 'PostOperationValidationFailed':
        console.log('Commenting not allowed:', postOperations.canComment.reason);
        if (postOperations.canComment.unsatisfiedRules) {
          console.log('Unsatisfied rules:', postOperations.canComment.unsatisfiedRules);
        }
        return false;
      
      case 'PostOperationValidationUnknown':
        console.log('Commenting validation unknown - extra checks required:', postOperations.canComment.extraChecksRequired);
        // Treat as failed unless specific rules are supported
        return false;
      
      default:
        return false;
    }
  };

  const fetchComments = async (cursor?: string, isLoadMore = false) => {
    if (!client) return;
    
    try {
      if (isLoadMore) {
        setLoading(true);
      } else {
        setLoading(true);
        setError(null);
      }
      
      const result = await fetchPostReferences(client, {
        referencedPost: postId(commentPostId),
        referenceTypes: referenceTypes,
        // Add author filtering if specified
        ...(byAuthors && byAuthors.length > 0 && { byAuthors }),
        // Add pagination
        ...(cursor && { cursor }),
      });

      if (result.isErr()) {
        throw new Error(result.error.message);
      }

      const { items, pageInfo: newPageInfo } = result.value;
      
      // Filter only comments and convert to our Comment interface
      const commentItems = items
        .filter(item => item.__typename === 'Post')
        .map(item => {
          const post = item as any; // Type assertion for Post
          return {
            id: post.id,
            content: post.metadata?.content || '',
            author: {
              username: post.by?.username,
              metadata: post.by?.metadata
            },
            timestamp: post.createdAt,
            likes: post.stats?.upvotes || 0,
            replies: [] // Comments don't have replies in this context
          } as Comment;
        });

      if (isLoadMore) {
        setComments(prev => [...prev, ...commentItems]);
      } else {
        setComments(commentItems);
      }

      setPageInfo({
        next: newPageInfo.next || undefined
      });
      setHasMore(!!newPageInfo.next);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = async () => {
    if (pageInfo?.next && !loading) {
      await fetchComments(pageInfo.next, true);
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

    // Check if user can comment based on post rules
    if (!canUserComment()) {
      toast.error('You are not allowed to comment on this post');
      return;
    }

    try {
      // Create comment using Lens Protocol API
      if (sessionClient) {
        const result = await post(sessionClient, {
          contentUri: uri(`lens://${Date.now()}`), // Generate a unique URI for the comment
          commentOn: {
            post: postId(commentPostId), // the post to comment on
          },
        });

        if (result.isErr()) {
          throw new Error(result.error.message);
        }

        // Create new comment object with a temporary ID for local state
        // The actual Lens post ID will be available after transaction confirmation
        const newComment: Comment = {
          id: `temp-${Date.now()}`, // Temporary ID for local state
          content: content.trim(),
          author: {
            username: currentProfile.username,
            metadata: currentProfile.metadata
          },
          timestamp: new Date().toISOString(),
          likes: 0
        };

        // Add to comments list
        setComments(prev => [newComment, ...prev]);
        toast.success('Comment added successfully!');
        
        // Refresh comments to get the real data
        setTimeout(() => {
          fetchComments();
        }, 1000);
      } else {
        throw new Error('Session client not available');
      }
    } catch (err) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };


  useEffect(() => {
    if (autoFetch && commentPostId) {
      fetchComments();
    }
  }, [commentPostId, autoFetch, referenceTypes, byAuthors]);

  return {
    comments,
    loading,
    error,
    hasMore,
    addComment,
    refetch: fetchComments,
    loadMore: loadMoreComments,
    canComment: canUserComment()
  };
}
