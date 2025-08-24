import React from "react";
import { Card, Avatar, Text, Group, Stack, Box, Image, ActionIcon, Tooltip } from '@mantine/core';
import { TokenIdDisplay } from "@/components/token-id-display";
import { Post } from "@lens-protocol/client";
import { PostActionsBar } from "./post-actions-bar";
import { resolveUrl } from "@/utils/resolve-url";
import { formatTimestamp, checkIfOriginal, extractAttachments, getLicenseType } from "@/utils/post-helpers";
import { useRouter } from "next/navigation";
import { TagDisplay } from "@/components/ui/tag-display";

interface PostCardProps {
  post: Post;
  disableNavigation?: boolean;
}

export function PostCard({ post, disableNavigation = false }: PostCardProps) {
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
  const timestamp = formatTimestamp(post.timestamp);
  const isOriginal = checkIfOriginal(post.metadata);
  const licenseType = getLicenseType(post.metadata);
  const attachments = extractAttachments(post.metadata);
  
  // Extract tags from metadata
  const tags = "tags" in post.metadata && Array.isArray(post.metadata.tags) 
    ? post.metadata.tags 
    : [];
  
  return (
    <Card 
      shadow="sm" 
      pt="lg" 
      pb="xs" 
      pl="lg" 
      pr="lg" 
      radius="md" 
      withBorder
      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-800 transition-colors duration-200"
      style={{
        cursor: !disableNavigation ? 'pointer' : 'default'
      }}
      onClick={() => !disableNavigation && router.push(`/p/${post.id}`)}
    >
      {/* Header - Author info with dynamic sizing */}
      <Group gap="sm" align="flex-start" mb="md">
        {/* Avatar */}
        <Avatar 
          src={avatar} 
          size="md" 
          radius="xl"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/u/${handle}`);
          }}
          style={{ cursor: 'pointer' }}
          className="hover:shadow-lg hover:ring-2 hover:ring-gray-400/50 dark:hover:ring-gray-500/50 transition-all duration-200"
        >
          {displayName.charAt(0)}
        </Avatar>
        
        {/* Author info */}
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          {/* Author name and handle */}
          <Group 
            gap="xs" 
            w="nowrap"
            align="center" 
          >
            <Text 
              size="sm" 
              fw={600} 
              className="text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:underline transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/u/${handle}`);
              }}
            >
              {displayName}
            </Text>
            <Text 
              size="xs" 
              className="text-gray-500 dark:text-gray-400 truncate cursor-pointer hover:underline transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/u/${handle}`);
              }}
            >
              @{handle}
            </Text>
          </Group>
          
          {/* Timestamp */}
          <Text size="xs" className="text-gray-500 dark:text-gray-400">
            {timestamp}  
            <TokenIdDisplay uri={post.contentUri} isOriginal={isOriginal} licenseType={licenseType} />
          </Text>

        </Stack>
      </Group>

      {/* Post Title */}
      {title !== "No title available" && (
        <Text size="lg" fw={600} className="text-gray-900 dark:text-gray-100 mb-sm" lineClamp={2}>
          {title}
        </Text>
      )}

      {/* Post Content */}
      <Box mb="md">
        <Text size="sm" className="text-gray-700 dark:text-gray-300 line-clamp-5">
          {content}
        </Text>
      </Box>
      
      {/* Tags Section */}
      <Box mb="md">
        <TagDisplay tags={tags} />
      </Box>
      
      {/* Media attachments */}
      {attachments.length > 0 && (
        <Box mb="md" className="flex items-center">
          <Group gap="xs" justify="left" wrap="wrap">
            {attachments.map((attachment, index) => (
              <Image
                key={index}
                src={attachment.item}
                alt={`Attachment ${index + 1}`}
                radius="md"
                w={{ base: '80px', sm: '170px', md: '170px' }}
                h={{ base: '80px', sm: '170px', md: '170px' }}
                className="transition-transform duration-300 cursor-pointer hover:scale-105"
                style={{ 
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            ))}
          </Group>
        </Box>
      )}
      
      {/* Actions bar */}
        <PostActionsBar post={post} />
    </Card>
  );
}