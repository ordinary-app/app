"use client";

import { Post } from "@lens-protocol/client";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { usePostActions } from "@/hooks/post-actions/use-post-actions";

export type ActionButtonConfig = {
  icon: any;
  label: string;
  initialCount: number;
  strokeColor: string;
  fillColor: string;
  isActive?: boolean;
  shouldIncrementOnClick: boolean;
  onClick?: () => Promise<any> | undefined;
  isDisabled?: boolean;
  hideCount?: boolean;
  isUserLoggedIn?: boolean;
  dropdownItems?: {
    icon: any;
    label: string;
    onClick: () => void;
  }[];
};

export type PostActionButtons = {
  likeButton: ActionButtonConfig;
  commentButton: ActionButtonConfig;
  bookmarkButton: ActionButtonConfig;
  shareButton: ActionButtonConfig;
};

export const usePostActionsButtons = ({ post }: { post: Post }): PostActionButtons => {
  const {
    handleComment,
    handleBookmark,
    handleLike,
    isCommentSheetOpen,
    stats,
    operations,
    isLoggedIn,
  } = usePostActions(post);

  const likes = stats?.upvotes || 0;
  const comments = stats?.comments || 0;
  const bookmarks = stats?.bookmarks || 0;

  const hasUpvoted = operations?.hasUpvoted || false;
  const hasBookmarked = operations?.hasBookmarked || false;

  const buttons: PostActionButtons = {
    likeButton: {
      icon: Heart,
      label: "Like",
      initialCount: likes,
      strokeColor: "rgb(239, 68, 68)", // red-500
      fillColor: "rgba(239, 68, 68, 0.9)",
      onClick: handleLike,
      isActive: hasUpvoted,
      shouldIncrementOnClick: true,
      isDisabled: false,
      isUserLoggedIn: isLoggedIn,
    },
    commentButton: {
      icon: MessageCircle,
      label: "Comment",
      initialCount: comments,
      strokeColor: "rgb(59, 130, 246)", // blue-500
      fillColor: "rgba(59, 130, 246, 0.8)",
      onClick: () => handleComment(false),
      shouldIncrementOnClick: false,
      isActive: isCommentSheetOpen,
      isDisabled: false,
      isUserLoggedIn: true,
    },
    bookmarkButton: {
      icon: Bookmark,
      label: "Bookmark",
      isActive: hasBookmarked,
      initialCount: bookmarks,
      strokeColor: "rgb(16, 185, 129)", // emerald-500
      fillColor: "rgba(16, 185, 129, 0.8)",
      shouldIncrementOnClick: true,
      onClick: handleBookmark,
      isDisabled: false,
      isUserLoggedIn: isLoggedIn,
    },
    shareButton: {
      icon: Share2,
      label: "Share",
      isActive: false,
      initialCount: 0,
      strokeColor: "rgb(107, 114, 128)", // gray-500
      fillColor: "rgba(107, 114, 128, 0.8)",
      shouldIncrementOnClick: false,
      hideCount: true,
      isUserLoggedIn: true,
      dropdownItems: [
        {
          icon: Share2,
          label: "Copy Link",
          onClick: () => {
            // TODO: Implement copy link functionality
            console.log("Copy link clicked");
          },
        },
      ],
    },
  };

  return buttons;
};