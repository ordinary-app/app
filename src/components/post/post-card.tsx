import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TokenIdDisplay } from "@/components/token-id-display";
import { EnhancedPost } from "@/hooks/use-feed";
import { PostActionsBar } from "./post-actions-bar";

interface PostCardProps {
  post: EnhancedPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
      {/* Header - Author info */}
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <AvatarImage src={post.author.avatar || "/gull.jpg"} />
            <AvatarFallback className="text-sm font-medium">
              {post.author.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            {/* Author name and handle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                {post.author.displayName}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  @{post.author.handle}
                </p>
                <TokenIdDisplay uri={post.contentUri} isOriginal={post.isOriginal} />
              </div>
            </div>
            
            {/* Timestamp */}
            <p className="text-xs text-gray-400 mt-1">
              {post.timestamp}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-0 pb-2 space-y-4">
        {/* Post text content */}
        <div className="text-gray-800 leading-relaxed text-sm sm:text-base break-words">
          {post.content}
        </div>
        
        {/* Media attachments */}
        {post.attachments.length > 0 && (
          <div className={`gap-2 ${
            post.attachments.length === 1 
              ? "flex justify-center" 
              : post.attachments.length === 2 
                ? "grid grid-cols-2" 
                : "grid grid-cols-2 sm:grid-cols-3"
          }`}>
            {post.attachments.map((attachment, index) => (
              <div 
                key={index} 
                className="border rounded-lg overflow-hidden bg-gray-50 aspect-square sm:aspect-auto sm:max-h-[400px]"
              >
                <img 
                  loading="lazy" 
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  src={attachment.item} 
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Actions bar */}
        <PostActionsBar post={post as any} />
      </CardContent>
    </Card>
  );
}