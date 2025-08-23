"use client"

import { useState, useMemo, useEffect } from "react"
import { fetchAccount } from "@lens-protocol/client/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Calendar, LinkIcon, Heart, MessageCircle, Share, Bookmark, Loader2, ScanLine, CopyIcon } from "lucide-react"
import { TokenIdDisplay } from "@/components/token-id-display"
import { ProfileEdit } from "@/components/auth/profile-edit";
import { resolveUrl } from "@/utils/resolve-url";
import { useLensAuthStore } from "@/stores/auth-store"
import { useAuthCheck } from "@/hooks/auth/use-auth-check"
import { toast } from "sonner"
import copy from "copy-to-clipboard"
import { PostList } from "@/components/feed/post-list";
import { useFeed } from "@/hooks/use-feed";
import { getLicenseType } from "@/utils/post-helpers";
import { FeedFloatingActions } from "@/components/feed/feed-floating-actions"
import { useParams } from 'next/navigation';
import { useFeedContext } from "@/contexts/feed-context";
import { BackButton } from "@/components/ui/back-button";
import { StorageDisplay } from "@/components/ui/storage-display";

export default function UserPage() {
  const params = useParams();
  const username = params.user as string;
  
  const { viewMode } = useFeedContext();

  const { currentProfile, client } = useLensAuthStore();
  const { checkAuthentication } = useAuthCheck();
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [stats, setStats] = useState({
    posts: "n/a",
    followers: "n/a",
    following: "n/a",
    Scores: "n/a",
  })

  // 目标用户的profile信息
  const [targetProfile, setTargetProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // 获取目标用户profile信息
  useEffect(() => {
    const fetchTargetProfile = async () => {
      try {
        setProfileLoading(true);
        
        const result = await fetchAccount(client, {
          username: {
            localName: username,
          },
        });

        if (result.isErr()) {
          console.error('Failed to fetch account:', result.error);
          setTargetProfile(null);
          return;
        }

        const account = result.value;
        if (account) {
          setTargetProfile({
            username: account.username?.localName || username,
            name: account.metadata?.name || username,
            bio: account.metadata?.bio || "No bio available",
            picture: account.metadata?.picture || "/gull.jpg",
            address: account.address
          });
        } else {
          setTargetProfile(null);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setTargetProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    if (username) {
      fetchTargetProfile();
    }
  }, [username]);

  // 判断是否为当前用户的profile
  const isOwnProfile = useMemo(() => 
    currentProfile?.username?.localName === username, 
    [currentProfile?.username?.localName, username]
  );

  // 用 useFeed 获取目标用户的帖子
  const {
    posts: userPosts,
    loading,
    error,
    refreshing,
    lastRefreshTime,
    handleRefresh,
  } = useFeed({ type: "profile", profileAddress: targetProfile?.address });

  // 如果正在加载目标用户信息，显示加载状态
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 如果目标用户不存在，显示错误状态
  if (!targetProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <BackButton />

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={targetProfile?.picture || "/gull.jpg"} />
                  <AvatarFallback className="text-2xl">
                    {targetProfile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{targetProfile?.name || "Anonymous User"}</h1>
                  </div>

                  <p className="text-gray-600 mb-2">@{targetProfile?.username || "anonymous"}</p>

                  <p className="text-gray-800 mb-4 max-w-2xl">
                    {targetProfile?.bio ||
                      "Building the future of decentralized social networks. Passionate about Web3, blockchain technology, and creating meaningful connections."}
                  </p>

                  <div className="flex items-center space-x-6 mb-4">
                    <div className="text-center">
                      <div className="font-bold text-lg">{stats.posts}</div>
                      <div className="text-sm text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{stats.followers.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{stats.following}</div>
                      <div className="text-sm text-gray-600">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{stats.Scores.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Scores</div>
                    </div>
                  </div>
                </div>

                {/* 只有自己的profile才显示编辑按钮 */}
                {isOwnProfile && (
                  <Button 
                    className="self-start chip-button" 
                    onClick={() => {
                      if (!checkAuthentication("编辑个人资料")) {
                        return;
                      }
                      setIsEditOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="original">Onchain Proof</TabsTrigger>
              <TabsTrigger value="works">Works</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className={`${viewMode === 'list' ? 'max-w-xl' : 'max-w-5xl'} mx-auto space-y-6`}>
              <PostList
                posts={userPosts || []}
                loading={loading}
                emptyText="no posts"
                skeletonCount={6}
              />
            </TabsContent>

            <TabsContent value="original">
              <div className="space-y-4">
                {(userPosts || []).map((post: any) => (
                  <StorageDisplay 
                    key={post.id}
                    post={post} 
                    title="Onchain Proof"
                    description="Here is the detail of your post data onchain"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="works">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Works</h3>
                    <p className="text-gray-600">Your works will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bookmarks">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Bookmarks</h3>
                    <p className="text-gray-600">Your Bookmarks will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* 只有自己的profile才显示编辑弹窗 */}
      {isOwnProfile && (
        <ProfileEdit 
          open={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
        />
      )}

      <FeedFloatingActions
        onRefresh={handleRefresh}
        refreshing={refreshing}
        lastRefreshTime={lastRefreshTime}
      />
    </TooltipProvider>
  )
}
