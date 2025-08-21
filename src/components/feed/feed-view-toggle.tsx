"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { LayoutDashboard, List } from "lucide-react";
import { useFeedContext } from "@/contexts/feed-context";

export function FeedViewToggle() {
  const { viewMode, setViewMode } = useFeedContext();
  
  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "masonry" : "list");
  };

  return (
    <Tooltip
      label={viewMode === "list" ? "切换到瀑布流视图" : "切换到列表视图"}
      position="left"
      withArrow
      transitionProps={{ transition: 'fade', duration: 200 }}
    >
      <ActionIcon
        variant="light"
        size={42}
        radius="xl"
        color="gray"
        onClick={toggleViewMode}
        aria-label={viewMode === "list" ? "切换到瀑布流视图" : "切换到列表视图"}
        style={{
          backgroundColor: "var(--mantine-color-white)",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        {viewMode === "list" ? (
          <LayoutDashboard strokeWidth={1.5} size={24} />
        ) : (
          <List strokeWidth={1.5} size={24} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}