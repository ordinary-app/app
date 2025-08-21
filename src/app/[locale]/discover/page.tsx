"use client";

import { SearchInterface } from "@/components/search/search-interface"

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <SearchInterface />
      </div>
    </div>
  );
}