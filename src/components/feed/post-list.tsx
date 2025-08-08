import React from "react";
import { Masonry } from '@mui/lab';
import { Box, Paper } from '@mui/material';
import { Post } from "@lens-protocol/client";
import { PostCard } from "@/components/post/post-card";
import { CompactPostCard } from "@/components/post/compact-post-card";
import { useFeedContext } from "@/contexts/feed-context";
import { FeedViewToggle } from "@/components/feed/feed-view-toggle";

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  emptyText?: string;
  showToggle?: boolean;
  skeletonCount?: number;
}

export function PostList({ posts, loading, emptyText, showToggle = true, skeletonCount = 6 }: PostListProps) 
{
  const { viewMode } = useFeedContext();
  const safeItems = posts && Array.isArray(posts) ? posts.filter((item) => item != null) : [];
  
  if (loading) {
    return (
      <div className="w-full">
        {showToggle && (
          <div className="flex justify-center items-center mb-6">
            <FeedViewToggle />
          </div>
        )}
        <div className="text-center py-8">loading...</div>
      </div>
    );
  }
  
  if (!posts.length) {
    return (
      <div className="w-full">
        <div className="text-center py-8 text-gray-400">{emptyText || "暂无内容"}</div>
      </div>
    );
  }
  if (viewMode === "masonry") {
    // 瀑布流布局
    return (
      <div className="w-full">
        {showToggle && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, px: 0 }}>
            <FeedViewToggle />
          </Box>
        )}
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: 'max-w-7xl',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Masonry
            columns={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }} // 响应式列数布局
            spacing={1.5} // 间距
            defaultColumns={4} // 默认列数
            defaultSpacing={1.5} // 默认间距
            sequential={false}
            sx={{
              width: 'fit-content',
              margin: '0 auto'
            }}
          >
            {/* 帖子内容 */}
            {safeItems.map((post, index) => (
              <Box
                key={post?.id || `item-${index}`}
                sx={{
                  animation: 'fadeIn 0.2s ease-in-out',
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both',
                  '@keyframes fadeIn': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(20px)'
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                <CompactPostCard post={post} />
              </Box>
            ))}
            
            {/* 初始加载骨架屏 */}
            {loading &&
              safeItems.length === 0 &&
              Array.from({ length: skeletonCount }, (_, i) => (
                <Paper
                  key={`skeleton-${i}`}
                  sx={{
                    borderRadius: 3,
                    //overflow: 'hidden',
                    boxShadow: 1,
                    '&:hover': { boxShadow: 2 },
                    animation: 'pulse 0.1s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.7 }
                    }
                  }}
                >
                  <Box
                    sx={{
                      aspectRatio: Math.random() > 0.5 ? '4/3' : '3/4', // 随机高度骨架模拟
                      bgcolor: 'grey.200'
                    }}
                  />
                  <Box sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 24, height: 24, bgcolor: 'grey.200', borderRadius: '50%' }} />
                      <Box sx={{ height: 12, bgcolor: 'grey.200', borderRadius: 1, flex: 1 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ height: 24, width: 48, bgcolor: 'grey.200', borderRadius: 1 }} />
                        <Box sx={{ height: 24, width: 48, bgcolor: 'grey.200', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ height: 24, width: 24, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </Box>
                </Paper>
              ))}

            {/* 加载更多时的骨架屏 */}
            {loading &&
              safeItems.length > 0 &&
              Array.from({ length: Math.min(4, skeletonCount) }, (_, i) => (
                <Paper
                  key={`loading-skeleton-${i}`}
                  sx={{
                    borderRadius: 3,
                    //overflow: 'hidden',
                    boxShadow: 1,
                    animation: 'pulse 0.1s ease-in-out infinite'
                  }}
                >
                  <Box
                    sx={{
                      aspectRatio: '4/3',
                      bgcolor: 'grey.200'
                    }}
                  />
                  <Box sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 24, height: 24, bgcolor: 'grey.200', borderRadius: '50%' }} />
                      <Box sx={{ height: 12, bgcolor: 'grey.200', borderRadius: 1, flex: 1 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ height: 24, width: 48, bgcolor: 'grey.200', borderRadius: 1 }} />
                        <Box sx={{ height: 24, width: 48, bgcolor: 'grey.200', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ height: 24, width: 24, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </Box>
                </Paper>
              ))}
          </Masonry>
        </Box>
      </div>
    );
  }
  // 列表布局
  return (
    <div className="w-full">
      {showToggle && (
        <div className="flex justify-center items-center mb-6">
          <FeedViewToggle />
        </div>
      )}
      <div className="flex flex-col gap-4 items-center">
        {safeItems.map((post, index) => (
          <div
            key={post?.id || `item-${index}`}
            className="w-full"
            style={{ 
              contain: "layout style",
              animationDelay: `${index * 0.1}s`
            }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>
      
      {loading && safeItems.length > 0 && (
        <div className="mt-6">
          {Array.from({ length: Math.min(3, skeletonCount) }).map((_, i) => (
            <div key={`skeleton-${i}`} className="animate-pulse mb-4">
              <div className="bg-gray-200 rounded-lg p-4 h-40">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
