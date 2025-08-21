"use client"
import { Stack, Text, Group, Card, Badge, Skeleton, useMantineColorScheme, useMantineTheme } from "@mantine/core"
import { Hash, User, FileText, Key } from "lucide-react"

interface SearchResultsProps {
  searchValue: string
  selectedType: "tag" | "people" | "content" | "token"
  isLoading?: boolean
}

const searchTypeConfig = {
  tag: { icon: Hash, label: "Tag", color: "blue" },
  people: { icon: User, label: "People", color: "green" },
  content: { icon: FileText, label: "Content", color: "orange" },
  token: { icon: Key, label: "Token ID", color: "red" },
}

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

export function SearchResults({ searchValue, selectedType, isLoading = true }: SearchResultsProps) {
  if (!searchValue.trim()) {
    return null
  }

  const renderSkeleton = () => {
    switch (selectedType) {
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
        <Text size="sm" c="dimmed" ta="center" py="xl">
          暂无搜索结果
        </Text>
      )}
    </Stack>
  )
}
