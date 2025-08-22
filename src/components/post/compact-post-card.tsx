import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "@lens-protocol/client";
import { resolveUrl } from "@/utils/resolve-url";
import { formatTimestamp, checkIfOriginal, extractAttachments, getLicenseType } from "@/utils/post-helpers";
import { PostActionsBar } from "./post-actions-bar";
import { TokenIdDisplay } from "@/components/token-id-display";
import { useRouter } from "next/navigation";

interface CompactPostCardProps {
  post: Post;
  disableNavigation?: boolean;
}

export function CompactPostCard({ post, disableNavigation = false }: CompactPostCardProps) {
  const router = useRouter();
  
  // Extract data from original Post structure
  const displayName = post.author.metadata?.name || post.author.username?.localName || "Unknown User";
  const handle = post.author.username?.localName || "unknown";
  const avatar = post.author.metadata?.picture ? resolveUrl(post.author.metadata.picture) : "/gull.jpg";
  const title = "title" in post.metadata && typeof post.metadata.title === "string" && post.metadata.title.trim() !== ""
    ? post.metadata.title 
    : "No title available";
  const content = "content" in post.metadata && typeof post.metadata.content === "string" && post.metadata.content.trim() !== ""
    ? post.metadata.content
    : "No content available";
  const attachments = extractAttachments(post.metadata);
  const isOriginal = checkIfOriginal(post.metadata);
  const licenseType = getLicenseType(post.metadata);
  
  
  // Get the primary image for display
  const primaryImage = attachments.length > 0 ? attachments[0].item : null;
  
  return (
    <Card 
      className="overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
      style={{
        cursor: !disableNavigation ? 'pointer' : 'default'
      }}
      onClick={() => !disableNavigation && router.push(`/p/${post.id}`)}
    >
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
          </div>
        ) : (
          // Text-only post
          <div className="p-4 min-h-[120px] flex items-center">
            {/* Post Content */}
            <p className="text-gray-800 text-sm leading-relaxed line-clamp-4 dark:text-gray-200">
              {content}
            </p>
          </div>
        )}
        
        {/* Title section */}
        {title !== "No title available" && (
          <div className="pl-3 pr-3 pt-2">
            <p className="text-gray-800 text-sm font-semibold line-clamp-2 leading-relaxed dark:text-gray-200">
              {title}
            </p>
          </div>
        )}
        
        {/* Bottom section with user info and actions */}
        <div className="p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Avatar 
                className="w-6 h-6 flex-shrink-0 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-gray-400/50 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/u/${handle}`);
                }}
              >
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-xs">
                  {displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span 
                className="text-xs font-medium text-gray-700 truncate dark:text-gray-300 cursor-pointer hover:underline transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/u/${handle}`);
                }}
              >
                {displayName}
              </span>
            </div>
            
            {/* Actions bar - only heart */}
            <PostActionsBar post={post} />
          </div>
          <TokenIdDisplay uri={post.contentUri} isOriginal={isOriginal} licenseType={licenseType} />
        </div>
      </CardContent>
    </Card>
  );
}