"use client"
import { Stack, Text, Group, Card, Badge, Skeleton, useMantineColorScheme, useMantineTheme, Button, Avatar, Flex } from "@mantine/core"
import { Hash, User, FileText, Key, Heart, MessageCircle, Share2, Calendar } from "lucide-react"
import type { SearchResult } from "@/hooks/use-search"

interface SearchResultsProps {
  searchValue: string
  selectedType: "tag" | "people" | "content" | "token"
  isLoading?: boolean
  results?: SearchResult[]
  hasMore?: boolean
  onLoadMore?: () => void
  error?: string | null
}

const searchTypeConfig = {
  tag: { icon: Hash, label: "Tag", color: "blue" },
  people: { icon: User, label: "People", color: "green" },
  content: { icon: FileText, label: "Content", color: "orange" },
  token: { icon: Key, label: "Token ID", color: "red" },
} as const

type SearchTypeKey = keyof typeof searchTypeConfig

// People skeleton with avatar
const PeopleSkeleton = () => {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  return (
    <Stack gap="sm">
      {[...Array(5)].map((_, index) => (
        <Card key={index} padding="md" radius="md" withBorder>
          <Group>
            <Skeleton height={40} circle />
            <Stack gap={4} style={{ flex: 1 }}>
              <Skeleton height={16} width="60%" />
              <Skeleton height={12} width="40%" />
            </Stack>
            <Skeleton height={32} width={60} />
          </Group>
        </Card>
      ))}
    </Stack>
  )
}

// Content/Token ID skeleton - normal post cards
const PostCardSkeleton = () => (
  <Stack gap="sm">
    {[...Array(4)].map((_, index) => (
      <Card key={index} padding="md" radius="md" withBorder>
        <Stack gap="sm">
          <Group>
            <Skeleton height={32} circle />
            <Stack gap={2} style={{ flex: 1 }}>
              <Skeleton height={14} width="30%" />
              <Skeleton height={12} width="20%" />
            </Stack>
          </Group>
          <Skeleton height={16} width="80%" />
          <Skeleton height={14} width="60%" />
          <Skeleton height={14} width="90%" />
          <Group mt="xs">
            <Skeleton height={24} width={60} />
            <Skeleton height={24} width={60} />
            <Skeleton height={24} width={60} />
          </Group>
        </Stack>
      </Card>
    ))}
  </Stack>
)

// Tag skeleton with # tags arranged
const TagSkeleton = () => {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  return (
    <Stack gap="md">
      <Stack gap="xs">
        {[...Array(12)].map((_, index) => (
          <Group key={index} gap="xs">
            <Hash size={16} color={colorScheme === "dark" ? theme.colors.blue[4] : theme.colors.blue[6]} />
            <Skeleton height={14} width={Math.random() * 80 + 60} />
          </Group>
        ))}
      </Stack>
    </Stack>
  )
}

export function SearchResults({ 
  searchValue, 
  selectedType, 
  isLoading = true, 
  results = [], 
  hasMore = false, 
  onLoadMore, 
  error 
}: SearchResultsProps) {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  if (!searchValue.trim() && results.length === 0) {
    return null
  }

  // 渲染搜索结果
  const renderSearchResults = () => {
    if (error) {
      return (
        <Card padding="md" radius="md" withBorder>
          <Stack align="center" gap="sm">
            <Text c="red" size="sm">搜索出错: {error}</Text>
            <Button variant="light" size="sm" onClick={() => window.location.reload()}>
              重试
            </Button>
          </Stack>
        </Card>
      )
    }

    if (results.length === 0 && !isLoading) {
      return (
        <Card padding="md" radius="md" withBorder>
          <Stack align="center" gap="sm">
            <Text c="dimmed" size="sm">未找到相关结果</Text>
          </Stack>
        </Card>
      )
    }

    return (
      <Stack gap="md">
        {results.map((result) => (
          <Card key={result.id} padding="md" radius="md" withBorder>
            <Stack gap="sm">
              {/* 作者信息 */}
              <Group>
                <Avatar 
                  src={result.authorAvatar} 
                  size="sm" 
                  radius="xl"
                  color={theme.colors.blue[6]}
                >
                  {result.author?.charAt(0) || 'U'}
                </Avatar>
                <Stack gap={2} style={{ flex: 1 }}>
                  <Text size="sm" fw={500} c={colorScheme === "dark" ? "white" : "black"}>
                    {result.author}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {result.timestamp?.toLocaleDateString()}
                  </Text>
                </Stack>
              </Group>

              {/* 内容 */}
              {result.title && (
                <Text size="lg" fw={600} c={colorScheme === "dark" ? "white" : "black"}>
                  {result.title}
                </Text>
              )}
              
              {result.content && (
                <Text size="sm" lineClamp={3}>
                  {result.content}
                </Text>
              )}

              {/* 标签 */}
              {result.tags && result.tags.length > 0 && (
                <Flex wrap="wrap" gap="xs">
                  {result.tags.slice(0, 5).map((tag, index) => (
                    <Badge key={index} variant="light" size="sm" color="blue">
                      #{tag}
                    </Badge>
                  ))}
                  {result.tags.length > 5 && (
                    <Badge variant="light" size="sm" color="gray">
                      +{result.tags.length - 5} 更多
                    </Badge>
                  )}
                </Flex>
              )}

              {/* 统计信息 */}
              <Group gap="xs">
                <Group gap={4}>
                  <Heart size={14} />
                  <Text size="xs">{result.stats?.likes || 0}</Text>
                </Group>
                <Group gap={4}>
                  <MessageCircle size={14} />
                  <Text size="xs">{result.stats?.comments || 0}</Text>
                </Group>
                <Group gap={4}>
                  <Share2 size={14} />
                  <Text size="xs">{result.stats?.shares || 0}</Text>
                </Group>
              </Group>
            </Stack>
          </Card>
        ))}

        {/* 加载更多按钮 */}
        {hasMore && results.length > 0 && (
          <Card padding="md" radius="md" withBorder>
            <Stack align="center" gap="sm">
              <Button 
                variant="light" 
                size="sm" 
                onClick={onLoadMore}
                loading={isLoading}
              >
                加载更多结果
              </Button>
            </Stack>
          </Card>
        )}
      </Stack>
    )
  }

  const renderSkeleton = () => {
    switch (selectedType as SearchTypeKey) {
      case "people":
        return <PeopleSkeleton />
      case "content":
      case "token":
        return <PostCardSkeleton />
      case "tag":
        return <TagSkeleton />
      default:
        return <PostCardSkeleton />
    }
  }

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500} c="dimmed">
          搜索结果 "{searchValue}"
        </Text>
        <Badge variant="light" color={searchTypeConfig[selectedType].color} size="sm">
          {searchTypeConfig[selectedType].label}
        </Badge>
      </Group>

      {isLoading ? (
        renderSkeleton()
      ) : (
        renderSearchResults()
      )}
    </Stack>
  )
}
