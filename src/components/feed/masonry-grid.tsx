import React from "react";
import { Container, px, SimpleGrid, Skeleton, Stack, useMantineTheme, Box, Paper } from '@mantine/core';

const getChild = (height: number) => <Skeleton height={height} radius="md" animate={false} />;
const BASE_HEIGHT = 360;
const getSubHeight = (children: number, spacing: number) =>
  BASE_HEIGHT / children - spacing * ((children - 1) / children);

// 骨架屏组件
function PostSkeleton({ height, theme }: { height?: number; theme: any }) {
  const skeletonHeight = height || getSubHeight(Math.floor(Math.random() * 3) + 2, px(theme.spacing.md) as number);
  
  return (
    <Paper
      radius="md"
      shadow="sm"
      withBorder
      style={{ overflow: 'hidden' }}
    >
      <Skeleton height={skeletonHeight} />
      <Box p="sm">
        <Box style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.xs }}>
          <Skeleton height={24} circle />
          <Skeleton height={12} style={{ flex: 1 }} />
        </Box>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <Skeleton height={24} width={48} />
            <Skeleton height={24} width={48} />
          </Box>
          <Skeleton height={24} width={24} />
        </Box>
      </Box>
    </Paper>
  );
}

interface MasonryGridProps {
  children: React.ReactNode[];
  loading?: boolean;
  skeletonCount?: number;
  columns?: { base?: number; xs?: number; sm?: number; md?: number; lg?: number };
  spacing?: string | number;
  containerSize?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function MasonryGrid({ 
  children, 
  loading = false, 
  skeletonCount = 12,
  columns = { base: 2, xs: 2, sm: 3, md: 4, lg: 4 },
  spacing,
  containerSize = "xl"
}: MasonryGridProps) {
  const theme = useMantineTheme();
  const gridSpacing = spacing || theme.spacing.md;
  
  const maxColumns = Math.max(
    columns.base || 2,
    columns.xs || 2,
    columns.sm || 3,
    columns.md || 3,
    columns.lg || 4
  );

  return (
    <Container size={containerSize} px={0}>
      <SimpleGrid 
        cols={columns}
        spacing={gridSpacing}
      >
        {/* 创建列 */}
        {Array.from({ length: maxColumns }, (_, colIndex) => (
          <Stack key={`col-${colIndex}`} gap={gridSpacing}>
            {/* 将子元素分配到当前列 */}
            {children
              .filter((_, index) => index % maxColumns === colIndex)
              .map((child, index) => (
                <Box
                  key={`item-${colIndex}-${index}`}
                  style={{
                    animation: 'fadeIn 0.2s ease-in-out',
                    animationDelay: `${(colIndex + index * maxColumns) * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  {child}
                </Box>
              ))}
            
            {/* 加载更多时的骨架屏 - 只在前几列显示 */}
            {loading && children.length > 0 && colIndex < Math.min(maxColumns) && (
              <PostSkeleton theme={theme} />
            )}
            
            {/* 初始加载骨架屏 */}
            {loading && children.length === 0 && (
              <>
                {Array.from({ length: Math.ceil(skeletonCount / maxColumns) }, (_, i) => (
                  <PostSkeleton key={`skeleton-${colIndex}-${i}`} theme={theme} />
                ))}
              </>
            )}
          </Stack>
        ))}
      </SimpleGrid>
    </Container>
  );
}

// 导出辅助函数和组件供其他组件使用
export { getChild, getSubHeight, BASE_HEIGHT, PostSkeleton };
