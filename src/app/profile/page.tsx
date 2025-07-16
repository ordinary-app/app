"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Calendar, LinkIcon, Heart, MessageCircle, Share, Bookmark, Loader2, ScanLine, CopyIcon } from "lucide-react"
import { TokenIdDisplay } from "@/components/token-id-display"
//import { usePosts } from "@lens-protocol/react";
//import dayjs from 'dayjs';
import { ProfileEdit } from "@/components/auth/profile-edit";
import { resolveUrl } from "@/utils/resolve-url";
import { useLensAuthStore } from "@/stores/auth-store"
import { useWalletCheck } from "@/hooks/wallet/use-wallet-check"
import { toast } from "sonner"
import copy from "copy-to-clipboard"
import { PostList } from "@/components/feed/post-list";
import { useFeed } from "@/hooks/use-feed";

export default function ProfilePage() {
  const { currentProfile } = useLensAuthStore();
  const { checkWalletConnection } = useWalletCheck();
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [stats, setStats] = useState({
    posts: 12,
    followers: 1234,
    following: 297,
    Scores: 2890,
  })

  // Memoize the profile address to prevent unnecessary re-renders
  const profileAddress = useMemo(() => currentProfile?.address, [currentProfile?.address]);

  // 用 useFeed 获取 profile 帖子
  const {
    posts: userPosts,
    loading,
    error,
  } = useFeed({ type: "profile", profileAddress });

  return (
    <TooltipProvider>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentProfile?.metadata?.picture || "/gull.jpg"} />
                  <AvatarFallback className="text-2xl">
                    {currentProfile?.username?.localName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{currentProfile?.metadata?.name || currentProfile?.username?.localName || "Anonymous User"}</h1>
                    <Badge variant="secondary">Verified</Badge>
                  </div>

                  <p className="text-gray-600 mb-2">@{currentProfile?.username?.localName || "anonymous"}</p>

                  <p className="text-gray-800 mb-4 max-w-2xl">
                    {currentProfile?.metadata?.bio ||
                      "Building the future of decentralized social networks. Passionate about Web3, blockchain technology, and creating meaningful connections."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined March 2024
                    </div>
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      <a href="#" className="text-blue-600 hover:underline">
                        portfolio.example.com
                      </a>
                    </div>
                  </div>

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

                <Button 
                  className="self-start" 
                  onClick={() => {
                    if (!checkWalletConnection("编辑个人资料")) {
                      return;
                    }
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="original">CHIPS</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              <PostList
                posts={userPosts || []}
                loading={loading}
                renderMode="list"
                emptyText="no posts"
              />
            </TabsContent>

            <TabsContent value="original">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ScanLine className="w-5 h-5 text-orange-600" />
                    <span>Original Statements</span>
                  </CardTitle>
                  <CardDescription>Your original content permanently stored on Grove Storage</CardDescription>
                </CardHeader>
                <CardContent>
                  {(userPosts || [])
                    .filter((post: any) => post.isOriginal)
                    .map((post: any) => (
                      <div
                        key={post.id}
                        className="p-4 bg-gradient-to-r from-orange-50 to-white-50 rounded-lg border border-orange-200 mb-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-gray-800 flex-1">{post.content}</p>
                          <TokenIdDisplay uri={post.contentUri} isOriginal={post.isOriginal} />
                        </div>
                        <div className="flex items-start justify-between text-sm">
                          <span className="text-orange-600 break-all flex-1 mr-2">
                            Grove Storage: {post.contentUri || 'len://...'}
                            { post.contentUri ? (
                              <CopyIcon
                                className="cursor-pointer inline-block ml-2 w-4 h-4" 
                                onClick={() => {
                                  copy(resolveUrl(post.contentUri))
                                  toast('Copy success!')
                                }} 
                              />
                            ) : null }
                          </span>
                          <span className="text-gray-500 flex-shrink-0">{post.timestamp}</span>
                        </div>
                      </div>
                    ))}
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Media</h3>
                    <p className="text-gray-600">Your photos and media will appear here</p>
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
      
      <ProfileEdit 
        open={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />
    </TooltipProvider>
  )
}
