import { fetchFollowing } from "@lens-protocol/client/actions";

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