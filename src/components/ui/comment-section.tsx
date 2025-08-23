import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Heart, Reply, MoreHorizontal } from "lucide-react";
import { resolveUrl } from "@/utils/resolve-url";
import { formatTimestamp } from "@/utils/post-helpers";

interface Comment {
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

interface CommentSectionProps {
  postId: string;
  comments?: Comment[];
  onAddComment?: (content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyToComment?: (commentId: string, content: string) => void;
  className?: string;
}

export function CommentSection({
  postId,
  comments = [],
  onAddComment,
  onLikeComment,
  onReplyToComment,
  className = ""
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleSubmitComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim() && onReplyToComment) {
      onReplyToComment(commentId, replyContent.trim());
      setReplyContent("");
      setReplyTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Input */}
        <div className="space-y-3">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[80px] resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
                     {comments.length === 0 ? (
             <div className="text-center py-8 text-gray-500 dark:text-gray-400">
               <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
               <p>No comments yet. Be the first to comment!</p>
             </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={() => onLikeComment?.(comment.id)}
                onReply={() => setReplyTo(comment.id)}
                showReplyInput={replyTo === comment.id}
                replyContent={replyContent}
                onReplyContentChange={setReplyContent}
                onSubmitReply={() => handleSubmitReply(comment.id)}
                onCancelReply={() => {
                  setReplyTo(null);
                  setReplyContent("");
                }}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface CommentItemProps {
  comment: Comment;
  onLike: () => void;
  onReply: () => void;
  showReplyInput: boolean;
  replyContent: string;
  onReplyContentChange: (content: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}

function CommentItem({
  comment,
  onLike,
  onReply,
  showReplyInput,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  onCancelReply
}: CommentItemProps) {
  const displayName = comment.author.metadata?.name || 
                     comment.author.username?.localName || 
                     "Anonymous";
  const avatar = comment.author.metadata?.picture ? 
                 resolveUrl(comment.author.metadata.picture) : 
                 "/gull.jpg";

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-xs">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {displayName}
              </span>
              <Badge variant="outline" className="text-xs">
                {formatTimestamp(comment.timestamp)}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <button
                onClick={onLike}
                className="flex items-center gap-1 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <Heart className="w-3 h-3" />
                {comment.likes}
              </button>
              <button
                onClick={onReply}
                className="flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
              <button className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <MoreHorizontal className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="ml-11 space-y-3">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
            className="min-h-[60px] resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={onSubmitReply}
              disabled={!replyContent.trim()}
            >
              Reply
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onCancelReply}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={() => {}} // Handle reply like
              onReply={() => {}} // Handle reply to reply
              showReplyInput={false}
              replyContent=""
              onReplyContentChange={() => {}}
              onSubmitReply={() => {}}
              onCancelReply={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
