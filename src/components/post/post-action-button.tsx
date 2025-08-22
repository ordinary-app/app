"use client";

import { ReactElement, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthCheck } from "@/hooks/auth/use-auth-check";
import { useTheme } from "next-themes";

export type DropdownItem = {
  icon: any;
  label: string;
  onClick: () => void;
};

export type ActionButtonProps = {
  icon: any;
  label: string;
  initialCount: number;
  strokeColor: string;
  fillColor: string;
  isActive?: boolean;
  onClick?: () => Promise<any> | undefined | undefined;
  renderPopover?: (trigger: ReactElement) => ReactElement;
  isDisabled?: boolean;
  isUserLoggedIn?: boolean;
  dropdownItems?: DropdownItem[];
  hideCount?: boolean;
  className?: string;
  showChevron?: boolean;
  fillOnHover?: boolean;
  fillOnClick?: boolean;
};

const TooltipWrapper = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" className="bg-foreground text-background text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  if (!num) return "";
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
  renderPopover,
  isDisabled = false,
  isUserLoggedIn,
  dropdownItems,
  hideCount = false,
  className,
  showChevron = false,
  fillOnClick = true,
}: ActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { checkAuthentication } = useAuthCheck();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const showLoginActions = !isUserLoggedIn;
  const formattedCount = formatNumber(initialCount);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (showLoginActions) {
      if (!checkAuthentication(label)) {
        return;
      }
    }

    if (isDisabled || !onClick) return;
    try {
      await onClick();
    } catch (error) {
      console.error(`Action button "${label}" failed:`, error);
    }
  };

  // dark: gray-200, light: gray-600
  const baseGray = isDarkMode ? "#E5E7EB" : "#4B5563"; 
  let iconStyleColor: string | undefined;
  let iconStyleFill: string | undefined;
  let iconOpacityStyle: number | undefined;
  let buttonBgStyle: string | undefined;
  let divCursorStyle: string | undefined;
  let divOpacityClass: string | undefined;

  if (showLoginActions) {
    iconStyleColor = isHovered ? strokeColor : baseGray;
    iconStyleFill = undefined;
    iconOpacityStyle = 1;
    buttonBgStyle = undefined;
    divCursorStyle = "cursor-pointer";
    divOpacityClass = "";
  } else {
    iconStyleColor = isDisabled
      ? baseGray
      : isActive
        ? strokeColor
        : isHovered
          ? strokeColor
          : baseGray;
    iconStyleFill = isDisabled ? undefined : isActive && fillOnClick ? fillColor : undefined;
    iconOpacityStyle = isDisabled ? 0.5 : 1;
    buttonBgStyle = isActive ? `${strokeColor}10` : undefined;
    divCursorStyle = isDisabled ? "cursor-not-allowed" : "cursor-pointer";
    divOpacityClass = isDisabled ? "opacity-70" : "";
  }

  const iconProps = {
    size: 18,
    strokeWidth: 2,
    className: "transition-all duration-200",
    style: {
      color: iconStyleColor,
      fill: iconStyleFill,
      opacity: iconOpacityStyle,
    },
  };

  const MainButton = (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "flex items-center touch-manipulation min-h-[44px] min-w-[44px]",
        className
      )}
      style={{
        color: iconStyleColor,
        backgroundColor: buttonBgStyle,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <Icon {...iconProps} />
      {!(label === "Bookmark" || label === "Share") && formattedCount && (
        <span className="text-xs font-bold ml-1 min-w-fit">
          {formattedCount}
        </span>
      )}
    </Button>
  );

  const divWrapperClassName = cn(
    "group flex items-center touch-manipulation",
    divCursorStyle,
    divOpacityClass,
    className
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
          <div
            className={divWrapperClassName}
            style={{ backgroundColor: buttonBgStyle }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
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

  return (
    <div
      className={divWrapperClassName}
      style={{ backgroundColor: buttonBgStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <TooltipWrapper>{MainButton}</TooltipWrapper>
    </div>
  );
};