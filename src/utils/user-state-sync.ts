import { EnhancedPost } from "@/hooks/use-feed";
import { fetchFollowing } from "@lens-protocol/client/actions";

/**
 * 这个实现不太好，应该在渲染每一个帖子的时候查询是否已经被当前的用户点赞
 * Sync user state (like/follow) from currentProfile to posts
 * This function updates posts based on user's current state
 */
export function syncUserStateWithPosts(
  posts: EnhancedPost[],
  currentProfile: any
): EnhancedPost[] {
  if (!currentProfile) return posts;

  return posts.map(post => {
    // Check if this post is liked by current user
    // This would be implemented by checking currentProfile's liked posts
    // For now, we preserve the existing state from Lens operations
    const isLiked = post.isLiked; // Already set from lens operations
    
    // Check if current user follows this post author
    // This is now handled by the Lens operations in the post data
    const isFollowing = post.author.operations?.isFollowedByMe ?? false;
    
    return {
      ...post,
      isLiked,
      isFollowing,
    };
  });
}

/**
 * Check if current user follows a specific profile
 * This integrates with Lens Protocol's following API
 */
export async function checkIfFollowing(
  sessionClient: any,
  targetProfileAddress: string
): Promise<boolean> {
  if (!sessionClient) return false;
  
  try {
    const result = await fetchFollowing(sessionClient, {
      account: sessionClient.account.address,
    });
    
    if (result.isErr()) {
      console.error("Failed to fetch following list:", result.error);
      return false;
    }
    
    const following = result.value.items || [];
    return following.some((account: any) => account.address === targetProfileAddress);
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

/**
 * Get user's following list from Lens Protocol
 * This is used to batch update following status
 */
export async function getUserFollowingList(
  sessionClient: any,
  profileAddress: string
): Promise<string[]> {
  if (!sessionClient) return [];
  
  try {
    const result = await fetchFollowing(sessionClient, {
      account: profileAddress,
    });
    
    if (result.isErr()) {
      console.error("Failed to fetch following list:", result.error);
      return [];
    }
    
    const following = result.value.items || [];
    return following.map((account: any) => account.address);
  } catch (error) {
    console.error("Error fetching following list:", error);
    return [];
  }
}

/**
 * Update posts with fresh user state data
 * This function can be called when currentProfile changes
 */
export function updatePostsWithUserState(
  posts: EnhancedPost[],
  userFollowingList: string[],
  userLikedPosts: string[]
): EnhancedPost[] {
  return posts.map(post => ({
    ...post,
    isFollowing: userFollowingList.includes(post.author.handle),
    isLiked: userLikedPosts.includes(post.id),
  }));
}