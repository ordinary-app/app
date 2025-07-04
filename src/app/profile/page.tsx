"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, MapPin, Calendar, LinkIcon, Heart, MessageCircle, Share, Bookmark, Loader, Loader2 } from "lucide-react"
import { usePosts } from "@lens-protocol/react";
import dayjs from 'dayjs';
import { ProfileEdit } from "@/components/auth/profile-edit";
import { resolveUrl } from "@/utils/resolve-url";
import { useToast } from "@/hooks/use-toast";
import { useLensAuthStore } from "@/stores/auth-store"

export default function ProfilePage() {
  const { toast } = useToast()
  const { currentProfile } = useLensAuthStore();
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
      }))
  }, [data, loading, currentProfile])

  const handleLike = async (postId: string) => {
    try {
      // Update the post like status locally
      // Note: In a real app, you would call the API here
      toast({
        title: "Success",
        description: "Post liked successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      })
    }
  }

  // console.log("Get post -----", data)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentProfile?.metadata?.picture || "/lufei.jpg"} />
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

                <Button className="self-start" onClick={() => setIsEditOpen(true)}>
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
              <TabsTrigger value="original">Chips</TabsTrigger>
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
                              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{post.author.displayName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{post.author.displayName}</h3>
                                {post.isOriginal && (
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <button 
                                        className="relative focus:outline-none"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                        onTouchStart={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors shadow-lg">
                                          Original
                                        </Badge>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent 
                                      className="border border-black-500 rounded-md text-sm font-medium"
                                      sideOffset={3}
                                      side="right"
                                      style={{ 
                                        backgroundColor: '#F7D777', 
                                        color: '#000000',
                                        zIndex: 9999
                                      }}
                                    >
                                      薯条 token id = 1
                                    </TooltipContent>
                                  </Tooltip>
                                )}
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
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Original Statements (Chips)</h3>
                    <p className="text-gray-600">Your original content and statements will appear here</p>
                  </div>
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
      </div>
    </TooltipProvider>
  )
}
