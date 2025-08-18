import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TokenIdDisplay } from "@/components/token-id-display";
import { Post } from "@lens-protocol/client";
import { PostActionsBar } from "./post-actions-bar";
import { resolveUrl } from "@/utils/resolve-url";
import { formatTimestamp, checkIfOriginal, extractAttachments } from "@/utils/post-helpers";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // Extract data from original Post structure
  const displayName = post.author.metadata?.name || post.author.username?.localName || "Unknown User";
  const handle = post.author.username?.localName || "unknown";
  const avatar = post.author.metadata?.picture ? resolveUrl(post.author.metadata.picture) : "/gull.jpg";
  const content ="content" in post.metadata && typeof post.metadata.content === "string"
    ? post.metadata.content
    : "No content available";
  const timestamp = formatTimestamp(post.timestamp);
  const isOriginal = checkIfOriginal(post.metadata);
  const attachments = extractAttachments(post.metadata);
  
  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
      {/* Header - Author info */}
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-sm font-medium">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            {/* Author name and handle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base dark:text-gray-100">
                {displayName}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  @{handle}
                </p>
                <TokenIdDisplay uri={post.contentUri} isOriginal={isOriginal} />
              </div>
            </div>
            
            {/* Timestamp */}
            <p className="text-xs text-gray-400 mt-1">
              {timestamp}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-0 pb-2 space-y-4">
        {/* Post text content */}
        <div className="text-gray-800 leading-relaxed text-sm sm:text-base break-words dark:text-gray-200">
          {content}
        </div>
        
        {/* Media attachments */}
        {attachments.length > 0 && (
          <div className={`gap-2 ${
            attachments.length === 1 
              ? "flex justify-center" 
              : attachments.length === 2 
                ? "grid grid-cols-2" 
                : "grid grid-cols-2 sm:grid-cols-3"
          }`}>
            {attachments.map((attachment, index) => (
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
        <PostActionsBar post={post} />
      </CardContent>
    </Card>
  );
}