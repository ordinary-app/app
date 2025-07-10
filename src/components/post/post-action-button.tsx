"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type ActionButtonProps = {
  icon: any;
  label: string;
  initialCount: number;
  strokeColor: string;
  fillColor: string;
  isActive?: boolean;
  onClick?: () => Promise<any> | undefined;
  isDisabled?: boolean;
  isUserLoggedIn?: boolean;
  dropdownItems?: {
    icon: any;
    label: string;
    onClick: () => void;
  }[];
  hideCount?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "secondary";
};

const formatNumber = (num: number): string => {
  if (num === 0 || !num) return "";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return num.toString();
};

export const ActionButton = ({
  icon: Icon,
  label,
  initialCount,
  strokeColor,
  fillColor,
  isActive = false,
  onClick,
  isDisabled = false,
  isUserLoggedIn,
  dropdownItems,
  hideCount = false,
  className,
  size = "sm",
  variant = "ghost",
}: ActionButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const showLoginActions = !isUserLoggedIn;
  const formattedCount = formatNumber(initialCount);

  const handleClick = async () => {
    if (showLoginActions) {
      // TODO: Show login modal
      console.log("Login required");
      return;
    }

    if (isDisabled || !onClick) return;
    try {
      await onClick();
    } catch (error) {
      console.error(`Action button "${label}" failed:`, error);
    }
  };

  const iconColor = isDisabled
    ? "rgb(156, 163, 175)" // gray-400
    : isActive
      ? strokeColor
      : isHovered
        ? strokeColor
        : "rgb(107, 114, 128)"; // gray-500

  const iconFill = isActive ? fillColor : undefined;

  const MainButton = (
    <Button
      variant={variant}
      size={size}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "flex items-center gap-1 transition-all duration-200 text-foreground hover:bg-transparent relative p-2 h-auto min-w-fit",
        isActive && "text-current",
        className
      )}
      style={{
        color: iconColor,
        backgroundColor: isActive ? `${strokeColor}15` : undefined,
      }}
    >
      <Icon
        size={18}
        strokeWidth={1.5}
        className="transition-all duration-200"
        style={{
          color: iconColor,
          fill: iconFill,
        }}
      />
      {!hideCount && formattedCount && (
        <span className="text-xs font-medium ml-1 min-w-fit">
          {formattedCount}
        </span>
      )}
    </Button>
  );

  const TooltipWrapper = ({ children }: { children: React.ReactNode }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (dropdownItems && dropdownItems.length > 0) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div>
            <TooltipWrapper>{MainButton}</TooltipWrapper>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top">
          {dropdownItems.map((item) => (
            <DropdownMenuItem 
              key={item.label} 
              onClick={item.onClick} 
              className="gap-2 cursor-pointer"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <TooltipWrapper>{MainButton}</TooltipWrapper>;
};