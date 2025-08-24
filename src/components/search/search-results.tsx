"use client"

/**
 * Search Results Component
 * 
 * This component displays search results based on the selected search type.
 * It supports tag, people, content, and token search with internationalization.
 * 
 * Features:
 * - Tag search with clickable results that navigate to feed page
 * - Internationalized text using next-intl
 * - Loading skeletons for different search types
 * - Responsive design with Mantine UI components
 * 
 * Modified Features (Tag Search Implementation):
 * - Added mock tag data for demonstration
 * - Implemented TagSearchResults component with filtering
 * - Added click navigation to feed page with tag parameter
 * - Integrated internationalization for all text content
 */
import { Stack, Text, Group, Card, Badge, Skeleton, useMantineColorScheme, useMantineTheme } from "@mantine/core"
import { Hash, User, FileText, Key, TrendingUp, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

/**
 * Props interface for SearchResults component
 */
interface SearchResultsProps {
  searchValue: string
  selectedType: "tag" | "people" | "content" | "token"
  isLoading?: boolean
}

/**
 * Mock tag data for demonstration purposes
 * 
 * This data simulates real tag information with:
 * - id: Unique identifier for each tag
 * - name: Tag name (in Chinese for demo)
 * - count: Number of posts using this tag
 * - trending: Whether the tag is currently trending
 * 
 * In a real application, this would come from an API or database
 */
const mockTags = [
  { id: "1", name: "刺客信条", count: 156, trending: true },
  { id: "2", name: "游戏", count: 89, trending: false },
  { id: "3", name: "育碧", count: 67, trending: true },
  { id: "4", name: "开放世界", count: 234, trending: false },
  { id: "5", name: "动作冒险", count: 123, trending: false },
  { id: "6", name: "历史", count: 45, trending: false },
  { id: "7", name: "中世纪", count: 78, trending: false },
  { id: "8", name: "刺客", count: 92, trending: true },
  { id: "9", name: "信条", count: 34, trending: false },
  { id: "10", name: "AC", count: 201, trending: true },
  { id: "11", name: "Unity", count: 56, trending: false },
  { id: "12", name: "Syndicate", count: 43, trending: false },
  { id: "13", name: "Origins", count: 89, trending: true },
  { id: "14", name: "Odyssey", count: 76, trending: false },
  { id: "15", name: "Valhalla", count: 134, trending: true },
]

/**
 * Configuration object for different search types
 * 
 * Defines the icon and color for each search type badge
 */
const searchTypeConfig = {
  tag: { icon: Hash, color: "blue" },
  people: { icon: User, color: "green" },
  content: { icon: FileText, color: "orange" },
  token: { icon: Key, color: "red" },
}

// People skeleton with avatar
const PeopleSkeleton = () => {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  
  // Reusable card styles for skeletons
  const skeletonCardClassName = "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-800"

  return (
    <Stack gap="sm">
      {[...Array(5)].map((_, index) => (
        <Card 
          key={index} 
          padding="md" 
          radius="md" 
          withBorder
          className={skeletonCardClassName}
        >
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
const PostCardSkeleton = () => {
  // Reusable card styles for skeletons
  const skeletonCardClassName = "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-800"
  
  return (
    <Stack gap="sm">
      {[...Array(4)].map((_, index) => (
        <Card 
          key={index} 
          padding="md" 
          radius="md" 
          withBorder
          className={skeletonCardClassName}
        >
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
}

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

/**
 * Tag Search Results Component
 * 
 * This component displays filtered tag results based on the search value.
 * It includes clickable tag cards that navigate to the feed page with tag filtering.
 * 
 * Key Features:
 * - Filters mock tag data based on search input
 * - Displays tag information with post count and trending status
 * - Provides click navigation to feed page with tag parameter
 * - Uses internationalized text for all user-facing content
 * 
 * @param searchValue - The search term to filter tags by
 */
const TagSearchResults = ({ searchValue }: { searchValue: string }) => {
  // Reusable card styles that match the project's design system
  const cardClassName = "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-800 transition-colors duration-200 hover:shadow-md"
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const t = useTranslations("search")
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const [hoveredTagId, setHoveredTagId] = useState<string | null>(null)

  // Filter tag data based on search value (case-insensitive)
  // This simulates real-time search filtering
  const filteredTags = mockTags.filter(tag => 
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  if (filteredTags.length === 0) {
    return (
      <Stack gap="md" align="center" py="xl">
        <Hash size={48} color={colorScheme === "dark" ? theme.colors.blue[4] : theme.colors.blue[6]} />
        <Text size="sm" c="dimmed" ta="center">
          {t("noTagsFound")}
        </Text>
        <Text size="xs" c="dimmed" ta="center">
          {t("tryOtherKeywords")}
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="sm">
      {filteredTags.map((tag) => (
        <Card 
          key={tag.id} 
          padding="md" 
          radius="md" 
          withBorder
          className={cardClassName}
        >
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <Hash size={20} color={colorScheme === "dark" ? theme.colors.blue[4] : theme.colors.blue[6]} />
              <Stack gap={2}>
                <Text size="md" fw={500} className="text-gray-800 dark:text-gray-200">
                  #{tag.name}
                </Text>
                <Group gap="xs">
                  <Group gap={4}>
                    <Users size={14} />
                    <Text size="xs" c="dimmed">
                      {t("posts", { count: tag.count })}
                    </Text>
                  </Group>
                  {tag.trending && (
                    <Group gap={4}>
                      <TrendingUp size={14} color={theme.colors.orange[6]} />
                      <Text size="xs" c="orange">
                        {t("trending")}
                      </Text>
                    </Group>
                  )}
                </Group>
              </Stack>
            </Group>
                         <Button
               variant="ghost"
               size="sm"
               className="min-h-[32px] min-w-[32px]"
               style={{
                 color: hoveredTagId === tag.id 
                   ? "rgb(59, 130, 246)"
                   : isDarkMode 
                     ? "#E5E7EB" 
                     : "#4B5563",
               }}
               onClick={() => {
                 // Navigate to feed page with tag parameter for filtering
                 // This enables users to view all posts with this specific tag
                 router.push(`/zh/feed?tag=${encodeURIComponent(tag.name)}`)
               }}
               onMouseEnter={() => setHoveredTagId(tag.id)}
               onMouseLeave={() => setHoveredTagId(null)}
             >
               <Hash 
                 size={14} 
                 strokeWidth={2}
                 style={{
                   color: hoveredTagId === tag.id 
                     ? "rgb(59, 130, 246)"
                     : isDarkMode 
                       ? "#E5E7EB" 
                       : "#4B5563",
                 }}
               />
             </Button>
          </Group>
        </Card>
      ))}
    </Stack>
  )
}

/**
 * Main Search Results Component
 * 
 * This is the main component that renders search results based on the selected type.
 * It handles different search types (tag, people, content, token) and displays
 * appropriate results or loading skeletons.
 * 
 * @param searchValue - The search term entered by the user
 * @param selectedType - The type of search (tag, people, content, token)
 * @param isLoading - Whether to show loading skeletons
 */
export function SearchResults({ searchValue, selectedType, isLoading = true }: SearchResultsProps) {
  const t = useTranslations("search")
  
  // Return null if search value is empty or only whitespace
  if (!searchValue.trim()) {
    return null
  }

  /**
   * Render appropriate loading skeleton based on search type
   * 
   * Different search types have different skeleton layouts:
   * - People: Avatar-based skeleton
   * - Content/Token: Post card skeleton
   * - Tag: Tag list skeleton
   */
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

  /**
   * Render search results based on selected type
   * 
   * Currently implemented:
   * - Tag: Full implementation with filtering and navigation
   * - People/Content/Token: Placeholder messages (under development)
   * 
   * The tag search is fully functional and includes:
   * - Real-time filtering of mock data
   * - Clickable results that navigate to feed page
   * - Internationalized text content
   */
  const renderResults = () => {
    switch (selectedType) {
      case "tag":
        return <TagSearchResults searchValue={searchValue} />
      case "people":
        return (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            {t("developing.people")}
          </Text>
        )
      case "content":
        return (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            {t("developing.content")}
          </Text>
        )
      case "token":
        return (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            {t("developing.token")}
          </Text>
        )
      default:
        return (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            {t("noResults")}
          </Text>
        )
    }
  }

  return (
    <Stack gap="sm">
      {/* Search results header with query info and type badge */}
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500} c="dimmed">
          {t("resultsFor", { query: searchValue })}
        </Text>
        <Badge variant="light" color={searchTypeConfig[selectedType].color} size="sm">
          {t(`searchTypes.${selectedType}`)}
        </Badge>
      </Group>

      {/* Render either loading skeleton or actual results */}
      {isLoading ? (
        renderSkeleton()
      ) : (
        renderResults()
      )}
    </Stack>
  )
}
