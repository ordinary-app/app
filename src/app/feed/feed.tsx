"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Heart, MessageCircle, Share, UserPlus, UserMinus, ExternalLink, Bookmark, Star, RefreshCw, ChevronUp } from "lucide-react"
import { TokenIdDisplay } from "@/components/token-id-display"
import { fetchPosts } from "@lens-protocol/client/actions"
import { Post as LensPost, AnyPost } from "@lens-protocol/client"
import { resolveUrl } from "@/utils/resolve-url"
import { useLensAuthStore } from "@/stores/auth-store"
import { useWalletCheck } from "@/hooks/use-wallet-check"
import { toast } from "sonner"

interface Post {
  id: string
  content: string
  author: {
    handle: string
    displayName: string
    avatar?: string
  }
  isOriginal: boolean
  gatewayUrl?: string
  contentUri?: string
  likes: number
  comments: number
  isLiked: boolean
  isFollowing: boolean
  timestamp: string
  media?: {
    type: "image" | "text"
    url?: string
  }
  attachments: Array<{
    item: string
    type: string
  }>
}

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [newPostsAvailable, setNewPostsAvailable] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastPostIdRef = useRef<string | null>(null)
  const { client } = useLensAuthStore();
  const { checkWalletConnection } = useWalletCheck();

  //调用 Lens 获取原始数据
  useEffect(() => {
    loadPostsFromLens()
    
    // 设置定时刷新（每45秒检查一次新内容）
    intervalRef.current = setInterval(() => {
      checkForNewPosts()
    }, 45000) // 45秒
    
    // 页面焦点事件监听
    const handleFocus = () => {
      const timeSinceLastRefresh = Date.now() - lastRefreshTime.getTime()
      // 如果超过2分钟没刷新，则自动刷新
      if (timeSinceLastRefresh > 120000) {
        checkForNewPosts()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const loadPostsFromLens = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      
      const result = await fetchPosts(client, {
        filter: {
          feeds: [
            {
              globalFeed: true,
            },
          ],
        },
      })
      
      if (result.isErr()) {
        console.error("Lens API error:", result.error)
        setError(result.error.message || "Failed to fetch posts")
        return
      }
      
      const { items } = result.value
      const transformedPosts = transformLensPostsToLocal(items)
      
      if (transformedPosts.length > 0) {
        lastPostIdRef.current = transformedPosts[0].id
      }
      
      setPosts(transformedPosts)
      setLastRefreshTime(new Date())
      setNewPostsAvailable(false)
      
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError("Failed to fetch posts")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])
  
  const checkForNewPosts = useCallback(async () => {
    try {
      const result = await fetchPosts(client, {
        filter: {
          feeds: [
            {
              globalFeed: true,
            },
          ],
        },
      })
      
      if (result.isErr()) {
        return
      }
      
      const { items } = result.value
      const transformedPosts = transformLensPostsToLocal(items)
      
      // 检查是否有新帖子
      if (transformedPosts.length > 0 && transformedPosts[0].id !== lastPostIdRef.current) {
        setNewPostsAvailable(true)
      }
    } catch (err) {
      console.error("Error checking for new posts:", err)
    }
  }, [])
  
  const handleRefresh = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    loadPostsFromLens(true)
  }, [loadPostsFromLens])
  
  const handleLoadNewPosts = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    setNewPostsAvailable(false)
    loadPostsFromLens(true)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [loadPostsFromLens])

  //数据转换函数
  const transformLensPostsToLocal = (anyPosts: readonly AnyPost[]): Post[] => {
    return anyPosts
      .filter((anyPost): anyPost is LensPost => anyPost.__typename === 'Post')
      .map((lensPost) => {
        const content = extractContentFromMetadata(lensPost.metadata)
        const author = lensPost.author
        const stats = lensPost.stats
        
        // Get media if available
        const media = extractMedia(lensPost.metadata)
        
        // Get attachments
        const attachments = extractAttachments(lensPost.metadata)
        
        // Check if post has license to determine if it's original
        const isOriginal = checkIfOriginal(lensPost.metadata)
        
        return {
          id: lensPost.id,
          content,
          author: {
            handle: author.username?.localName || "unknown",
            displayName: author.metadata?.name || author.username?.localName || "Unknown User",
            avatar: author.metadata?.picture ? resolveUrl(author.metadata?.picture) : undefined,
            //依然是从URI中读一下头像
          },
          isOriginal,
          gatewayUrl: undefined,
          contentUri: lensPost.contentUri,
          likes: stats?.upvotes || 0,
          comments: stats?.comments || 0,
          isLiked: false,
          isFollowing: false,
          timestamp: formatTimestamp(lensPost.timestamp),
          media,
          attachments,
        }
      })
  }


  // 检查是否为原创内容（基于license属性）
  const checkIfOriginal = (metadata: any): boolean => {
    if (!metadata?.attributes) return false
    
    // 查找license属性
    const licenseAttr = metadata.attributes.find((attr: any) => attr.key === "license")
    return licenseAttr && licenseAttr.value && licenseAttr.value !== null && licenseAttr.value !== ""
  }

  //提取图片/视频链接
  const extractContentFromMetadata = (metadata: any): string => {
    if (!metadata) return "No content available"
    
    // Handle different metadata types
    switch (metadata.__typename) {
      case 'TextOnlyMetadata':
        return metadata.content || "No content available"
      case 'ArticleMetadata':
        return metadata.content || "No content available"
      case 'ImageMetadata':
        return metadata.content || "No content available"
      case 'VideoMetadata':
        return metadata.content || "No content available"
      case 'AudioMetadata':
        return metadata.content || "No content available"
      default:
        return "No content available"
    }
  }

  const extractAttachments = (metadata: any): Array<{ item: string; type: string }> => {
    if (!metadata) return []
    
    const attachments: Array<{ item: string; type: string }> = []
    
    // 只有特定的 metadata 类型才有 attachments
    if (metadata.__typename === 'ImageMetadata' || metadata.__typename === 'ArticleMetadata') {
      if (metadata.attachments && Array.isArray(metadata.attachments)) {
        metadata.attachments.forEach((att: any) => {
          if (att.item && att.type) {
            attachments.push({
              item: att.item,
              type: att.type
            })
          }
        })
      }
    }
    
    // 对于 ImageMetadata，也包含主图片
    if (metadata.__typename === 'ImageMetadata' && metadata.image) {
      const imageUrl = metadata.image.optimized?.uri || metadata.image.raw?.uri
      if (imageUrl) {
        // 将主图片添加到开头
        attachments.unshift({
          item: imageUrl,
          type: metadata.image.type || 'image/jpeg'
        })
      }
    }
    
    return attachments
  }

  const extractMedia = (metadata: any): { type: "image" | "text"; url?: string } => {
    if (!metadata) return { type: "text" }
    
    // Handle different metadata types
    switch (metadata.__typename) {
      case 'ImageMetadata':
        // 检查主图片
        if (metadata.image?.optimized?.uri) {
          return {
            type: "image",
            url: metadata.image.optimized.uri,
          }
        }
        // 如果没有optimized版本，尝试原始图片
        if (metadata.image?.raw?.uri) {
          return {
            type: "image",
            url: metadata.image.raw.uri,
          }
        }
        break
      case 'VideoMetadata':
        if (metadata.video?.optimized?.uri) {
          return {
            type: "image", // Show video thumbnail as image for now
            url: metadata.video.optimized.uri,
          }
        }
        if (metadata.video?.raw?.uri) {
          return {
            type: "image",
            url: metadata.video.raw.uri,
          }
        }
        break
      case 'ArticleMetadata':
        // 检查attachments中的图片
        if (metadata.attachments && metadata.attachments.length > 0) {
          const imageAttachment = metadata.attachments.find((att: any) => 
            att.type && att.type.startsWith('image/')
          )
          if (imageAttachment) {
            if (imageAttachment.item?.optimized?.uri) {
              return {
                type: "image",
                url: imageAttachment.item.optimized.uri,
              }
            }
            if (imageAttachment.item?.raw?.uri) {
              return {
                type: "image",
                url: imageAttachment.item.raw.uri,
              }
            }
          }
        }
        break
    }
    return { type: "text" }
  }


  //转换为相对时间
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return "Just now"
  }

  const handleLike = async (postId: string) => {
    if (!checkWalletConnection("点赞")) {
      return;
    }
    
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

      toast.success("Post liked successfully")
    } catch (error) {
      toast.error("Failed to like post")
    }
  }

  const handleFollow = async (handle: string) => {
    if (!checkWalletConnection("关注用户")) {
      return;
    }
    
    try {
      setPosts(
        posts.map((post) => (post.author.handle === handle ? { ...post, isFollowing: !post.isFollowing } : post)),
      )

      toast.success(`Successfully ${posts.find((p) => p.author.handle === handle)?.isFollowing ? "unfollowed" : "followed"} user`)
    } catch (error) {
      toast.error("Failed to follow/unfollow user")
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
    <TooltipProvider>
      <div className="max-w-2xl mx-auto space-y-6">
      {/* 新帖子提示 */}
      {newPostsAvailable && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <Button 
            onClick={handleLoadNewPosts}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg animate-bounce"
            size="sm"
          >
            <ChevronUp className="h-4 w-4 mr-1" />
            New posts available
          </Button>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Latest Fanworks</h1>
        <p className="text-gray-600">Discover amazing fanworks on global feed</p>
        
        {/* 第一条帖子上方的信息栏 */}
        {posts.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-4 text-sm">
            <div className="text-gray-400">
              Last updated: {lastRefreshTime.toLocaleTimeString()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 h-10"
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        )}
      </div>

      {posts.map((post) => (
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

            {/* 显示附件图片 */}
            {
              post.attachments.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {
                    post.attachments.map((p, index) => (
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
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </TooltipProvider>
  )
}