"use client"

import { Modal, Button, Card, Group, Stack, Text, UnstyledButton } from "@mantine/core"
import { Settings, Globe, Star, AlertTriangle, Ban, Shield, Heart, Brain, Hash, Users } from "lucide-react"
import { useState } from "react"
import { useDisabled } from "@/utils/disabled"

interface FilterOption {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
}

const RATING_OPTIONS = [
  {
    value: "general-rate",
    label: "全年龄",
    description: "适合所有年龄段的内容",
    icon: <Star className="h-4 w-4 text-green-500" />,
  },
  {
    value: "teen-rate",
    label: "青少年级",
    description: "可能不适合13岁以下的内容",
    icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  },
  {
    value: "mature-rate",
    label: "成人级",
    description: "包含暴力、色情等内容",
    icon: <Shield className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "explicit-rate",
    label: "限制级",
    description: "包含严重露骨的暴力、色情等内容",
    icon: <Ban className="h-4 w-4 text-red-500" />,
  },
]

const WARNING_OPTIONS = [
  {
    value: "none-warning",
    label: "无内容预警",
    icon: <Shield className="h-4 w-4 text-gray-400" />,
  },
  {
    value: "ai-warning",
    label: "AI生成内容预警",
    icon: <Brain className="h-4 w-4 text-red-500" />,
  },
  {
    value: "violence-warning",
    label: "暴力描述预警",
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
  },
  {
    value: "death-warning",
    label: "主角死亡预警",
    icon: <Heart className="h-4 w-4 text-red-600" />,
  },
  {
    value: "noncon-warning",
    label: "强制/非自愿预警",
    icon: <Ban className="h-4 w-4 text-red-700" />,
  },
  {
    value: "underage-warning",
    label: "未成年性行为预警",
    icon: <Shield className="h-4 w-4 text-red-700" />,
  },
]

const CATEGORY_OPTIONS = [
  { value: "none-relationship", label: "综合", icon: <Globe className="h-4 w-4 text-zinc-800" /> },
  { value: "gl", label: "GL", icon: <Heart className="h-4 w-4 text-red-500" /> },
  { value: "gb", label: "GB", icon: <Heart className="h-4 w-4 text-red-500" /> },  
  { value: "bl", label: "BL", icon: <Heart className="h-4 w-4 text-red-500" /> },
  { value: "gen-relationship", label: "无CP", icon: <Hash className="h-4 w-4 text-blue-500" /> },
  { value: "multi-relationship", label: "多元", icon: <Users className="h-4 w-4 text-gray-500" /> },
]

interface FilterDialogProps {
  trigger?: React.ReactNode
  onFiltersChange?: (filters: {
    categories: string
    sortBy: string
    timeRange: string[]
  }) => void
}

export function FilterDialog({ trigger, onFiltersChange }: FilterDialogProps) {
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSortBy, setSelectedSortBy] = useState("latest")
  const [selectedTimeRange, setSelectedTimeRange] = useState<string[]>([])

  const handleReset = () => {
    setSelectedCategory("")
    setSelectedSortBy("latest")
    setSelectedTimeRange([])
  }

  const updateFilters = () => {
    onFiltersChange?.({
      categories: selectedCategory,
      sortBy: selectedSortBy,
      timeRange: selectedTimeRange,
    })
  }

  return (
    <>
      <UnstyledButton onClick={() => setShowFilterSheet(true)}>
        {trigger}
      </UnstyledButton>

      <Modal
        opened={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        size="70%"
        title={
          <Group justify="center" gap="xs">
            <Settings size={16} />
            <Text fw={600} size="lg">投稿分类筛选器</Text>
          </Group>
        }
      >
        <Stack gap="lg">
          <Group grow align="stretch" gap="md">
            {/* Categories Section */}
            <Card withBorder shadow="sm" padding="md" radius="md">
              <Stack gap="sm">
                <Group gap="xs">
                  <div style={{ padding: 6, background: "#f8f9fa", borderRadius: 8 }}>
                    <Globe size={16} className="text-sky-600" />
                  </div>
                  <Group gap={4}>
                    <Text fw={600}>频道</Text>
                  </Group>
                </Group>

                <Group gap="xs" wrap="wrap">
                  {CATEGORY_OPTIONS.map((option) => (
                    <UnstyledButton
                      key={option.value}
                      onClick={() => setSelectedCategory(option.value)}
                      style={{
                        width: "calc(50% - 4px)",
                        padding: 12,
                        borderRadius: 8,
                        border: "2px solid",
                        borderColor: selectedCategory === option.value ? "#868e96" : "#e9ecef",
                        background: selectedCategory === option.value ? "#f8f9fa" : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <Stack gap={4} align="center">
                        {option.icon}
                        <Text size="sm" fw={500}>{option.label}</Text>
                      </Stack>
                    </UnstyledButton>
                  ))}
                </Group>
              </Stack>
            </Card>

            {/* Rating Section */}
            <Card withBorder shadow="sm" padding="md" radius="md">
              <Stack gap="sm">
                <Group gap="xs">
                  <div style={{ padding: 6, background: "#f8f9fa", borderRadius: 8 }}>
                    <Star size={16} className="text-green-600" />
                  </div>
                  <Group gap={4}>
                    <Text fw={600}>分级</Text>
                  </Group>
                </Group>

                <Stack gap="xs">
                  {RATING_OPTIONS.map((option) => (
                    <UnstyledButton
                      key={option.value}
                      onClick={() => setSelectedSortBy(option.value)}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        border: "2px solid",
                        borderColor: selectedSortBy === option.value ? "#868e96" : "#e9ecef",
                        background: selectedSortBy === option.value ? "#f8f9fa" : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <Stack gap={4}>
                        <Group gap="xs">
                          {option.icon}
                          <Text size="sm" fw={500}>{option.label}</Text>
                        </Group>
                        <Text size="xs" c="dimmed">{option.description}</Text>
                      </Stack>
                    </UnstyledButton>
                  ))}
                </Stack>
              </Stack>
            </Card>

            {/* Warning Section */}
            <Card withBorder shadow="sm" padding="md" radius="md">
              <Stack gap="sm">
                <Group gap="xs">
                  <div style={{ padding: 6, background: "#f8f9fa", borderRadius: 8 }}>
                    <AlertTriangle size={16} className="text-orange-600" />
                  </div>
                  <Group gap={4}>
                    <Text fw={600}>预警</Text>
                  </Group>
                </Group>

                <Group gap="xs" wrap="wrap">
                  {WARNING_OPTIONS.map((option) => (
                    <UnstyledButton
                      key={option.value}
                      onClick={() => {
                        if (selectedTimeRange.includes(option.value)) {
                          setSelectedTimeRange((prev) => 
                            prev.filter((t) => t !== option.value)
                          )
                        } else {
                          setSelectedTimeRange((prev) => [...prev, option.value])
                        }
                      }}
                      style={{
                        width: "calc(50% - 4px)",
                        padding: 12,
                        borderRadius: 8,
                        border: "2px solid",
                        borderColor: selectedTimeRange.includes(option.value) ? "#868e96" : "#e9ecef",
                        background: selectedTimeRange.includes(option.value) ? "#f8f9fa" : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <Group gap="xs" justify="center">
                        {option.icon}
                        <Text size="sm" fw={500}>{option.label}</Text>
                      </Group>
                    </UnstyledButton>
                  ))}
                </Group>
              </Stack>
            </Card>
          </Group>

          {/* Bottom Action Buttons */}
          <Group justify="flex-end" gap="sm" pt="md">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-6"
            >
              重置
            </Button>
            <Button
              {...useDisabled({
                isDisabled: true,
                baseStyles: { paddingLeft: 24, paddingRight: 24 }
              })}
              onClick={() => {
                updateFilters()
                setShowFilterSheet(false)
              }}
            >
              确定
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}