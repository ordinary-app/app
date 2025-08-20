"use client";

import { Feed } from "./feed";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <Feed />
      </div>
    </div>
  );
}
