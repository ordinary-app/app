"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import {
    Container,
    Group,
    ActionIcon,
    TextInput,
    Button,
    Text,
    Badge,
    Stack,
    Menu,
    Flex,
    Box,
    useMantineTheme,
} from "@mantine/core"
import {
    ArrowLeft,
    Hash,
    User,
    FileText,
    Key,
    ChevronDown,
    Trash,
    X,
    Search,
    RefreshCw,
    TrendingUp,
    Users,
} from "lucide-react"
import { SearchResults } from "./search-results"
import { useRouter } from "next/navigation"
import { useTagsWithStats, useTagSort } from "@/hooks/use-tags"
import { useSearch, type SearchType, type SearchOptions } from "@/hooks/use-search"
import { PageSize } from "@lens-protocol/client"
import { useTranslations } from "next-intl"

// Types
interface SearchHistoryItem {
    id: string
    text: string
    type: "tag" | "people" | "content" | "token"
    timestamp: Date
}

interface SortOption {
    key: 'name' | 'postCount' | 'userCount'
    label: string
    icon: React.ComponentType<any>
}

// Constants
const SEARCH_TYPE_CONFIG = {
    tag: { icon: Hash, label: "Tag" },
    people: { icon: User, label: "People" },
    content: { icon: FileText, label: "Content" },
    token: { icon: Key, label: "Token ID" },
} as const

const SORT_OPTIONS: SortOption[] = [
    { key: 'name', label: 'sortByName', icon: Hash },
    { key: 'postCount', label: 'sortByPostCount', icon: TrendingUp },
    { key: 'userCount', label: 'sortByUserCount', icon: Users },
]

const INITIAL_SEARCH_HISTORY: SearchHistoryItem[] = [
    { id: "1", text: "刺客信条", type: "tag", timestamp: new Date() },
    { id: "2", text: "刺客信条I", type: "tag", timestamp: new Date() },
    { id: "3", text: "刺客信条II", type: "tag", timestamp: new Date() },
    { id: "4", text: "刺客信条III", type: "tag", timestamp: new Date() },
    { id: "5", text: "刺客信条IV", type: "tag", timestamp: new Date() },
    { id: "6", text: "突发恶疾", type: "content", timestamp: new Date() },
    { id: "7", text: "amy acker", type: "tag", timestamp: new Date() },
    { id: "8", text: "17", type: "token", timestamp: new Date() },
    { id: "9", text: "成分复杂", type: "content", timestamp: new Date() },
    { id: "10", text: "镇魂真的能防搜吗？", type: "content", timestamp: new Date() },
    { id: "11", text: "segment7", type: "people", timestamp: new Date() },
    { id: "12", text: "阿拉贡伞状防御", type: "people", timestamp: new Date() },
]

// Sub-components
const SearchHeader = ({ 
    searchValue, 
    selectedType, 
    onSearchValueChange, 
    onTypeChange, 
    onSearch, 
    onClear, 
    onKeyPress 
}: {
    searchValue: string
    selectedType: SearchType
    onSearchValueChange: (value: string) => void
    onTypeChange: (type: SearchType) => void
    onSearch: () => void
    onClear: () => void
    onKeyPress: (event: React.KeyboardEvent) => void
}) => {
    const theme = useMantineTheme()
    const router = useRouter()
    const SelectedIcon = SEARCH_TYPE_CONFIG[selectedType].icon

    return (
        <Group justify="space-between" align="center">
            <ActionIcon variant="subtle" color="gray" size="lg" onClick={() => router.push("/feed")}>
                <ArrowLeft size={20} />
            </ActionIcon>

            <Box style={{ flex: 1 }} mx="md">
                <Group
                    gap={0}
                    style={{
                        border: `1px solid ${theme.colors.gray[3]}`,
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: theme.white,
                    }}
                >
                    <Menu shadow="md" width={120}>
                        <Menu.Target>
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="lg"
                                style={{
                                    borderRadius: 0,
                                    borderRight: `1px solid ${theme.colors.gray[3]}`,
                                    minWidth: "48px",
                                }}
                            >
                                <Group gap={4}>
                                    <SelectedIcon size={16} />
                                    <ChevronDown size={12} />
                                </Group>
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {Object.entries(SEARCH_TYPE_CONFIG).map(([key, config]) => (
                                <Menu.Item
                                    key={key}
                                    leftSection={<config.icon size={16} />}
                                    onClick={() => onTypeChange(key as SearchType)}
                                >
                                    {config.label}
                                </Menu.Item>
                            ))}
                        </Menu.Dropdown>
                    </Menu>

                    <Box style={{ flex: 1, position: "relative" }}>
                        <TextInput
                            value={searchValue}
                            onChange={(e) => onSearchValueChange(e.currentTarget.value)}
                            onKeyPress={onKeyPress}
                            variant="unstyled"
                            style={{ width: "100%" }}
                            styles={{
                                input: {
                                    border: "none",
                                    padding: "8px 12px",
                                    paddingRight: searchValue ? "36px" : "12px",
                                    fontSize: "16px",
                                    backgroundColor: "transparent",
                                    color: theme.black,
                                },
                            }}
                        />
                        {searchValue && (
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="sm"
                                onClick={onClear}
                                style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                            >
                                <X size={14} />
                            </ActionIcon>
                        )}
                    </Box>
                </Group>
            </Box>

            <Button
                variant="filled"
                color="blue"
                size="md"
                onClick={onSearch}
                leftSection={<Search size={16} />}
                style={{
                    borderRadius: "8px",
                    fontWeight: 500,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
            >
                搜索
            </Button>
        </Group>
    )
}

const SortMethodSection = ({
    sortBy,
    sortOrder,
    onSort,
    onRefresh,
    t
}: {
    sortBy: 'name' | 'postCount' | 'userCount'
    sortOrder: 'asc' | 'desc'
    onSort: (key: 'name' | 'postCount' | 'userCount') => void
    onRefresh: () => void
    t: any
}) => {
    const theme = useMantineTheme()

    const getSortIcon = (field: 'name' | 'postCount' | 'userCount') => {
        if (sortBy !== field) return null
        return sortOrder === 'asc' ? '↑' : '↓'
    }

    return (
        <Box
            p="md"
            style={{
                borderBottom: `1px solid ${theme.colors.gray[1]}`,
                backgroundColor: theme.colors.gray[0]
            }}
        >
            <Group justify="space-between" align="center">
                <Group gap="xs" align="center">
                    <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: theme.colors.green[6]
                    }} />
                    <Text size="sm" fw={600} c="black">
                        {t('sortMethod')}
                    </Text>
                </Group>
                <Button
                    variant="light"
                    size="xs"
                    color="gray"
                    onClick={onRefresh}
                    leftSection={<RefreshCw size={12} />}
                    style={{ borderRadius: "6px", fontWeight: 500 }}
                >
                    {t('refresh')}
                </Button>
            </Group>
            <Group gap="sm" mt="sm">
                {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
                    <Button
                        key={key}
                        variant={sortBy === key ? 'filled' : 'light'}
                        size="sm"
                        color="blue"
                        onClick={() => onSort(key)}
                        leftSection={<Icon size={14} />}
                        style={{ borderRadius: "6px", fontWeight: 500 }}
                    >
                        {t(label)} {getSortIcon(key)}
                    </Button>
                ))}
            </Group>
        </Box>
    )
}

const SelectedTagsSection = ({
    selectedTags,
    logicOperator,
    onLogicOperatorChange,
    onTagRemove,
    onClearAll,
    t
}: {
    selectedTags: string[]
    logicOperator: 'OR' | 'AND'
    onLogicOperatorChange: (op: 'OR' | 'AND') => void
    onTagRemove: (tagName: string) => void
    onClearAll: () => void
    t: any
}) => {
    const theme = useMantineTheme()

    if (selectedTags.length === 0) return null

    return (
        <Box
            p="md"
            style={{
                borderBottom: `1px solid ${theme.colors.gray[1]}`,
                backgroundColor: theme.colors.gray[0]
            }}
        >
            <Group justify="space-between" align="center" mb="md">
                <Group gap="xs" align="center">
                    <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: theme.colors.blue[6]
                    }} />
                    <Text size="sm" fw={600} c="black">
                        {t('selectedTags')} ({selectedTags.length})
                    </Text>
                </Group>
                <Group gap="xs">
                    <Text size="xs" c="black" style={{ opacity: 0.8 }}>
                        {t('logic')}:
                    </Text>
                    <Group gap={0} style={{
                        border: `1px solid ${theme.colors.gray[3]}`,
                        borderRadius: "4px",
                        overflow: "hidden"
                    }}>
                        {(['OR', 'AND'] as const).map((op) => (
                            <Button
                                key={op}
                                variant={logicOperator === op ? 'filled' : 'subtle'}
                                size="xs"
                                color={logicOperator === op ? 'blue' : 'gray'}
                                onClick={() => onLogicOperatorChange(op)}
                                style={{
                                    borderRadius: 0,
                                    borderRight: op === 'OR' ? `1px solid ${theme.colors.gray[3]}` : 'none',
                                    fontWeight: 500,
                                    minWidth: "40px",
                                    fontSize: "11px",
                                    padding: "4px 8px"
                                }}
                            >
                                {op}
                            </Button>
                        ))}
                    </Group>
                    <Button
                        variant="light"
                        size="xs"
                        color="red"
                        onClick={onClearAll}
                        style={{
                            borderRadius: "4px",
                            fontWeight: 500,
                            fontSize: "11px",
                            padding: "4px 8px"
                        }}
                    >
                        {t('clear')}
                    </Button>
                </Group>
            </Group>
            
            <Flex wrap="wrap" gap="sm">
                {selectedTags.map((tagName) => (
                    <Badge
                        key={tagName}
                        variant="filled"
                        color="blue"
                        size="md"
                        style={{
                            cursor: "pointer",
                            padding: "8px 12px",
                            fontSize: "13px",
                            fontWeight: 500,
                            borderRadius: "16px",
                            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: "1"
                        }}
                        rightSection={
                            <X
                                size={12}
                                onClick={() => onTagRemove(tagName)}
                                style={{
                                    cursor: "pointer",
                                    marginLeft: "6px",
                                    opacity: 0.8,
                                    transition: "opacity 0.2s ease"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = "0.8"}
                            />
                        }
                    >
                        #{tagName}
                    </Badge>
                ))}
            </Flex>
        </Box>
    )
}

const TagSuggestionsList = ({
    tags,
    selectedTags,
    loading,
    searchValue,
    onTagSelect,
    t
}: {
    tags: any[]
    selectedTags: string[]
    loading: boolean
    searchValue: string
    onTagSelect: (tagName: string) => void
    t: any
}) => {
    const theme = useMantineTheme()

    if (loading) {
        return (
            <Box p="md" ta="center">
                <Text size="sm" c="black" style={{ opacity: 0.7 }}>
                    {t('loadingTags')}
                </Text>
            </Box>
        )
    }

    if (tags.length === 0 && searchValue.trim().length > 0) {
        return (
            <Box p="md" ta="center">
                <Text size="sm" c="black" style={{ opacity: 0.7 }}>
                    {t('noTagsFound')}
                </Text>
            </Box>
        )
    }

    return (
        <Stack gap={0}>
            {tags.map((tag, index) => (
                <Box
                    key={`${tag.name}-${index}`}
                    p="md"
                    style={{
                        cursor: "pointer",
                        borderBottom: index < tags.length - 1 ? `1px solid ${theme.colors.gray[1]}` : "none",
                        backgroundColor: selectedTags.includes(tag.name) ? theme.colors.blue[0] : "transparent",
                        transition: "background-color 0.2s ease"
                    }}
                    onClick={() => onTagSelect(tag.name)}
                    onMouseEnter={(e) => {
                        if (!selectedTags.includes(tag.name)) {
                            e.currentTarget.style.backgroundColor = theme.colors.gray[0]
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!selectedTags.includes(tag.name)) {
                            e.currentTarget.style.backgroundColor = "transparent"
                        }
                    }}
                >
                    <Group justify="space-between" align="center">
                        <Group gap="xs">
                            <Hash size={16} color={theme.colors.blue[6]} />
                            <Text size="sm" fw={500} c="black">
                                {tag.name}
                            </Text>
                            {selectedTags.includes(tag.name) && (
                                <Badge variant="filled" size="xs" color="green">
                                    {t('selected')}
                                </Badge>
                            )}
                        </Group>
                        <Group gap="xs">
                            <Badge variant="light" size="xs" color="blue">
                                {tag.postCount} {t('posts')}
                            </Badge>
                            <Badge variant="light" size="xs" color="green">
                                {tag.userCount} {t('participants')}
                            </Badge>
                        </Group>
                    </Group>
                </Box>
            ))}
        </Stack>
    )
}

const SearchHistory = ({
    history,
    onHistoryItemClick,
    onClearHistory
}: {
    history: SearchHistoryItem[]
    onHistoryItemClick: (item: SearchHistoryItem) => void
    onClearHistory: () => void
}) => {
    if (history.length === 0) {
        return (
            <Text size="sm" c="dimmed" ta="center" py="md">
                暂无搜索记录
            </Text>
        )
    }

    return (
        <>
            <Group justify="space-between" align="center">
                <Text size="sm" fw={500} c="dimmed">
                    最近搜索
                </Text>
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={onClearHistory}>
                    <Trash size={14} />
                </ActionIcon>
            </Group>
            <Flex wrap="wrap" gap="xs">
                {history.map((item) => {
                    const IconComponent = SEARCH_TYPE_CONFIG[item.type].icon
                    return (
                        <Badge
                            key={item.id}
                            variant="light"
                            color="gray"
                            size="lg"
                            style={{ cursor: "pointer" }}
                            leftSection={<IconComponent size={12} />}
                            onClick={() => onHistoryItemClick(item)}
                        >
                            {item.type === "tag" ? `${item.text}` : item.text}
                        </Badge>
                    )
                })}
            </Flex>
        </>
    )
}

// Main component
export function SearchInterface() {
    const theme = useMantineTheme()
    const t = useTranslations("search")
    
    // State
    const [searchValue, setSearchValue] = useState("")
    const [selectedType, setSelectedType] = useState<SearchType>("tag")
    const [isSearching, setIsSearching] = useState(false)
    const [sortBy, setSortBy] = useState<'name' | 'postCount' | 'userCount'>('postCount')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [logicOperator, setLogicOperator] = useState<'OR' | 'AND'>('OR')
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(INITIAL_SEARCH_HISTORY)

    // Hooks
    const { tags: availableTags, loading: loadingTags, refresh: refreshTags } = useTagsWithStats()
    const { sortedTags } = useTagSort(availableTags, sortBy, sortOrder)
    const {
        results: searchResults,
        loading: searchLoading,
        error: searchError,
        hasMore,
        searchPosts,
        loadMore,
        resetSearch
    } = useSearch()

    // Memoized values
    const filteredTags = useMemo(() => {
        if (!searchValue.trim()) return sortedTags
        const searchTerm = searchValue.toLowerCase()
        return sortedTags.filter(tag => tag.name.toLowerCase().includes(searchTerm))
    }, [searchValue, sortedTags])

    const showTagInterface = useMemo(() => 
        searchValue.trim().length > 0 || selectedTags.length > 0, 
        [searchValue, selectedTags]
    )

    // Event handlers
    const handleSearchValueChange = useCallback((value: string) => {
        setSearchValue(value)
    }, [])

    const handleTypeChange = useCallback((type: SearchType) => {
        setSelectedType(type)
        setSearchValue("")
        setSelectedTags([])
    }, [])

    const handleTagSelect = useCallback((tagName: string) => {
        const normalizedTagName = tagName.toLowerCase()
        setSelectedTags(prev => 
            prev.includes(normalizedTagName) 
                ? prev.filter(t => t !== normalizedTagName)
                : [...prev, normalizedTagName]
        )
    }, [])

    const handleTagRemove = useCallback((tagName: string) => {
        const normalizedTagName = tagName.toLowerCase()
        setSelectedTags(prev => prev.filter(t => t !== normalizedTagName))
    }, [])

    const handleClearSelectedTags = useCallback(() => {
        setSelectedTags([])
    }, [])

    const handleSort = useCallback((newSortBy: 'name' | 'postCount' | 'userCount') => {
        if (sortBy === newSortBy) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(newSortBy)
            setSortOrder('desc')
        }
    }, [sortBy])

    const buildSearchQuery = useCallback(() => {
        if (selectedTags.length === 0) return searchValue
        const tagQuery = selectedTags.map(tag => `#${tag.toLowerCase()}`).join(` ${logicOperator} `)
        return `${searchValue} ${tagQuery}`.trim()
    }, [selectedTags, logicOperator, searchValue])

    const handleSearch = useCallback(async () => {
        if (searchValue.trim() || selectedTags.length > 0) {
            setIsSearching(true)
            const searchQuery = buildSearchQuery()

            // Add to search history
            const newItem: SearchHistoryItem = {
                id: Date.now().toString(),
                text: searchQuery,
                type: selectedType,
                timestamp: new Date(),
            }
            setSearchHistory(prev => [newItem, ...prev.slice(0, 9)])

            try {
                const searchOptions: SearchOptions = {
                    query: searchValue.trim() || "",
                    type: selectedType,
                    tags: selectedTags.length > 0 ? selectedTags : undefined,
                    logicOperator: selectedTags.length > 0 ? logicOperator : undefined,
                    pageSize: PageSize.Ten,
                }

                await searchPosts(searchOptions)
            } catch (error) {
                console.error("Search failed:", error)
            } finally {
                setIsSearching(false)
            }
        }
    }, [searchValue, selectedTags, selectedType, logicOperator, buildSearchQuery, searchPosts])

    const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSearch()
        }
    }, [handleSearch])

    const handleClearSearch = useCallback(() => {
        setSearchValue("")
        setSelectedTags([])
        resetSearch()
    }, [resetSearch])

    const handleHistoryItemClick = useCallback((item: SearchHistoryItem) => {
        setSearchValue(item.text)
        setSelectedType(item.type)
        setSelectedTags([])
    }, [])

    const handleClearHistory = useCallback(() => {
        setSearchHistory([])
    }, [])

    const handleLoadMore = useCallback(async () => {
        if (hasMore && !searchLoading) {
            const searchOptions: SearchOptions = {
                query: searchValue.trim() || "",
                type: selectedType,
                tags: selectedTags.length > 0 ? selectedTags : undefined,
                logicOperator: selectedTags.length > 0 ? logicOperator : undefined,
                pageSize: PageSize.Ten,
            }
            await loadMore(searchOptions)
        }
    }, [hasMore, searchLoading, searchValue, selectedType, selectedTags, logicOperator, loadMore])

    return (
        <Container size="sm" px="0" className="search-container">
            <Stack gap="lg" py="md">
                <SearchHeader
                    searchValue={searchValue}
                    selectedType={selectedType}
                    onSearchValueChange={handleSearchValueChange}
                    onTypeChange={handleTypeChange}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    onKeyPress={handleKeyPress}
                />

                {showTagInterface && (
                    <Box
                        style={{
                            border: `1px solid ${theme.colors.gray[2]}`,
                            borderRadius: "16px",
                            overflow: "hidden",
                            backgroundColor: theme.white,
                            maxHeight: "500px",
                            overflowY: "auto"
                        }}
                    >
                        <SortMethodSection
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            onRefresh={refreshTags}
                            t={t}
                        />

                        <SelectedTagsSection
                            selectedTags={selectedTags}
                            logicOperator={logicOperator}
                            onLogicOperatorChange={setLogicOperator}
                            onTagRemove={handleTagRemove}
                            onClearAll={handleClearSelectedTags}
                            t={t}
                        />

                        <TagSuggestionsList
                            tags={filteredTags}
                            selectedTags={selectedTags}
                            loading={loadingTags}
                            searchValue={searchValue}
                            onTagSelect={handleTagSelect}
                            t={t}
                        />
                    </Box>
                )}

                {searchResults.length > 0 ? (
                    <SearchResults
                        searchValue={searchValue}
                        selectedType={selectedType}
                        isLoading={isSearching || searchLoading}
                        results={searchResults}
                        hasMore={hasMore}
                        onLoadMore={handleLoadMore}
                        error={searchError}
                    />
                ) : (
                    <Stack gap="sm">
                        <SearchHistory
                            history={searchHistory}
                            onHistoryItemClick={handleHistoryItemClick}
                            onClearHistory={handleClearHistory}
                        />
                    </Stack>
                )}
            </Stack>
        </Container>
    )
}
