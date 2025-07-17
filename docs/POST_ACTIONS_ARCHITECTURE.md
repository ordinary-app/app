# Post Actions Architecture Summary

## Current Project Structure for Post Actions

### 1. Core Files
- **`src/contexts/post-actions-context.tsx`** - Shared state management for all post actions
- **`src/hooks/post-actions/use-post-actions.ts`** - Individual post actions hook
- **`src/hooks/post-actions/use-post-actions-buttons.tsx`** - Button configuration for post actions
- **`src/hooks/use-feed.ts`** - Feed-level hook with post fetching
- **`src/components/post/post-actions-bar.tsx`** - Post actions UI component
- **`src/components/post/post-action-button.tsx`** - Individual action button component
- **`src/components/post/post-card.tsx`** - Post component using actions
- **`src/utils/post-helpers.ts`** - Post transformation utilities

### 2. Architecture Pattern (Simplified from fountain-app)

#### **Context Layer** (`src/contexts/`)
- `PostActionsProvider` - Global state provider for all post actions
- `useSharedPostActions()` - Access to shared state and operations
- Manages post states across the entire application
- Handles operations conversion from Lens Protocol format

#### **Hook Layer** (`src/hooks/post-actions/`)
- `usePostActions()` - Individual post actions for a specific post
- `usePostActionsButtons()` - Button configurations with proper states
- Integrates with shared context for state synchronization

#### **Component Layer** (`src/components/post/`)
- `PostCard` - Uses original Lens `Post` type directly
- `PostActionsBar` - Renders action buttons with proper states
- `PostActionButton` - Individual button with optimistic updates

#### **Utility Layer** (`src/utils/`)
- `post-helpers.ts` - Timestamp formatting, attachment extraction, etc.
- Direct integration with Lens Protocol client actions

### 3. Key Features Implemented

#### **Real API Calls**
- ✅ Like/Unlike posts via Lens Protocol (`addReaction`/`undoReaction`)
- ✅ Bookmark/Unbookmark posts via Lens Protocol (`bookmarkPost`/`undoBookmarkPost`)
- ✅ Comment sheet management with URL synchronization
- ✅ Collect sheet management with URL synchronization
- ✅ Error handling with automatic rollback
- ✅ Optimistic updates with proper state management

#### **User Experience**
- ✅ Loading states with toast notifications
- ✅ Success/error feedback
- ✅ Optimistic UI updates
- ✅ Automatic state synchronization
- ✅ Authentication checks before actions

#### **State Management**
- ✅ Shared state across components using React Context
- ✅ Memory-efficient caching with Map-based storage
- ✅ Real-time updates synchronized across all instances
- ✅ Error recovery with automatic rollback
- ✅ URL parameter synchronization for sheets

### 4. Type System (Simplified)

#### **Original Lens Types**
```typescript
// Uses original Lens Protocol types directly
import { Post } from "@lens-protocol/client";

// No more EnhancedPost - working with original types
interface PostCardProps {
  post: Post;
}
```

#### **Context State Management**
```typescript
interface BooleanPostOperations {
  hasUpvoted: boolean;
  hasBookmarked: boolean;
  hasReposted: boolean;
  hasQuoted: boolean;
  canComment: boolean;
  canRepost: boolean;
  canQuote: boolean;
  canBookmark: boolean;
  canCollect: boolean;
  canDelete: boolean;
  canTip: boolean;
}

interface PostActionState {
  post: Post;
  stats: PostStats;
  operations: BooleanPostOperations;
  isCommentSheetOpen: boolean;
  isCollectSheetOpen: boolean;
  // ... other UI state
}
```

### 5. API Call Pattern

```typescript
// Example: Like Action
const handleLike = useCallback(async () => {
  if (!isLoggedIn || !sessionClient) {
    toast.error("Please connect your wallet to like posts");
    return;
  }

  const currentlyLiked = operations?.hasUpvoted || false;
  const currentCount = stats.upvotes;

  // Optimistic update
  updatePostOperations(post.id, { hasUpvoted: !currentlyLiked });
  updatePostStats(post.id, { 
    upvotes: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1 
  });

  try {
    if (currentlyLiked) {
      await undoReaction(sessionClient, { post: post.id, reaction: PostReactionType.Upvote });
    } else {
      await addReaction(sessionClient, { post: post.id, reaction: PostReactionType.Upvote });
    }
  } catch (error) {
    // Rollback on error
    updatePostOperations(post.id, { hasUpvoted: currentlyLiked });
    updatePostStats(post.id, { upvotes: currentCount });
  }
}, [post.id, operations, stats.upvotes, updatePostOperations, updatePostStats, isLoggedIn, sessionClient]);
```

### 6. Component Integration

```typescript
// In PostCard component
export function PostCard({ post }: PostCardProps) {
  // Extract data from original Post structure
  const displayName = post.author.metadata?.name || post.author.username?.localName || "Unknown User";
  const handle = post.author.username?.localName || "unknown";
  const avatar = post.author.metadata?.picture ? resolveUrl(post.author.metadata.picture) : "/gull.jpg";
  const content = "content" in post.metadata && typeof post.metadata.content === "string"
    ? post.metadata.content
    : "No content available";
  const timestamp = formatTimestamp(post.timestamp);
  const isOriginal = checkIfOriginal(post.metadata);
  const attachments = extractAttachments(post.metadata);
  
  return (
    <Card>
      {/* Post content */}
      <div>{content}</div>
      
      {/* Actions bar */}
      <PostActionsBar post={post} />
    </Card>
  );
}
```

### 7. Context Provider Setup

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

### 8. Benefits of This Simplified Architecture

1. **Type Safety** - Uses original Lens Protocol types throughout
2. **Reduced Complexity** - Eliminated unnecessary type transformations
3. **Better Performance** - Direct type usage without conversion overhead
4. **Maintainability** - Single source of truth for post operations
5. **Consistency** - All post actions follow the same pattern
6. **Scalability** - Easy to add new actions by extending the context

### 9. Key Improvements Made

1. **Removed EnhancedPost** - Now uses original `Post` type directly
2. **Simplified Data Flow** - No transformation layers between API and UI
3. **Centralized State** - All post actions managed through single context
4. **Type Compatibility** - No more type casting or compatibility issues
5. **Cleaner Components** - Components extract what they need from original types

### 10. Current Status

- ✅ **Profile Page**: Post actions working correctly
- ✅ **Feed Page**: Post actions working correctly  
- ✅ **Type Safety**: All components use original Lens types
- ✅ **State Management**: Centralized through PostActionsContext
- ✅ **Error Handling**: Proper rollback and user feedback
- ✅ **Optimistic Updates**: Immediate UI feedback
- ✅ **Authentication**: Proper wallet connection checks

### 11. File Structure

```
src/
├── contexts/
│   └── post-actions-context.tsx      # Central state management
├── hooks/
│   ├── post-actions/
│   │   ├── use-post-actions.ts       # Individual post actions
│   │   └── use-post-actions-buttons.tsx # Button configurations
│   └── use-feed.ts                   # Feed with original Post types
├── components/
│   └── post/
│       ├── post-card.tsx             # Post component
│       ├── post-actions-bar.tsx      # Actions UI
│       └── post-action-button.tsx    # Individual buttons
└── utils/
    └── post-helpers.ts               # Utility functions
```

This architecture provides a clean, type-safe, and maintainable solution for post actions in the Original-web, eliminating the complexity of type transformations while maintaining all the functionality.