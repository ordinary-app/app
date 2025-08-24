"use client";

import { useState, useCallback, useMemo } from "react";
import { Post, PageSize } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import { useLensAuthStore } from "@/stores/auth-store";

// Types
export type SearchType = "tag" | "people" | "content" | "token";

export interface SearchResult {
  id: string;
  type: SearchType;
  title?: string;
  content?: string;
  author?: string;
  authorHandle?: string;
  authorAvatar?: string;
  timestamp?: Date;
  tags?: string[];
  stats?: {
    likes: number;
    comments: number;
    shares: number;
  };
  metadata?: any;
}

export interface SearchOptions {
  query: string;
  type: SearchType;
  tags?: string[];
  logicOperator?: 'OR' | 'AND';
  pageSize?: PageSize;
}

interface SearchState {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  cursor: string | null;
}

// Constants
const DEFAULT_PAGE_SIZE = PageSize.Ten;
const MAX_PAGE_SIZE = 50;

// Utility functions
const extractTagsFromPost = (post: Post): string[] => {
  const tags: string[] = [];

  if (post.metadata) {
    // 从属性中获取标签
    if (
      "attributes" in post.metadata &&
      post.metadata.attributes &&
      Array.isArray(post.metadata.attributes)
    ) {
      (post.metadata.attributes as any[]).forEach((attr: any) => {
        if (attr.key === "tags" && attr.value && typeof attr.value === "string") {
          const arr = attr.value.split(",").map((v: string) => v.trim());
          tags.push(...arr);
        }
      });
    }

    // 从内容中获取标签
    if ("content" in post.metadata && post.metadata.content) {
      const content = post.metadata.content as string;
      const hashtags = content.match(/#(\w+)/g);
      if (hashtags) {
        hashtags.forEach((h: string) => {
          const t = h.slice(1).toLowerCase();
          if (t.trim()) tags.push(t.trim());
        });
      }
    }
  }

  return [...new Set(tags)]; // 去重
};

const transformPostToSearchResult = (post: Post, searchType: SearchType): SearchResult => ({
  id: post.id,
  type: searchType,
  title: (post.metadata as any)?.title || undefined,
  content: (post.metadata as any)?.content || undefined,
  author: (post as any)?.by?.handle?.fullHandle || "未知用户",
  authorHandle: (post as any)?.by?.handle?.fullHandle,
  authorAvatar: (post as any)?.by?.metadata?.picture?.__typename === "ImageSet" 
    ? (post as any).by.metadata.picture.optimized?.uri 
    : undefined,
  timestamp: new Date((post as any).createdAt),
  tags: extractTagsFromPost(post),
  stats: {
    likes: (post.stats as any)?.reactions || 0,
    comments: post.stats?.comments || 0,
    shares: (post.stats as any)?.mirrors || 0,
  },
  metadata: post.metadata,
});

const getPageSizeNumber = (pageSize: PageSize): number => {
  return typeof pageSize === 'string' ? MAX_PAGE_SIZE : (pageSize || MAX_PAGE_SIZE);
};

// Search strategies
class SearchStrategy {
  private client: any;
  private sessionClient: any;

  constructor(client: any, sessionClient: any) {
    this.client = client;
    this.sessionClient = sessionClient;
  }

  private async fetchPostsWithFilter(filter: any, pageSize: PageSize, cursor?: string | null) {
    const result = await fetchPosts(this.sessionClient || this.client, {
      filter,
      pageSize,
      ...(cursor ? { cursor } : {}),
    });

    if (result.isErr()) {
      return [];
    }

    const { items } = result.value;
    return items.filter((i) => i.__typename === "Post") as Post[];
  }

  async searchByTags(tags: string[], logicOperator: 'OR' | 'AND', pageSize: PageSize, cursor?: string | null): Promise<Post[]> {
    if (logicOperator === 'AND') {
      return this.searchWithAllTags(tags, pageSize, cursor);
    } else {
      return this.searchWithAnyTags(tags, pageSize, cursor);
    }
  }

  private async searchWithAllTags(tags: string[], pageSize: PageSize, cursor?: string | null): Promise<Post[]> {
    try {
      return await this.fetchPostsWithFilter({
        feeds: [{ globalFeed: true }],
        metadata: {
          tags: {
            all: tags.map(tag => tag.toLowerCase())
          }
        }
      }, pageSize, cursor);
    } catch (error) {
      console.error("Error in searchWithAllTags:", error);
      return [];
    }
  }

  private async searchWithAnyTags(tags: string[], pageSize: PageSize, cursor?: string | null): Promise<Post[]> {
    try {
      // 优先尝试使用 metadata.tags.oneOf 过滤器
      const posts = await this.fetchPostsWithFilter({
        feeds: [{ globalFeed: true }],
        metadata: {
          tags: {
            oneOf: tags.map(tag => tag.toLowerCase())
          }
        }
      }, pageSize, cursor);

      if (posts.length > 0) {
        return posts;
      }

      // 如果 metadata 过滤器失败，回退到 searchQuery
      return await this.fetchPostsWithFilter({
        feeds: [{ globalFeed: true }],
        searchQuery: tags.map(tag => `#${tag}`).join(' OR ')
      }, pageSize, cursor);
    } catch (error) {
      console.error("Error in searchWithAnyTags:", error);
      return [];
    }
  }

  async searchByQuery(query: string, pageSize: PageSize, cursor?: string | null): Promise<Post[]> {
    try {
      return await this.fetchPostsWithFilter({
        feeds: [{ globalFeed: true }],
        searchQuery: query
      }, pageSize, cursor);
    } catch (error) {
      console.error("Error in searchByQuery:", error);
      return [];
    }
  }
}

// Main hook
export function useSearch() {
  const { client, sessionClient } = useLensAuthStore();
  
  // State
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    hasMore: true,
    cursor: null,
  });

  // Memoized search strategy
  const searchStrategy = useMemo(() => {
    if (!client) return null;
    return new SearchStrategy(client, sessionClient);
  }, [client, sessionClient]);

  // Search execution
  const executeSearch = useCallback(async (options: SearchOptions, loadMore = false) => {
    if (!searchStrategy) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      let posts: Post[] = [];

      // 根据搜索类型使用不同的搜索策略
      switch (options.type) {
        case "tag":
          if (options.tags && options.tags.length > 0) {
            // 有选择的标签，使用metadata接口
            posts = await searchStrategy.searchByTags(
              options.tags, 
              options.logicOperator || 'OR', 
              options.pageSize || DEFAULT_PAGE_SIZE,
              loadMore ? state.cursor : null
            );
          } else if (options.query.trim()) {
            // 没有选择标签但有搜索查询，将查询内容当作标签来搜索
            posts = await searchStrategy.searchByTags(
              [options.query.trim()], 
              'OR', 
              options.pageSize || DEFAULT_PAGE_SIZE,
              loadMore ? state.cursor : null
            );
          }
          break;

        case "people":
        case "content":
        case "token":
          if (options.query.trim()) {
            posts = await searchStrategy.searchByQuery(
              options.query, 
              options.pageSize || DEFAULT_PAGE_SIZE,
              loadMore ? state.cursor : null
            );
          }
          break;

        default:
          break;
      }

      // 转换搜索结果
      const transformedResults: SearchResult[] = posts.map((post) => 
        transformPostToSearchResult(post, options.type)
      );

      // 更新状态
      setState(prev => {
        const newResults = loadMore ? [...prev.results, ...transformedResults] : transformedResults;
        const pageSizeNumber = getPageSizeNumber(options.pageSize || DEFAULT_PAGE_SIZE);
        
        return {
          ...prev,
          results: newResults,
          loading: false,
          hasMore: posts.length >= pageSizeNumber,
          cursor: loadMore ? prev.cursor : null,
        };
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "搜索过程中发生错误";
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      console.error("Search error:", err);
    }
  }, [searchStrategy, state.cursor]);

  // Public methods
  const searchPosts = useCallback(async (options: SearchOptions) => {
    await executeSearch(options, false);
  }, [executeSearch]);

  const loadMore = useCallback(async (options: SearchOptions) => {
    if (state.hasMore && !state.loading) {
      await executeSearch(options, true);
    }
  }, [state.hasMore, state.loading, executeSearch]);

  const resetSearch = useCallback(() => {
    setState({
      results: [],
      loading: false,
      error: null,
      hasMore: true,
      cursor: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    results: state.results,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    searchPosts,
    loadMore,
    resetSearch,
    clearError,
  };
}
