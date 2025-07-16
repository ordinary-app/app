"use client";

import { LayoutDashboard, List } from "lucide-react";
import { useFeedContext } from "@/contexts/feed-context";
// 如有全局class工具函数可引入cn，否则用简单拼接

export function FeedViewToggle() {
  const { viewMode, setViewMode } = useFeedContext();
  return (
    <div className="flex justify-center items-center">
      <div className="flex">
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "list" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          aria-label="列表视图"
        >
          <List strokeWidth={2} className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode("masonry")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "masonry" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          aria-label="瀑布流视图"
        >
          <LayoutDashboard strokeWidth={2} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 