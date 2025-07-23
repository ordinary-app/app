import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Post } from "@lens-protocol/client";
import { resolveUrl } from "@/utils/resolve-url";
import { formatTimestamp, checkIfOriginal, extractAttachments } from "@/utils/post-helpers";
import { Button } from "@/components/ui/button";

interface CompactPostCardProps {
  post: Post;
}

export function CompactPostCard({ post }: CompactPostCardProps) {
  // Extract data from original Post structure
  const displayName = post.author.metadata?.name || post.author.username?.localName || "Unknown User";
  const handle = post.author.username?.localName || "unknown";
  const avatar = post.author.metadata?.picture ? resolveUrl(post.author.metadata.picture) : "/gull.jpg";
  const content = "content" in post.metadata && typeof post.metadata.content === "string"
    ? post.metadata.content
    : "No content available";
  const attachments = extractAttachments(post.metadata);
  
  // Get the primary image for display
  const primaryImage = attachments.length > 0 ? attachments[0].item : null;
  
  return (
    <Card className="overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-0">
        {/* Main image/content area */}
        {primaryImage ? (
          <div className="relative aspect-auto">
            <img
              src={primaryImage}
              alt="Post content"
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
            />
            {/* Overlay gradient for text readability if needed */}
            {content && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent p-3">
                <p className="text-white text-sm line-clamp-2 leading-relaxed">
                  {content}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Text-only post
          <div className="p-4 min-h-[120px] flex items-center">
            <p className="text-gray-800 text-sm leading-relaxed line-clamp-4">
              {content}
            </p>
          </div>
        )}
        
        {/* Bottom section with user info and actions */}
        <div className="p-3 space-y-2">
          {/* User info */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 flex-shrink-0">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-xs">
                {displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-gray-700 truncate flex-1">
              {displayName}
            </span>
          </div>
          
          {/* Actions bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-gray-500 hover:text-red-500 hover:bg-red-50"
              >
                <Heart className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs">
                  {post.stats?.upvotes || 0}
                </span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs">
                  {post.stats?.comments || 0}
                </span>
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-gray-500 hover:text-gray-700"
            >
              <Share2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}