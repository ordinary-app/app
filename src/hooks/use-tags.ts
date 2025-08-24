"use client";

import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { PageSize, Post } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import { useLensAuthStore } from "@/stores/auth-store";

// Types
interface Tag {
  name: string;
}

interface TagStats extends Tag {
  postCount: number;
  userCount: number;
}

interface CachedData {
  data: TagStats[];
  timestamp: number;
}

interface TagStatsMap {
  postCount: number;
  users: Set<string>;
}

// Constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_PAGES = 4;
const MAX_TAGS = 100;
const MAX_TAG_STATS = 200;

// Utility functions
const extractTagsFromPost = (post: Post): string[] => {
  const tags: string[] = [];
  
  if (post.metadata) {
    // 直接从 metadata.tags 获取标签
    if ("tags" in post.metadata && post.metadata.tags && Array.isArray(post.metadata.tags)) {
      (post.metadata.tags as string[]).forEach((tag: string) => {
        if (tag && tag.length > 0) {
          const normalizedTag = tag.toLowerCase();
          tags.push(normalizedTag);
        }
      });
    }
    
    // 如果 metadata.tags 不存在，尝试从 attributes 中获取（兼容性）
    if (tags.length === 0 && 
        "attributes" in post.metadata &&
        post.metadata.attributes &&
        Array.isArray(post.metadata.attributes)
    ) {
      (post.metadata.attributes as any[]).forEach((attr: any) => {
        if (attr.key === "tags" && attr.value && typeof attr.value === "string") {
          const arr = attr.value.split(",").map((v: string) => v.trim());
          arr.forEach((t: string) => {
            if (t && t.length > 0) {
              const normalizedTag = t.toLowerCase();
              tags.push(normalizedTag);
            }
          });
        }
      });
    }
  }
  
  return [...new Set(tags)]; // 去重
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Tag fetching service
class TagService {
  private client: any;
  private sessionClient: any;

  constructor(client: any, sessionClient: any) {
    this.client = client;
    this.sessionClient = sessionClient;
  }

  private async fetchPostsPage(pageSize: PageSize, cursor?: string | null) {
    const result = await fetchPosts(this.sessionClient || this.client, {
      filter: { feeds: [{ globalFeed: true }] },
      pageSize,
      ...(cursor ? { cursor } : {}),
    });

    if (result.isErr()) {
      return { posts: [], pageInfo: null };
    }

    const { items, pageInfo } = result.value;
    const posts = items.filter((i: any) => i.__typename === "Post") as Post[];
    
    return { posts, pageInfo };
  }

  async fetchAvailableTags(): Promise<TagStats[]> {
    const allTags = new Set<string>();
    
    for (let page = 0; page < DEFAULT_PAGES; page++) {
      try {
        const { posts } = await this.fetchPostsPage(PageSize.Fifty);
        
        // 从帖子中提取标签
        posts.forEach((post) => {
          const postTags = extractTagsFromPost(post);
          postTags.forEach(tag => allTags.add(tag));
        });

        // 如果已经收集到足够的标签，可以提前停止
        if (allTags.size >= MAX_TAGS) {
          break;
        }
        
        // 避免API限制，添加延迟
        if (page < DEFAULT_PAGES - 1) {
          await delay(100);
        }
        
      } catch (pageError) {
        console.error(`Error fetching page ${page + 1}:`, pageError);
        break;
      }
    }

    const tagArray = Array.from(allTags);
    
    if (tagArray.length > 0) {
      // 如果提取到标签，使用Lens数据
      tagArray.sort((a, b) => a.length - b.length);
      const limitedTags = tagArray.slice(0, MAX_TAG_STATS);
      
      // 转换为 TagStats 格式，使用默认统计值
      return limitedTags.map(tagName => ({
        name: tagName,
        postCount: 1, // 默认值，后续会被真实统计覆盖
        userCount: 1,  // 默认值，后续会被真实统计覆盖
      }));
    }
    
    return [];
  }

  async fetchTagStats(): Promise<TagStats[]> {
    const tagStatsMap = new Map<string, TagStatsMap>();
    let cursor: string | null = null;
    let currentPage = 0;

    while (currentPage < DEFAULT_PAGES) {
      currentPage++;

      try {
        const { posts, pageInfo } = await this.fetchPostsPage(PageSize.Fifty, cursor);
        
        if (posts.length === 0) {
          break;
        }
        
        posts.forEach((post) => {
          const tags = extractTagsFromPost(post);
          
          // 统计每个标签
          tags.forEach((tag) => {
            if (tag && tag.length > 0) {
              const normalizedTag = tag.toLowerCase();
              if (!tagStatsMap.has(normalizedTag)) {
                tagStatsMap.set(normalizedTag, { postCount: 0, users: new Set() });
              }
              
              const stats = tagStatsMap.get(normalizedTag)!;
              stats.postCount++;
              
              // 添加发帖用户
              if ((post as any).by?.handle?.fullHandle) {
                stats.users.add((post as any).by.handle.fullHandle);
              }
            }
          });
        });

        // 更新游标
        cursor = pageInfo?.next || null;
        if (!cursor) {
          break;
        }

        // 添加延迟避免API限制
        await delay(100);
      } catch (error) {
        console.error(`Error fetching tag stats page ${currentPage}:`, error);
        break;
      }
    }

    // 转换为数组格式并排序
    const statsArray: TagStats[] = Array.from(tagStatsMap.entries()).map(([name, stats]) => ({
      name,
      postCount: stats.postCount,
      userCount: stats.users.size,
    }));

    // 按发帖数降序排序
    return statsArray.sort((a, b) => b.postCount - a.postCount);
  }
}

// Available tags hook
export function useAvailableTags() {
  const { client, sessionClient } = useLensAuthStore();
  const [tags, setTags] = useState<TagStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized tag service
  const tagService = useMemo(() => {
    if (!client) return null;
    return new TagService(client, sessionClient);
  }, [client, sessionClient]);

  // Fetch available tags
  const fetchAvailableTags = useCallback(async () => {
    if (!tagService) return;

    setLoading(true);
    setError(null);

    try {
      const availableTags = await tagService.fetchAvailableTags();
      setTags(availableTags);
    } catch (err) {
      console.error("Error fetching available tags:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tags");
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, [tagService]);

  useEffect(() => {
    fetchAvailableTags();
  }, [fetchAvailableTags]);

  return {
    tags,
    loading,
    error,
    refresh: fetchAvailableTags,
  };
}

// Tag stats hook
export function useTagStats() {
  const { client, sessionClient } = useLensAuthStore();
  const [tagStats, setTagStats] = useState<TagStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<CachedData | null>(null);

  // Memoized tag service
  const tagService = useMemo(() => {
    if (!client) return null;
    return new TagService(client, sessionClient);
  }, [client, sessionClient]);

  const refresh = useCallback(async (force = false) => {
    if (!tagService) return;
    
    // 检查缓存
    if (!force && cacheRef.current && Date.now() - cacheRef.current.timestamp < CACHE_DURATION) {
      setTagStats(cacheRef.current.data);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const statsArray = await tagService.fetchTagStats();
      
      // 缓存结果
      cacheRef.current = {
        data: statsArray,
        timestamp: Date.now(),
      };
      
      setTagStats(statsArray);
    } catch (e) {
      setError("Failed to fetch tag stats");
      console.error("Error fetching tag stats:", e);
    } finally {
      setLoading(false);
    }
  }, [tagService]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 强制刷新函数
  const forceRefresh = useCallback(() => {
    refresh(true);
  }, [refresh]);

  return { tagStats, loading, error, refresh: forceRefresh };
}

// Combined hook: get tags with stats
export function useTagsWithStats() {
  const { tags: availableTags, loading: tagsLoading, error: tagsError, refresh: refreshTags } = useAvailableTags();
  const { tagStats, loading: statsLoading, error: statsError, refresh: refreshStats } = useTagStats();

  // 合并标签和统计数据，优先使用真实的统计数据
  const tagsWithStats: TagStats[] = useMemo(() => {
    return availableTags.map((tag) => {
      const realStats = tagStats.find((stat) => stat.name.toLowerCase() === tag.name.toLowerCase());
      
      if (realStats) {
        return {
          name: tag.name,
          postCount: realStats.postCount,
          userCount: realStats.userCount,
        };
      }
      
      // 如果没有真实统计数据，使用 availableTags 中的数据
      return tag;
    });
  }, [availableTags, tagStats]);

  // 组合刷新函数
  const refreshAll = useCallback(async () => {
    await Promise.all([refreshTags(), refreshStats()]);
  }, [refreshTags, refreshStats]);

  return {
    tags: tagsWithStats,
    loading: tagsLoading || statsLoading,
    error: tagsError || statsError,
    refresh: refreshAll,
    // 单独刷新函数
    refreshTags,
    refreshStats,
  };
}

// Tag search hook
export function useTagSearch(searchQuery: string) {
  const { tags } = useTagsWithStats();
  
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    
    return tags.filter((tag) => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tags, searchQuery]);

  return { filteredTags };
}

// Tag sort hook
export function useTagSort(tags: TagStats[], sortBy: 'name' | 'postCount' | 'userCount', sortOrder: 'asc' | 'desc') {
  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'postCount':
          aValue = a.postCount;
          bValue = b.postCount;
          break;
        case 'userCount':
          aValue = a.userCount;
          bValue = b.userCount;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }, [tags, sortBy, sortOrder]);

  return { sortedTags };
}
