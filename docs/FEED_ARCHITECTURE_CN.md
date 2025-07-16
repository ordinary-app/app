# Feed 架构说明文档

## 概述

本文档详细说明了 Original-web 中的 Feed 系统架构，包括全局动态和个人资料页面的数据流、状态管理和用户界面逻辑。

## 组件层次结构

### 4.1 Feed 页面组件树
```
FeedPage
└── Feed
    ├── 错误提示组件
    ├── 新帖子提示按钮
    ├── 页面标题和刷新按钮
    ├── PostList
    │   ├── FeedViewToggle （视图切换）
    │   └── PostCard[] （帖子卡片列表）
    │       └── PostActionsBar （操作按钮）
    └── 加载更多按钮
```

### 4.2 Profile 页面组件树
```
ProfilePage
├── 个人资料头部
│   ├── 用户头像
│   ├── 用户信息
│   └── 编辑按钮
└── Tabs
    ├── Posts 标签页
    │   └── PostList
    │       └── PostCard[]
    ├── CHIPS 标签页
    │   └── 原创内容列表
    ├── Media 标签页
    └── Bookmarks 标签页
```

## 数据流和状态管理

### 5.1 全局状态管理
```
PostActionsProvider (全局)
├── 管理所有帖子的操作状态
├── 提供共享的点赞、收藏等状态
└── 处理乐观更新和错误回滚

FeedProvider (Feed 相关)
├── 管理视图模式（列表 vs 瀑布流）
├── 提供 Feed 级别的状态
└── 处理 Feed 切换逻辑
```

### 5.2 数据流向
```
1. 页面加载
   ↓
2. useFeed 初始化
   ↓
3. 根据类型获取过滤器
   ↓
4. 调用 Lens Protocol API
   ↓
5. 处理返回的原生 Post 数据
   ↓
6. 初始化 PostActionsContext 状态
   ↓
7. 渲染 PostList 组件
   ↓
8. 渲染 PostCard 组件
   ↓
9. 用户交互触发操作
   ↓
10. 更新共享状态
    ↓
11. UI 实时更新
```

### Context 层（src/contexts/）

- **FeedProvider** - 全局 Feed 状态管理 Provider
- **useFeedContext()** - 提供 Feed 相关的全局状态与操作
- 管理 Feed 视图模式（如列表/瀑布流）、全局刷新、Feed 切换等
- 提供给下层 Hook（如 useFeed）和组件（如 Feed、PostList）共享的上下文数据
- 支持多页面/多组件间的 Feed 状态同步

### 主要职责

- 统一管理 Feed 相关的全局状态（如当前视图模式、全局加载状态等）
- 提供 Feed 操作的全局方法（如切换视图、刷新 Feed、切换 Feed 类型等）
- 支持乐观 UI 更新和错误回滚
- 作为 useFeed、Feed 组件等的上层依赖，保证数据一致性

```typescript
// In layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Web3Provider>
            <PostActionsProvider>
              <ActionBarProvider>
                <FeedProvider>
                  {children}
                </FeedProvider>
              </ActionBarProvider>
            </PostActionsProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

```typescript
// 在 Feed 组件中
const { viewMode, setViewMode, refreshFeed } = useFeedContext();
```

### 设计优势

1. **全局一致性**：所有 Feed 相关组件共享同一份上下文，避免状态分裂
2. **易于扩展**：新增 Feed 类型或视图模式时，只需扩展 Context 层
3. **解耦业务逻辑**：FeedProvider 只关注状态和操作，具体数据获取由 useFeed Hook 负责
4. **便于测试和维护**：Context 层职责单一，便于单元测试和后续维护



## 顶层页面架构

### 1. 全局动态页面 (`src/app/feed/`)

#### 1.1 页面结构
```
src/app/feed/
├── page.tsx          # 页面入口组件
└── feed.tsx          # 主要 Feed 组件
```

#### 1.2 页面入口 (`page.tsx`)
```typescript
export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Feed />
      </div>
    </div>
  )
}
```

**功能说明：**
- 提供页面布局和样式容器
- 负责页面的基础结构和响应式设计
- 渲染主要的 Feed 组件

#### 1.3 Feed 组件 (`feed.tsx`)
```typescript
export function Feed() {
  const {
    posts,
    loading,
    error,
    hasMore,
    loadingMore,
    refreshing,
    newPostsAvailable,
    lastRefreshTime,
    handleRefresh,
    handleLoadMore,
    handleLoadNewPosts,
  } = useFeed(); // 使用全局 feed 类型
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 错误信息显示 */}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
      
      {/* 新帖子提示 */}
      {newPostsAvailable && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <Button onClick={handleLoadNewPosts} className="bg-harbor-600 hover:bg-harbor-700 text-white shadow-lg animate-bounce">
            <ChevronUp className="h-4 w-4 mr-1" />
            New posts available
          </Button>
        </div>
      )}
      
      {/* 页面标题和刷新按钮 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Latest</h1>
        <p className="text-gray-600">on global feed</p>
        {posts && posts.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-4 text-sm">
            <div className="text-gray-400">
              Last updated: {lastRefreshTime?.toLocaleTimeString()}
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        )}
      </div>
      
      {/* 帖子列表 */}
      <PostList posts={posts || []} loading={loading} emptyText="No More" skeletonCount={6} />
      
      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="flex justify-center mt-6 mb-12">
          <Button onClick={handleLoadMore} disabled={loadingMore} className="harbor-button text-white">
            {loadingMore ? <>Loading...</> : <>Load More</>}
          </Button>
        </div>
      )}
    </div>
  );
}
```

**功能特性：**
- **错误处理**：显示 API 错误信息
- **新帖子提示**：浮动按钮提示有新内容
- **手动刷新**：用户可以手动刷新 feed
- **分页加载**：支持无限滚动加载更多内容
- **加载状态**：显示各种加载状态指示器

### 2. 个人资料页面 (`src/app/profile/page.tsx`)

#### 2.1 页面结构
```typescript
export default function ProfilePage() {
  const { currentProfile } = useLensAuthStore();
  const profileAddress = useMemo(() => currentProfile?.address, [currentProfile?.address]);
  
  // 使用 useFeed 获取个人资料帖子
  const {
    posts: userPosts,
    loading,
    error,
  } = useFeed({ type: "profile", profileAddress });
  
  return (
    <TooltipProvider>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 个人资料头部 */}
          <Card className="mb-8">
            {/* 用户信息展示 */}
          </Card>
          
          {/* 标签页内容 */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="original">CHIPS</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            </TabsList>
            
            {/* Posts 标签页 */}
            <TabsContent value="posts" className="space-y-6">
              <PostList
                posts={userPosts || []}
                loading={loading}
                emptyText="no posts"
                skeletonCount={6}
              />
            </TabsContent>
            
            {/* Original 标签页 */}
            <TabsContent value="original">
              {/* 显示原创内容 */}
            </TabsContent>
            
            {/* 其他标签页 */}
          </Tabs>
        </div>
      </main>
    </TooltipProvider>
  );
}
```

**功能特性：**
- **个人资料展示**：显示用户头像、姓名、简介等信息
- **标签页导航**：Posts、CHIPS、Media、Bookmarks
- **个人帖子**：显示用户发布的所有帖子
- **原创内容**：专门展示带有 license 属性的原创内容
- **响应式设计**：适配不同屏幕尺寸

## 核心 Hook：useFeed

### 3.1 Hook 接口定义
```typescript
type FeedType = "global" | "profile" | "custom";

interface useFeedOptions {
  type?: FeedType;
  profileAddress?: string;
  customFilter?: any;
}

export function useFeed(options: useFeedOptions = {}) {
  const { type = "global", profileAddress, customFilter } = options;
  // ... 实现
}
```

### 3.2 状态管理
```typescript
// Feed 状态
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [refreshing, setRefreshing] = useState(false);
const [newPostsAvailable, setNewPostsAvailable] = useState(false);
const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
const [currentCursor, setCurrentCursor] = useState<string | null>(null);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
```

### 3.3 数据获取逻辑
```typescript
const getFilter = useCallback(() => {
  if (type === "global") {
    return { feeds: [{ globalFeed: true }] };
  } else if (type === "profile" && profileAddress) {
    return { authors: [profileAddress] };
  } else if (type === "custom" && customFilter) {
    return customFilter;
  }
  return { feeds: [{ globalFeed: true }] };
}, [type, profileAddress, customFilter]);

const loadPostsFromLens = useCallback(async (isRefresh = false, cursor: string | null = null) => {
  if (!client) return;
  
  try {
    if (isRefresh) setRefreshing(true);
    else if (cursor) setLoadingMore(true);
    else setLoading(true);
    
    setError(null);
    
    const result = await fetchPosts(client, {
      filter: getFilter(),
      pageSize: PageSize.Fifty,
      cursor: cursor || undefined,
    });
    
    if (result.isErr()) {
      setError(result.error.message || "Failed to fetch posts");
      return;
    }
    
    const { items, pageInfo } = result.value;
    const filteredPosts = items.filter(item => item.__typename === 'Post') as Post[];
    
    // 初始化帖子状态
    filteredPosts.forEach(post => {
      initPostState(post);
    });
    
    if (filteredPosts.length > 0) {
      lastPostIdRef.current = filteredPosts[0].id;
    }
    
    setCurrentCursor(pageInfo.next);
    setHasMore(!!pageInfo.next);
    
    if (isRefresh) {
      setPosts(filteredPosts);
      setLastRefreshTime(new Date());
    } else if (cursor) {
      setPosts(prev => [...prev, ...filteredPosts]);
    } else {
      setPosts(filteredPosts);
      setLastRefreshTime(new Date());
    }
    
    setNewPostsAvailable(false);
  } catch (err) {
    setError("Failed to fetch posts");
  } finally {
    setLoading(false);
    setRefreshing(false);
    setLoadingMore(false);
  }
}, [client, getFilter, initPostState]);
```

### 3.4 实时更新机制
```typescript
// 检查新帖子
const checkForNewPosts = useCallback(async () => {
  if (!client) return;
  
  try {
    const result = await fetchPosts(client, {
      filter: getFilter(),
    });
    if (result.isErr()) return;
    
    const { items } = result.value;
    const filteredPosts = items.filter(item => item.__typename === 'Post') as Post[];
    if (filteredPosts.length > 0 && filteredPosts[0].id !== lastPostIdRef.current) {
      setNewPostsAvailable(true);
    }
  } catch {}
}, [client, getFilter]);

// 设置轮询
useEffect(() => {
  if (!client) return;
  
  loadPostsFromLens();
  
  // 每45秒检查一次新帖子
  intervalRef.current = setInterval(checkForNewPosts, 45000);
  
  const handleFocus = () => {
    const timeSinceLastRefresh = Date.now() - lastRefreshTime.getTime();
    if (timeSinceLastRefresh > 120000) { // 2分钟
      checkForNewPosts();
    }
  };
  
  window.addEventListener('focus', handleFocus);
  
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    window.removeEventListener('focus', handleFocus);
  };
}, [client, type, profileAddress, customFilter]);
```

## 错误处理和加载状态

### 6.1 错误处理策略
- **网络错误**：显示重试按钮
- **API 错误**：显示具体错误信息
- **权限错误**：引导用户登录
- **空数据**：显示友好的空状态

### 6.2 加载状态管理
- **初始加载**：显示骨架屏
- **刷新加载**：显示刷新动画
- **分页加载**：显示加载更多按钮
- **新帖子检查**：后台静默检查

## 性能优化

### 7.1 数据优化
- **分页加载**：避免一次性加载大量数据
- **轮询优化**：合理的轮询间隔
- **缓存策略**：利用 React 状态缓存

### 7.2 UI 优化
- **虚拟滚动**：大量数据时的性能优化
- **懒加载**：图片和媒体内容延迟加载
- **防抖处理**：用户操作的防抖

## 扩展性设计

### 8.1 新 Feed 类型
添加新的 Feed 类型只需：
1. 扩展 `FeedType` 类型定义
2. 在 `getFilter` 中添加新的过滤逻辑
3. 创建对应的页面组件

### 8.2 新功能集成
- **搜索功能**：可以通过 customFilter 实现
- **标签过滤**：扩展过滤器逻辑
- **实时通知**：基于现有的轮询机制扩展

## 总结

Original-web 的 Feed 架构采用了清晰的分层设计：

1. **页面层**：负责布局和路由
2. **组件层**：处理 UI 展示和用户交互
3. **Hook 层**：管理业务逻辑和状态
4. **API 层**：处理数据获取和更新

这种架构提供了良好的可维护性、扩展性和用户体验，同时保持了代码的简洁性和类型安全性。