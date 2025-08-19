"use client";

import { Hash, X, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface TagFilterSidebarProps {
  availableTags: string[];
  selectedTags: string[];
  loading?: boolean;
  error?: string | null;
  onToggleTag: (tag: string) => void;
  onSelectOnly?: (tag: string) => void;
  onClear: () => void;
  onRefresh?: () => void;
}

export function TagFilterSidebar({
  availableTags,
  selectedTags,
  loading,
  error,
  onToggleTag,
  onSelectOnly,
  onClear,
  onRefresh,
}: TagFilterSidebarProps) {
  const t = useTranslations("feed");

  const grouped = groupTagsByInitial(availableTags);

  return (
    <aside className="hidden md:block w-72 shrink-0">
      <div className="sticky top-24 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">{t("smartFilter.title")}</div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-gray-400 hover:text-gray-600"
              title={t("tagSearch.refreshTags")}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>

        {error && (
          <div className="text-xs text-red-500">{t("tagSearch.tagsError")}</div>
        )}

        {/* Active chips */}
        {selectedTags.length > 0 && (
          <div className="bg-harbor-50 border border-harbor-100 rounded-lg p-2">
            <div className="text-xs text-gray-500 mb-2">
              {t("tagSearch.activeFilters") || "激活筛选"} ({selectedTags.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-harbor-100 text-harbor-700">
                  <Hash className="h-3 w-3" />
                  {tag}
                  <button onClick={() => onToggleTag(tag)} className="hover:text-harbor-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={onClear} className="h-7 px-2 text-xs">
                {t("tagSearch.clear")}
              </Button>
            </div>
          </div>
        )}

        {/* Tag list */}
        <div className="bg-white rounded-lg border border-gray-200">
          <details>
            <summary className="px-3 py-2 text-sm font-medium text-gray-700 flex items-center justify-between gap-2 cursor-pointer select-none list-none">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <span>{t("tagSearch.category")}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </summary>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {Object.keys(grouped).sort().map((initial) => (
                <div key={initial} className="mb-2">
                  <div className="px-2 py-1 text-[11px] uppercase tracking-widest text-gray-400">{initial}</div>
                  <ul className="space-y-1">
                    {grouped[initial].map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <li key={tag}>
                          <button
                            onClick={() => onToggleTag(tag)}
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded-md border text-sm transition text-left ${
                              active
                                ? "bg-harbor-600 text-white border-harbor-600"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <input type="checkbox" readOnly checked={active} className="h-4 w-4" />
                            <span className="truncate">#{tag}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </aside>
  );
}

function groupTagsByInitial(tags: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const sorted = [...tags].sort((a, b) => a.localeCompare(b));
  sorted.forEach((tag) => {
    const letter = (tag[0] || "#").toUpperCase();
    if (!result[letter]) result[letter] = [];
    result[letter].push(tag);
  });
  return result;
}


