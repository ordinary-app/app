"use client";

import { LayoutDashboard, List } from "lucide-react";
import { useFeedContext } from "@/contexts/feed-context";
import { cn } from "@/lib/utils";

export function FeedViewToggle() {
  const { viewMode, setViewMode } = useFeedContext();
  
  return (
    <div className="flex justify-center items-center">
      <div className="flex rounded-lg bg-muted p-1">
        <button
          onClick={() => setViewMode("masonry")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            viewMode === "masonry" 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
          aria-label="瀑布流视图"
        >
          <LayoutDashboard strokeWidth={2} className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            viewMode === "list" 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
          aria-label="列表视图"
        >
          <List strokeWidth={2} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 