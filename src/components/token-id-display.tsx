import { useTokenId } from "@/hooks/use-token-id";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface TokenIdDisplayProps {
  uri: string | undefined;
  isOriginal: boolean;
}

export function TokenIdDisplay({ uri, isOriginal }: TokenIdDisplayProps) {
  const { tokenId, isLoading, error } = useTokenId(uri);

  if (!isOriginal || !uri) {
    return null;
  }

  if (isLoading) {
    return (
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
            <Badge
              variant="secondary"
              className="bg-[linear-gradient(135deg,#fdf6e3,#f5deb3)] text-neutral-800 w-auto h-5 mr-1 px-2 py-[2px] rounded-md border border-yellow-200 shadow-sm text-xs flex items-center gap-1"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading...
            </Badge>
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="z-[9999] border border-yellow-200 rounded-md text-xs font-medium text-neutral-800 px-3 py-1 shadow-md"
          sideOffset={3}
          side="right"
          style={{
            background: 'linear-gradient(135deg, #fdf6e3, #f5deb3)',
          }}
        >
          正在查询 token ID...
        </TooltipContent>
      </Tooltip>
    );
  }

  if (error || tokenId === undefined) {
    return (
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
            <Badge
              variant="secondary"
              className="bg-[linear-gradient(135deg,#fdf6e3,#f5deb3)] text-neutral-800 w-auto h-5 mr-1 px-2 py-[2px] rounded-md border border-yellow-200 shadow-sm text-xs"
            >
              Original
            </Badge>
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="z-[9999] border border-yellow-200 rounded-md text-xs font-medium text-neutral-800 px-3 py-1 shadow-md"
          sideOffset={3}
          side="right"
          style={{
            background: 'linear-gradient(135deg, #fdf6e3, #f5deb3)',
          }}
        >
          无法获取 token ID
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
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
          <Badge
            variant="secondary"
            className="bg-[linear-gradient(135deg,#fdf6e3,#f5deb3)] text-neutral-800 w-auto h-5 mr-1 px-2 py-[2px] rounded-md border border-yellow-200 shadow-sm text-xs"
          >
            Original
          </Badge>
        </button>
      </TooltipTrigger>
      <TooltipContent
        className="z-[9999] border border-yellow-200 rounded-md text-xs font-medium text-neutral-800 px-3 py-1 shadow-md"
        sideOffset={3}
        side="right"
        style={{
          background: 'linear-gradient(135deg, #fdf6e3, #f5deb3)',
        }}
      >
        薯条 token id = {tokenId}
      </TooltipContent>
    </Tooltip>
  );
} 