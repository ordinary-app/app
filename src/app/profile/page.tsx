"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Calendar, LinkIcon, Heart, MessageCircle, Share, Bookmark, Loader2, ScanLine } from "lucide-react"
import { TokenIdDisplay } from "@/components/token-id-display"
import { usePosts } from "@lens-protocol/react";
import dayjs from 'dayjs';
import { ProfileEdit } from "@/components/auth/profile-edit";
import { resolveUrl } from "@/utils/resolve-url";
import { useLensAuthStore } from "@/stores/auth-store"
import { useWalletCheck } from "@/hooks/use-wallet-check"
import { toast } from "sonner"

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
  const { data, loading, error } = usePosts({
    filter: {
      authors: [currentProfile?.address], // the author's EVM address
    },
  });

  // 检查是否为原创内容（基于license属性）
  const checkIfOriginal = (metadata: any): boolean => {
    if (!metadata?.attributes) return false
    
    // 查找license属性
    const licenseAttr = metadata.attributes.find((attr: any) => attr.key === "license")
    return licenseAttr && licenseAttr.value && licenseAttr.value !== null && licenseAttr.value !== ""
  }

  const userPosts = useMemo(() => {
    if (loading) return [];
    const posts = data?.items ?? [];
    return posts
      .filter((post: any) => post.__typename === 'Post')
      .map((post: any) => ({
        id: post.id,
        content: post.metadata?.content || "No content available",
        author: {
          handle: currentProfile?.username?.localName || "unknown",
          displayName: currentProfile?.metadata?.name || currentProfile?.username?.localName || "Unknown User",
          avatar: currentProfile?.metadata?.picture ? resolveUrl(currentProfile?.metadata?.picture) : undefined,
        },
        isOriginal: checkIfOriginal(post.metadata),
        likes: post.stats?.upvotes || 0,
        comments: post.stats?.comments || 0,
        isLiked: false,
        timestamp: dayjs(post.timestamp).format("MMM D YYYY | HH:mm"),
        attachments: post.metadata?.attachments ?? [],
        contentUri: post.contentUri,
      }))
  }, [data, loading, currentProfile])

  const handleLike = async (_postId: string) => {
    if (!checkWalletConnection("点赞")) {
      return;
    }
    
    try {
      // Update the post like status locally
      // Note: In a real app, you would call the API here
      toast.success("Post liked successfully")
    } catch (error) {
      toast.error("Failed to like post")
    }
  }

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
              {
                loading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  userPosts.length > 0 ? userPosts.map((post: any) => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={post.author.avatar || "/gull.jpg"} />
                              <AvatarFallback>{post.author.displayName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{post.author.displayName}</h3>
                                <TokenIdDisplay uri={post.contentUri} isOriginal={post.isOriginal} />
                              </div>
                              <p className="text-sm text-gray-500">@{post.author.handle}</p>
                              <p className="text-xs text-gray-400">{post.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-800 mb-4">{post.content}</p>
                        {
                          post.attachments.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {
                                post.attachments.map((p: any, index: number) => (
                                  <div key={index} className="border-[1px] border-[#a9b2bc] dark:border-[#708090] relative h-full w-full overflow-hidden rounded-lg object-cover max-h-[500px]">
                                    <img loading="lazy" alt="attachment" className="h-full w-full object-cover" src={p.item} />
                                  </div>
                                ))
                              }
                            </div>
                          )
                        }
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-6">
                            <Button variant="ghost" size="sm" className="text-gray-600">
                              <Bookmark className="h-4 w-4 mr-1" />
                              Bookmark
                            </Button>
    
                            <Button variant="ghost" size="sm" className="text-gray-600">
                              <Share className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
    
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-600">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.comments}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className={post.isLiked ? "text-red-600" : "text-gray-600"}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                              {post.likes}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div>no posts</div>
                  )
                )
              }
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
                  {userPosts
                    .filter((post) => post.isOriginal)
                    .map((post) => (
                      <div
                        key={post.id}
                        className="p-4 bg-gradient-to-r from-orange-50 to-white-50 rounded-lg border border-orange-200 mb-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-gray-800 flex-1">{post.content}</p>
                          <TokenIdDisplay uri={post.contentUri} isOriginal={post.isOriginal} />
                        </div>
                        <div className="flex items-start justify-between text-sm">
                          <span className="text-orange-600 break-all flex-1 mr-2">Grove Storage: {post.contentUri || 'len://...'}</span>
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
