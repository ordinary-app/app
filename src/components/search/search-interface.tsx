"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  useMantineColorScheme,
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
  //Sun,
  //Moon,
  Search,
} from "lucide-react"
import { SearchResults } from "./search-results"
import { useRouter } from "next/navigation"

interface SearchHistoryItem {
  id: string
  text: string
  type: "tag" | "people" | "content" | "token"
  timestamp: Date
}

const searchTypeConfig = {
  tag: { icon: Hash, label: "Tag" },
  people: { icon: User, label: "People" },
  content: { icon: FileText, label: "Content" },
  token: { icon: Key, label: "Token ID" },
}

export function SearchInterface() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const [searchValue, setSearchValue] = useState("")
  const [selectedType, setSelectedType] = useState<keyof typeof searchTypeConfig>("tag")
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([
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
  ])

  useEffect(() => {
    if (searchValue.trim()) {
      setIsSearching(true)
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false)
      }, 1500)
    }
  }, [selectedType, searchValue])

  const handleSearch = () => {
    if (searchValue.trim()) {
      setIsSearching(true)
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        text: searchValue.trim(),
        type: selectedType,
        timestamp: new Date(),
      }
      setSearchHistory((prev) => [newItem, ...prev.slice(0, 9)]) // Keep only 10 items

      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false)
      }, 2000)
    }
  }

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    setSearchValue(value)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  const clearInput = () => {
    setSearchValue("")
  }

  const SelectedIcon = searchTypeConfig[selectedType].icon

  const router = useRouter()

  return (
    <Container size="sm" px="0">
      <Stack gap="lg" py="md">  
        {/* Header with Search */}
        <Group justify="space-between" align="center">
          <ActionIcon variant="subtle" color={colorScheme === "dark" ? "white" : "gray"} size="lg">
            <ArrowLeft size={20} onClick={() => router.push("/feed")} />
          </ActionIcon>

          <Box style={{ flex: 1 }} mx="md">
            <Group
              gap={0}
              style={{
                border: `1px solid ${colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[3]}`,
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
              }}
            >
              <Menu shadow="md" width={120}>
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    color={colorScheme === "dark" ? "white" : "gray"}
                    size="lg"
                    style={{
                      borderRadius: 0,
                      borderRight: `1px solid ${colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[3]}`,
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
                  {Object.entries(searchTypeConfig).map(([key, config]) => {
                    const IconComponent = config.icon
                    return (
                      <Menu.Item
                        key={key}
                        leftSection={<IconComponent size={16} />}
                        onClick={() => setSelectedType(key as keyof typeof searchTypeConfig)}
                      >
                        {config.label}
                      </Menu.Item>
                    )
                  })}
                </Menu.Dropdown>
              </Menu>

              <Box style={{ flex: 1, position: "relative" }}>
                <TextInput
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  variant="unstyled"
                  style={{ width: "100%" }}
                  styles={{
                    input: {
                      border: "none",
                      padding: "8px 12px",
                      paddingRight: searchValue ? "36px" : "12px",
                      fontSize: "16px",
                      backgroundColor: "transparent",
                      color: colorScheme === "dark" ? theme.white : theme.black,
                    },
                  }}
                />
                {searchValue && (
                  <ActionIcon
                    variant="subtle"
                    color={colorScheme === "dark" ? "white" : "gray"}
                    size="sm"
                    onClick={clearInput}
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

          <Group>
            <Button 
            variant="transparent" color="gray" size="sm" onClick={handleSearch} 
            leftSection={<Search size={16} />}
            >
              搜索
            </Button>
          </Group>
        </Group>

        {searchValue.trim() ? (
          <SearchResults searchValue={searchValue} selectedType={selectedType} isLoading={isSearching} />
        ) : (
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text size="sm" fw={500} c={colorScheme === "dark" ? "white" : "dimmed"}>
                最近搜索
              </Text>
              <ActionIcon
                variant="subtle"
                color={colorScheme === "dark" ? "white" : "gray"}
                size="sm"
                onClick={clearHistory}
              >
                <Trash size={14} />
              </ActionIcon>
            </Group>

            {searchHistory.length > 0 ? (
              <Flex wrap="wrap" gap="xs">
                {searchHistory.map((item) => {
                  const IconComponent = searchTypeConfig[item.type].icon

                  return (
                    <Badge
                      key={item.id}
                      variant="light"
                      color="gray"
                      size="lg"
                      style={{ cursor: "pointer" }}
                      leftSection={<IconComponent size={12} />}
                      onClick={() => {
                        setSearchValue(item.text)
                        setSelectedType(item.type)
                      }}
                    >
                      {item.type === "tag" ? `${item.text}` : item.text}
                    </Badge>
                  )
                })}
              </Flex>
            ) : (
              <Text size="sm" c={colorScheme === "dark" ? "white" : "dimmed"} ta="center" py="md">
                暂无搜索记录
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  )
}
