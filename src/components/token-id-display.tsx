import { useTokenId } from "@/hooks/use-token-id";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, ExternalLink } from "lucide-react";
import { useAppConfigStore } from "@/stores/app-config-store";

interface TokenIdDisplayProps {
  uri: string | undefined;
  isOriginal: boolean;
  licenseType: string;
}

export function TokenIdDisplay({ uri, isOriginal, licenseType }: TokenIdDisplayProps) {
  const { tokenId, isLoading, error } = useTokenId(uri);
  const { explorerUrl, contractAddress } = useAppConfigStore();

  if (!isOriginal || !uri || licenseType!="token-bound-nft") {
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
              Token ID
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
              className="bg-[linear-gradient(135deg,#fdf6e3,#f5deb3)] text-neutral-800 w-auto h-5 mr-1 px-2 py-[2px] rounded-md border border-yellow-200 shadow-sm text-xs flex items-center gap-1"
            >
              Token ID
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
          {error ? `错误: ${error.message}` : '暂时无法获取，请稍后再试'}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <a 
          href={`${explorerUrl}nft/${contractAddress}/${tokenId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative focus:outline-none inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(`${explorerUrl}nft/${contractAddress}/${tokenId}`, '_blank');
          }}
        >
          <Badge
            variant="secondary"
            className="bg-[linear-gradient(135deg,#fdf6e3,#f5deb3)] text-neutral-800 w-auto h-5 mr-1 px-2 py-[2px] rounded-md border border-yellow-200 shadow-sm text-xs flex items-center gap-1 cursor-pointer hover:shadow-md transition-shadow"
          >
            Token ID: {tokenId}
            <ExternalLink className="h-3 w-3" />
          </Badge>
        </a>
      </TooltipTrigger>
      {/*<TooltipContent
        className="z-[9999] border border-yellow-200 rounded-md text-xs font-medium text-neutral-800 px-3 py-1 shadow-md"
        sideOffset={3}
        side="right"
        style={{
          background: 'linear-gradient(135deg, #fdf6e3, #f5deb3)',
        }}
      >
        点击查看 NFT 详情
      </TooltipContent>*/}
    </Tooltip>
  );
} 