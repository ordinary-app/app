"use client";

import { Post } from "@lens-protocol/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useActionBar } from "@/contexts/action-bar-context";
import { usePostActionsButtons } from "@/hooks/post-actions/use-post-actions-buttons";
import { useFeedContext } from "@/contexts/feed-context";
import { ActionButton } from "./post-action-button";

export const PostActionsBar = ({ post }: { post: Post }) => {
  const { actionBarRef } = useActionBar();
  const { viewMode } = useFeedContext();
  const { likeButton, commentButton, bookmarkButton, shareButton } = usePostActionsButtons({ post });

  const rightButtons = [commentButton, likeButton];
  const leftButtons = [bookmarkButton, shareButton];

  if (viewMode === "masonry") {
    return (
      <TooltipProvider delayDuration={300}>
        <div ref={actionBarRef} className="flex items-center">
          <ActionButton
            key={likeButton.label}
            icon={likeButton.icon}
            label={likeButton.label}
            initialCount={likeButton.initialCount}
            strokeColor={likeButton.strokeColor}
            fillColor={likeButton.fillColor}
            onClick={likeButton.onClick}
            isActive={likeButton.isActive}
            isUserLoggedIn={likeButton.isUserLoggedIn}
            isDisabled={likeButton.isDisabled}
            className="h-6 px-1 min-h-[32px] min-w-[32px]"
          />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div ref={actionBarRef} className="flex items-center justify-between w-full border-t border-gray-100">
        {/* Left side - Interactive buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {leftButtons.map((button) => (
            <ActionButton
              key={button.label}
              icon={button.icon}
              label={button.label}
              initialCount={button.initialCount}
              strokeColor={button.strokeColor}
              fillColor={button.fillColor}
              onClick={button.onClick}
              isActive={button.isActive}
              isUserLoggedIn={button.isUserLoggedIn}
              isDisabled={button.isDisabled}
            />
          ))}
        </div>

        {/* Right side - Secondary actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {rightButtons.map((button) => (
            <ActionButton
              key={button.label}
              icon={button.icon}
              label={button.label}
              initialCount={button.initialCount}
              strokeColor={button.strokeColor}
              fillColor={button.fillColor}
              onClick={button.onClick}
              isActive={button.isActive}
              isUserLoggedIn={button.isUserLoggedIn}
              isDisabled={button.isDisabled}
              dropdownItems={button.dropdownItems}
              hideCount={button.hideCount}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};