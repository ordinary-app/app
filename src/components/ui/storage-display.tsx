import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScanLine, ExternalLink } from "lucide-react";
import { TokenIdDisplay } from "@/components/token-id-display";
import { resolveUrl } from "@/utils/resolve-url";
import { getLicenseType } from "@/utils/post-helpers";

interface StorageDisplayProps {
  post: any;
  title?: string;
  description?: string;
  className?: string;
}

export function StorageDisplay({ 
  post, 
  title = "Grove Hash",
  description = "Here is the detail of this post data on Grove Layer",
  className = ""
}: StorageDisplayProps) {
  if (!post) {
    return null;
  }

  const posttitle = "title" in post.metadata && typeof post.metadata.title === "string" 
    ? post.metadata.title 
    : "No title available";
  const timestamp = new Date(post.timestamp).toLocaleDateString();
  
  // Check if post has token-bound-nft license
  const metadata = post.metadata;
  const licenseType = getLicenseType(metadata);
  const isTokenBoundNFT = licenseType === "token-bound-nft";

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ScanLine className="w-5 h-5 text-orange-600" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-gradient-to-r from-orange-50 to-white-50 dark:from-orange-950/20 dark:to-gray-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-start justify-between mb-2">
            <p className="text-gray-800 dark:text-gray-200 flex-1 font-bold">{posttitle}</p>
            {isTokenBoundNFT && (
              <TokenIdDisplay uri={post.contentUri} isOriginal={true} licenseType="token-bound-nft" />
            )}
          </div>
          <div className="flex items-start justify-between text-sm">
            <span className="text-orange-600 dark:text-orange-400 break-all flex-1 mr-2">
              {post.contentUri || 'len://...'}
              { post.contentUri ? (
                <ExternalLink
                  className="cursor-pointer inline-block ml-2 w-4 h-4 hover:text-orange-700 dark:hover:text-orange-300" 
                  onClick={() => {
                    const url = resolveUrl(post.contentUri);
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }} 
                />
              ) : null }
            </span>
            <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{timestamp}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
