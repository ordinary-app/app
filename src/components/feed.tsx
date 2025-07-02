"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share, UserPlus, UserMinus, ExternalLink, Bookmark, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: string
  content: string
  author: {
    handle: string
    displayName: string
    avatar?: string
  }
  isOriginal: boolean
  originalLink?: string
  likes: number
  comments: number
  isLiked: boolean
  isFollowing: boolean
  timestamp: string
  media?: {
    type: "image" | "text"
    url?: string
  }
  category: "fanfiction" | "fanart" | "cosplay"
}

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadFeed()
  }, [])

  const loadFeed = async () => {
    try {
      // Mock data for demonstration - in real app, fetch from Lens Protocol
      const mockPosts: Post[] = [
        {
          id: "1",
          content:
            "Just finished writing a new chapter for my Harry Potter fanfic! Check it out and let me know what you think. ⚡ #fanfiction #harrypotter",
          author: {
            handle: "potterhead_writes",
            displayName: "Lily PotterFan",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          isOriginal: true,
          originalLink: "https://example.com/fanfic",
          likes: 112,
          comments: 34,
          isLiked: false,
          isFollowing: true,
          timestamp: "1 hour ago",
          media: { type: "text" },
          category: "fanfiction",
        },
        {
          id: "2",
          content: "I drew some fanart of Geralt from The Witcher! What do you think? 🐺 #fanart #witcher",
          author: {
            handle: "geralt_artist",
            displayName: "John WitcherArt",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          isOriginal: false,
          likes: 256,
          comments: 67,
          isLiked: true,
          isFollowing: false,
          timestamp: "3 hours ago",
          media: {
            type: "image",
            url: "/placeholder.svg?height=300&width=500",
          },
          category: "fanart",
        },
        {
          id: "3",
          content:
            "Attending Comic-Con this weekend as Star Wars character! So excited to meet other fans. ✨ #cosplay #starwars",
          author: {
            handle: "starwars_cosplayer",
            displayName: "Leia Cosplay",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          isOriginal: true,
          originalLink: "https://example.com/cosplay",
          likes: 189,
          comments: 42,
          isLiked: false,
          isFollowing: true,
          timestamp: "5 hours ago",
          media: { type: "text" },
          category: "cosplay",
        },
      ]

      setPosts(mockPosts)
    } catch (error) {
      console.error("Failed to load feed:", error)
      toast({
        title: "Error",
        description: "Failed to load feed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post,
        ),
      )

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

  const handleFollow = async (handle: string) => {
    try {
      setPosts(
        posts.map((post) => (post.author.handle === handle ? { ...post, isFollowing: !post.isFollowing } : post)),
      )

      toast({
        title: "Success",
        description: `Successfully ${posts.find((p) => p.author.handle === handle)?.isFollowing ? "unfollowed" : "followed"} user`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow/unfollow user",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Latest Fanworks</h1>
        <p className="text-gray-600">Discover amazing fanworks from our community</p>
      </div>

      {posts.map((post) => (
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
                      <Badge variant="secondary" className="text-xs">
                        Original
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">@{post.author.handle}</p>
                  <p className="text-xs text-gray-400">{post.timestamp}</p>
                </div>
              </div>

              <Button
                variant={post.isFollowing ? "outline" : "default"}
                size="sm"
                onClick={() => handleFollow(post.author.handle)}
                className="ml-auto"
              >
                {post.isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-1" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-800 leading-relaxed">{post.content}</p>

            {post.media?.type === "image" && post.media.url && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={post.media.url || "/placeholder.svg"}
                  alt="Post media"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            {post.isOriginal && post.originalLink && (
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <a
                  href={post.originalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Original Statement
                </a>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={post.isLiked ? "text-red-600" : "text-gray-600"}
                >
                  <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                  {post.likes}
                </Button>

                <Button variant="ghost" size="sm" className="text-gray-600">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments}
                </Button>

                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Bookmark
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Star className="h-4 w-4 mr-1" />
                  Support Creator
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
