"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Users, Hash } from "lucide-react"
import { useAuthCheck } from "@/hooks/auth/use-auth-check"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { checkAuthentication } = useAuthCheck();

  const trendingTopics = [
    { tag: "web3", posts: 1234 },
    { tag: "blockchain", posts: 987 },
    { tag: "defi", posts: 756 },
    { tag: "nft", posts: 543 },
    { tag: "lens", posts: 432 },
  ]

  const suggestedProfiles = [
    {
      handle: "vitalik.lens",
      displayName: "Vitalik Buterin",
      bio: "Ethereum co-founder",
      followers: 125000,
      avatar: "/gull.jpg?height=40&width=40",
    },
    {
      handle: "stani.lens",
      displayName: "Stani Kulechov",
      bio: "Founder of Lens Protocol",
      followers: 89000,
      avatar: "/gull.jpg?height=40&width=40",
    },
    {
      handle: "developer.lens",
      displayName: "Sarah Dev",
      bio: "Full-stack developer building on Web3",
      followers: 12500,
      avatar: "/gull.jpg?height=40&width=40",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Discover</h1>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search profiles, posts, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Trending Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trendingTopics.map((topic, index) => (
                      <div
                        key={topic.tag}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <Hash className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">#{topic.tag}</p>
                            <p className="text-sm text-gray-600">{topic.posts.toLocaleString()} posts</p>
                          </div>
                        </div>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-gray-600">Recent community activity will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Suggested Profiles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestedProfiles.map((profile) => (
                    <div
                      key={profile.handle}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={profile.avatar || "/gull.jpg"} />
                        <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{profile.displayName}</p>
                        <p className="text-sm text-gray-600 truncate">@{profile.handle}</p>
                        <p className="text-xs text-gray-500 truncate">{profile.bio}</p>
                        <p className="text-xs text-gray-400">{profile.followers.toLocaleString()} followers</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => checkAuthentication("关注用户")}
                      >
                        Follow
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Profiles</span>
                    <span className="font-semibold">125,432</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posts Today</span>
                    <span className="font-semibold">8,921</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-semibold">45,123</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 