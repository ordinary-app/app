"use client";

import { Feed } from "./feed";
import { useSearchParams } from "next/navigation";

/**
 * Feed Page Component
 * 
 * This component serves as the main feed page that displays posts.
 * It supports tag-based filtering through URL parameters.
 * 
 * Features:
 * - Tag filtering via URL query parameters
 * - Responsive layout with dark mode support
 * - Integration with the main Feed component
 * 
 * URL Examples:
 * - /zh/feed (all posts)
 * - /zh/feed?tag=游戏 (posts with "游戏" tag)
 * - /zh/feed?tag=刺客信条 (posts with "刺客信条" tag)
 */
export default function FeedPage() {
  // Get URL search parameters for tag filtering
  const searchParams = useSearchParams();
  
  // Extract the 'tag' parameter from URL query string
  // This allows users to filter posts by specific tags
  // Example: /zh/feed?tag=游戏 -> tagFilter = "游戏"
  const tagFilter = searchParams.get('tag');

  return (
    // Main page container with responsive styling and dark mode support
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-800">
      {/* Content wrapper with responsive container */}
      <div className="container mx-auto px-4">
        {/* 
          Feed component with tag filtering capability
          - tagFilter: Optional string for filtering posts by tag
          - When tagFilter is provided, only posts with matching tags are shown
          - When tagFilter is null, all posts are displayed
        */}
        <Feed tagFilter={tagFilter} />
      </div>
    </div>
  );
}
