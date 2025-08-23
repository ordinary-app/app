import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Tag {
  name: string;
}

interface TagDisplayProps {
  tags: Tag[] | string[];
  onRemove?: (tagName: string) => void;
  showRemoveButton?: boolean;
  className?: string;
}

export function TagDisplay({ 
  tags, 
  onRemove, 
  showRemoveButton = false,
  className = ""
}: TagDisplayProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => {
        const tagName = typeof tag === 'string' ? tag : tag.name;
        
        return (
          <Badge
            key={`${tagName}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-normal bg-slate-50 dark:bg-slate-800 text-sm"
          >
            #{tagName}
            {showRemoveButton && onRemove && (
              <button 
                type="button" 
                onClick={() => onRemove(tagName)} 
                className="hover:text-red-500 dark:hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        );
      })}
    </div>
  );
}
