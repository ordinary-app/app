"use client"

import { Group, ActionIcon, Tabs, Box } from "@mantine/core"
import { Search, Filter } from "lucide-react"
import { useState } from "react"
import { useDisabled } from "@/utils/disabled"
import { FilterDialog } from "@/components/dialogs/filter-dialog"
import { useRouter } from "next/navigation"

export function FeedHeader() {
  //const [opened, { toggle }] = useDisclosure(false)
  const [activeTab, setActiveTab] = useState("latest")

  const mainTabs = [
    { value: "follow", label: "关注", disabled: true },
    { value: "home", label: "发现", disabled: true },
    { value: "latest", label: "最新", disabled: false },
  ]

  const router = useRouter()

  return (
    <Box>
      {/* Main Header */}
      <Box
        h={60}
        px="md"
        style={{
          //borderBottom: "1px solid #f0f0f0",
          backgroundColor: "transparent",
          //position: "sticky",
          //top: 0,
          //zIndex: 100,
          borderRadius: "10px",
        }}
      >
        <Group justify="space-between" h="100%" align="center">
          {/* Left: Filter Icon */}
          <FilterDialog
            trigger={
              <ActionIcon variant="transparent" size="lg" className="text-gray-800 dark:text-gray-200">
                <Filter size={20} />
              </ActionIcon>
            }
            onFiltersChange={(filters) => {
            }}
          />

          {/* Center: Main Navigation Tabs */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || "latest")} variant="unstyled">
            <Tabs.List>
              {mainTabs.map((tab) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  {...useDisabled(
                    {
                      isDisabled: tab.disabled,
                      baseStyles: {
                        fontSize: "16px",
                        fontWeight: 500,
                        padding: "8px 3px",
                        borderBottom: activeTab === tab.value ? "2px solid #ff6b35 " : "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        margin: "0 15px",
                      }
                    }
                  )}
                  className={
                    `${activeTab === tab.value
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-800 dark:text-gray-200'} transition-colors`
                  }
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>

          {/* Right: Search Icon */}
          <ActionIcon variant="transparent" size="lg" className="text-gray-800 dark:text-gray-200">
            <Search size={20} onClick={() => router.push("/discover")} />
          </ActionIcon>
        </Group>
      </Box>

    </Box>
  )
}
