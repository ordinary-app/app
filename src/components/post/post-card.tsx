import React from "react";
import { Card, Avatar, Text, Group, Stack, Box, Image, ActionIcon, Tooltip } from '@mantine/core';
import { TokenIdDisplay } from "@/components/token-id-display";
import { Post } from "@lens-protocol/client";
import { PostActionsBar } from "./post-actions-bar";
import { resolveUrl } from "@/utils/resolve-url";
import { formatTimestamp, checkIfOriginal, extractAttachments, getLicenseType } from "@/utils/post-helpers";
import { useRouter } from "next/navigation";

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
  
  return (
    <Card 
      shadow="sm" 
      pt="lg" 
      pb="xs" 
      pl="lg" 
      pr="lg" 
      radius="md" 
      withBorder
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
          className="hover:shadow-lg hover:ring-2 hover:ring-gray-400/50 transition-all duration-200"
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
              c="dark.9" 
              truncate 
              style={{ cursor: 'pointer' }}
              className="hover:underline transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/u/${handle}`);
              }}
            >
              {displayName}
            </Text>
            <Text 
              size="xs" 
              c="dimmed" 
              truncate 
              style={{ cursor: 'pointer' }}
              className="hover:underline transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/u/${handle}`);
              }}
            >
              @{handle}
            </Text>
          </Group>
          
          {/* Timestamp */}
          <Text size="xs" c="dimmed">
            {timestamp}  
            <TokenIdDisplay uri={post.contentUri} isOriginal={isOriginal} licenseType={licenseType} />
          </Text>

        </Stack>
      </Group>

      {/* Post Title */}
      {title !== "No title available" && (
        <Text size="lg" fw={600} c="dark.9" mb="sm" lineClamp={2}>
          {title}
        </Text>
      )}

      {/* Post Content */}
      <Box mb="md">
        <Text size="sm" c="dark.7" lineClamp={5}>
          {content}
        </Text>
      </Box>
      
      {/* Media attachments */}
      {attachments.length > 0 && (
        <Box mb="md" style={{ display: 'flex', alignItems: 'center' }}>
          <Group gap="xs" justify="left" wrap="wrap">
            {attachments.map((attachment, index) => (
              <Image
                key={index}
                src={attachment.item}
                alt={`Attachment ${index + 1}`}
                radius="md"
                w={{ base: '80px', sm: '170px', md: '170px' }}
                h={{ base: '80px', sm: '170px', md: '170px' }}
                style={{ 
                  objectFit: 'cover',
                  flexShrink: 0,
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
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