"use client";

import { useCallback, useEffect, useState } from "react";
import { PageSize, Post } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import { useLensAuthStore } from "@/stores/auth-store";

const FALLBACK_TAGS = [
  "art",
  "music",
  "photography",
  "design",
  "writing",
  "gaming",
  "anime",
  "manga",
  "cosplay",
  "fanart",
  "original",
  "digital",
];

export function useAvailableTags() {
  const { client, sessionClient } = useLensAuthStore();
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!client) return;
    try {
      setLoading(true);
      setError(null);

      const result = await fetchPosts(sessionClient || client, {
        filter: { feeds: [{ globalFeed: true }] },
        pageSize: PageSize.Fifty,
      });

      if (result.isErr()) {
        setError(result.error.message || "Failed to fetch tags");
        setTags(FALLBACK_TAGS);
        return;
      }

      const { items } = result.value;
      const filteredPosts = items.filter((i) => i.__typename === "Post") as Post[];
      const tagSet = new Set<string>();
      filteredPosts.forEach((post) => {
        if (post.metadata) {
          if (
            "attributes" in post.metadata &&
            post.metadata.attributes &&
            Array.isArray(post.metadata.attributes)
          ) {
            (post.metadata.attributes as any[]).forEach((attr: any) => {
              if (attr.key === "tags" && attr.value && typeof attr.value === "string") {
                const arr = attr.value.split(",").map((v: string) => v.trim());
                arr.forEach((t: string) => t && tagSet.add(t.toLowerCase()))
              }
            });
          }

          if ("content" in post.metadata && post.metadata.content) {
            const content = post.metadata.content as string;
            const hashtags = content.match(/#(\w+)/g);
            if (hashtags) {
              hashtags.forEach((h: string) => {
                const t = h.slice(1).toLowerCase();
                if (t.trim()) tagSet.add(t.trim());
              });
            }
          }
        }
      });

      const list = Array.from(tagSet).sort();
      setTags(list.length > 0 ? list : FALLBACK_TAGS);
    } catch (e) {
      setError("Failed to fetch tags");
      setTags(FALLBACK_TAGS);
    } finally {
      setLoading(false);
    }
  }, [client, sessionClient]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tags, loading, error, refresh };
}


