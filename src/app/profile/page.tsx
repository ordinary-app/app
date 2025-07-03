"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, MapPin, Calendar, LinkIcon, Heart, MessageCircle } from "lucide-react"
import { useCurrentProfileStorage } from "@/stores/profile-store"
import { usePosts } from "@lens-protocol/react";
import dayjs from 'dayjs';

export default function ProfilePage() {
  const currentProfile= useCurrentProfileStorage(state => state.currentProfile)
  const [stats, setStats] = useState({
    posts: 12,
    followers: 1234,
    following: 567,
    likes: 2890,
  })
  const { data, loading, error } = usePosts({
    filter: {
      authors: [currentProfile?.address], // the author's EVM address
    },
  });

  const userPosts = useMemo(() => {
    if (loading) return [];
    const posts = data?.items ?? [];
    return posts.map(i => ( {
      id: i.id,
      content: i.metadata?.content,
      timestamp: dayjs(i.timestamp).format("MMM D YYYY HH:mm"),
      likes: 45,
      comments: 12,
      isOriginal: true,
      attachments: i.metadata?.attachments ?? [],
    }))
  }, [data, loading])

  console.log("Get post -----", data)

  return (
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
                    <h1 className="text-3xl font-bold">@{currentProfile?.username?.localName || "Anonymous User"}</h1>
                    <Badge variant="secondary">Verified</Badge>
                  </div>

                  {/* <p className="text-gray-600 mb-2">@{currentProfile?.username?.localName || "anonymous"}</p> */}

                  <p className="text-gray-800 mb-4 max-w-2xl">
                    {currentProfile?.metadata?.bio ||
                      "Building the future of decentralized social networks. Passionate about Web3, blockchain technology, and creating meaningful connections."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      San Francisco, CA
                    </div>
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
                      <div className="font-bold text-lg">{stats.likes.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Likes</div>
                    </div>
                  </div>
                </div>

                <Button className="self-start">
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
              <TabsTrigger value="original">Original Statements</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              {userPosts.map((post: any) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-sm text-gray-600">{post.timestamp}</CardTitle>
                        {post.isOriginal && (
                          <Badge variant="secondary" className="text-xs">
                            Original
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    {
                      post.attachments.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {
                            post.attachments.map(p => (
                              <div className="border-[1px] border-[#a9b2bc] dark:border-[#708090] relative h-full w-full overflow-hidden rounded-lg object-cover max-h-[500px]">
                                <img loading="lazy" alt="attachment" className="h-full w-full object-cover" src={p.item} />
                              </div>
                            ))
                          }
                        </div>
                      )
                    }
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="original">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Original Statements</h3>
                    <p className="text-gray-600">Your original content and statements will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="likes">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Liked Posts</h3>
                    <p className="text-gray-600">Posts you've liked will appear here</p>
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
          </Tabs>
        </div>
      </main>
    </div>
  )
}
