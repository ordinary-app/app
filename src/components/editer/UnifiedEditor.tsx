"use client"

import type React from "react"
import { useState, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Bold, Italic, Underline, Strikethrough, Link, AtSign, MessageSquare,
  Plus, X, Search, Expand, Globe, TrendingUp, Users, RefreshCw
} from "lucide-react"
import { TagDisplay } from "@/components/ui/tag-display"
import { useTagsWithStats, useTagSort } from "@/hooks/use-tags"
import { useTranslations } from "next-intl"

// Types
interface Tag {
  name: string
  postCount?: number
  userCount?: number
}

interface UnifiedEditorProps {
  title: string
  onTitleChange: (title: string) => void
  content: string
  onContentChange: (content: string) => void
  tags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  isExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

interface SortOption {
  key: 'name' | 'postCount' | 'userCount'
  label: string
  icon: React.ComponentType<any>
}

// Constants
const SORT_OPTIONS: SortOption[] = [
  { key: 'name', label: 'tagModal.sortBy.name', icon: Bold },
  { key: 'postCount', label: 'tagModal.sortBy.postCount', icon: TrendingUp },
  { key: 'userCount', label: 'tagModal.sortBy.userCount', icon: Users },
]

const FORMAT_OPTIONS = [
  { format: "bold", icon: Bold },
  { format: "italic", icon: Italic },
  { format: "underline", icon: Underline },
  { format: "strikethrough", icon: Strikethrough },
  { format: "link", icon: Link },
  { format: "mention", icon: AtSign },
  { format: "globe", icon: Globe },
  { format: "messageSquare", icon: MessageSquare },
]

// Sub-components
const TitleInput = ({
  title,
  onTitleChange,
  titleRef,
  t
}: {
  title: string
  onTitleChange: (title: string) => void
  titleRef: React.RefObject<HTMLTextAreaElement>
  t: any
}) => {
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    onTitleChange(value)

    // Auto-resize
    if (titleRef.current) {
      titleRef.current.style.height = "auto"
      titleRef.current.style.height = titleRef.current.scrollHeight + "px"
    }
  }, [onTitleChange, titleRef])

  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-dashed">
      <textarea
        ref={titleRef}
        placeholder={t("title")}
        value={title}
        onChange={handleTitleChange}
        className="flex-1 resize-none border-none outline-none bg-transparent placeholder-gray-400 text-base"
        rows={1}
        maxLength={30}
      />
      <div className="flex gap-1 text-xs text-muted-foreground">
        {title.length}/30
        <div className="text-destructive">*</div>
      </div>
    </div>
  )
}

const ContentInput = ({
  content,
  onContentChange,
  contentRef,
  t
}: {
  content: string
  onContentChange: (content: string) => void
  contentRef: React.RefObject<HTMLTextAreaElement>
  t: any
}) => {
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    onContentChange(value)

    // Auto-resize
    if (contentRef.current) {
      contentRef.current.style.height = "auto"
      contentRef.current.style.height = contentRef.current.scrollHeight + "px"
    }
  }, [onContentChange, contentRef])

  return (
    <div className="px-4 py-2.5">
      <textarea
        ref={contentRef}
        placeholder={t("content")}
        value={content}
        onChange={handleContentChange}
        className="w-full text-gray-700 resize-none border-none outline-none bg-transparent placeholder-gray-400 text-sm dark:text-gray-300"
        rows={5}
        maxLength={5000}
      />
      <div className="text-right text-xs text-muted-foreground">
        {content.length}/5000
      </div>
    </div>
  )
}

const EditorTagDisplay = ({
  tags,
  onRemove,
  t
}: {
  tags: Tag[]
  onRemove: (tagName: string) => void
  t: any
}) => {
  if (tags.length === 0) return null

  return (
    <div className="px-4 py-2 border-t border-none">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={`${tag.name}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-zinc-100 text-zinc-900 font-normal bg-slate-50"
          >
            {t("tagModal.tagPrefix")}{tag.name}
            <button
              type="button"
              onClick={() => onRemove(tag.name)}
              className="hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}

const TagModal = ({
  showTagModal,
  setShowTagModal,
  tagInput,
  setTagInput,
  selectedTags,
  setSelectedTags,
  onTagsChange,
  t
}: {
  showTagModal: boolean
  setShowTagModal: (show: boolean) => void
  tagInput: string
  setTagInput: (input: string) => void
  selectedTags: Tag[]
  setSelectedTags: (tags: Tag[]) => void
  onTagsChange: (tags: Tag[]) => void
  t: any
}) => {
  const { tags: availableTags, loading: loadingTags, refresh } = useTagsWithStats()
  const [sortBy, setSortBy] = useState<'name' | 'postCount' | 'userCount'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const { sortedTags } = useTagSort(availableTags, sortBy, sortOrder)

  // Memoized values
  const filteredTags = useMemo(() => {
    if (!tagInput.trim()) return []
    const searchTerm = tagInput.toLowerCase()
    return sortedTags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm)
    )
  }, [tagInput, sortedTags])

  const isTagExists = useCallback((tagName: string) => {
    return availableTags.find((t) => t.name.toLowerCase() === tagName.toLowerCase())
  }, [availableTags])

  // Event handlers
  const handleSort = useCallback((newSortBy: 'name' | 'postCount' | 'userCount') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }, [sortBy, sortOrder])

  const getSortIcon = useCallback((sortType: 'name' | 'postCount' | 'userCount') => {
    if (sortBy !== sortType) return null
    return sortOrder === 'asc' ? '↑' : '↓'
  }, [sortBy, sortOrder])

  const addTagToSelection = useCallback((tag: Tag) => {
    const normalizedTag = {
      ...tag,
      name: tag.name.toLowerCase()
    }

    if (!selectedTags.find((t) => t.name === normalizedTag.name)) {
      setSelectedTags([...selectedTags, normalizedTag])
    }
  }, [selectedTags, setSelectedTags])

  const removeTagFromSelection = useCallback((tagName: string) => {
    setSelectedTags(selectedTags.filter((t) => t.name !== tagName.toLowerCase()))
  }, [selectedTags, setSelectedTags])

  const saveSelectedTags = useCallback(() => {
    const newTags = [...selectedTags]
    onTagsChange(newTags)
    setSelectedTags([])
    setTagInput("")
    setShowTagModal(false)
  }, [selectedTags, onTagsChange, setSelectedTags, setTagInput, setShowTagModal])

  const renderSortButton = useCallback((option: SortOption) => (
    <Button
      key={option.key}
      type="button"
      variant={sortBy === option.key ? 'default' : 'outline'}
      size="sm"
      onClick={() => handleSort(option.key)}
      className="h-8 px-3 text-xs"
    >
      {t(option.label)} {getSortIcon(option.key)}
    </Button>
  ), [sortBy, handleSort, getSortIcon, t])

  const renderTagSuggestion = useCallback((tag: Tag, index: number) => {
    const isSelected = selectedTags.find((t) => t.name === tag.name)

    return (
      <button
        key={`suggestion-${tag.name}-${index}`}
        type="button"
        onClick={() => addTagToSelection(tag)}
        disabled={isSelected !== undefined}
        className="w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-800 font-medium">{t("tagModal.tagPrefix")}</span>
          <span className="text-teal-500 font-medium">{tag.name}</span>
        </div>
        <div className="flex flex-col items-end text-xs text-gray-400">
          <span>{tag.postCount || 0} {t("tagModal.postCount")}</span>
          <span>{tag.userCount || 0} {t("tagModal.userCount")}</span>
        </div>
      </button>
    )
  }, [selectedTags, addTagToSelection, t])

  return (
    <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{t("tagModal.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder={t("tagModal.searchPlaceholder")}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Selected Tags Preview */}
          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{t("tagModal.selectedTags")}</p>
              <TagDisplay
                tags={selectedTags}
                onRemove={removeTagFromSelection}
                showRemoveButton={true}
                className="border text-zinc-700 bg-zinc-50 border-black text-sm font-medium"
              />
            </div>
          )}

          {/* Tag Suggestions */}
          {tagInput.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {loadingTags ? t("tagModal.loadingTags") : t("tagModal.searchResults")}
              </p>

              {/* Sort Buttons */}
              <div className="flex gap-2 items-center">
                {SORT_OPTIONS.map(renderSortButton)}

                {/* Refresh Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refresh()}
                  disabled={loadingTags}
                  className="h-8 px-3 text-xs ml-auto"
                >
                  <RefreshCw className={`h-3 w-3 ${loadingTags ? 'animate-spin' : ''}`} />
                  {loadingTags ? t("tagModal.loadingTags") : t("tagModal.refresh")}
                </Button>
              </div>

              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                {loadingTags ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-gray-500">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{t("tagModal.loadingTags")}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {filteredTags.map((tag, index) => renderTagSuggestion(tag, index))}

                    {/* Create new tag option */}
                    {tagInput.length > 0 && !isTagExists(tagInput) && (
                      <button
                        type="button"
                        onClick={() => addTagToSelection({ name: tagInput.toLowerCase() })}
                        disabled={selectedTags.find((t) => t.name === tagInput.toLowerCase()) !== undefined}
                        className="w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 flex items-center justify-between border-t border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800 font-medium">{t("tagModal.tagPrefix")}</span>
                          <span className="font-medium text-zinc-700">{tagInput.toLowerCase()}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{t("tagModal.createNewTag")}</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setShowTagModal(false)}>
              {t("tagModal.cancel")}
            </Button>
            <Button
              type="button"
              onClick={saveSelectedTags}
              disabled={selectedTags.length === 0}
              className="harbor-button"
            >
              {t("tagModal.saveTags")} ({selectedTags.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const FormatToolbar = ({ t }: { t: any }) => {
  const formatText = useCallback((format: string) => {
    // This would implement text formatting logic
    console.log(`Format: ${format}`)
  }, [])

  return (
    <div className="px-4 py-1 border-t border-gray-100 bg-gray-50 leading-3 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        {/* Left: Formatting Tools */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {FORMAT_OPTIONS.map(({ format, icon: Icon }) => (
            <Button
              key={format}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText(format)}
              className="p-1 h-8 w-8"
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="p-1 h-8 w-8"
          >
            <Expand className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: Status and Collapse */}
        <div className="flex items-center space-x-3">
        </div>
      </div>
    </div>
  )
}

// Main component
export function UnifiedEditor({
  title,
  onTitleChange,
  content,
  onContentChange,
  tags,
  onTagsChange,
  isExpanded = false,
  onExpandedChange,
}: UnifiedEditorProps) {
  const t = useTranslations("editor")

  // State
  const [showTagModal, setShowTagModal] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [tagInput, setTagInput] = useState("")

  // Refs
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Event handlers
  const removeTag = useCallback((tagName: string) => {
    onTagsChange(tags.filter((t) => t.name !== tagName.toLowerCase()))
  }, [tags, onTagsChange])

  const openTagModal = useCallback(() => {
    setSelectedTags([])
    setTagInput("")
    setShowTagModal(true)
  }, [])

  return (
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <TitleInput
        title={title}
        onTitleChange={onTitleChange}
        titleRef={titleRef}
        t={t}
      />

      <ContentInput
        content={content}
        onContentChange={onContentChange}
        contentRef={contentRef}
        t={t}
      />

      <EditorTagDisplay
        tags={tags}
        onRemove={removeTag}
        t={t}
      />

      {/* Tag Input Section */}
      <div className="px-4 py-2 border-t border-gray-100 border-none">
        <button
          type="button"
          onClick={openTagModal}
          className="flex items-center gap-2 p-3 rounded-lg border-gray-300 hover:border-gray-400 transition-colors text-gray-600 hover:text-gray-700 border w-fit border-solid py-1 px-1.5 dark:text-gray-300 dark:hover:text-gray-200 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">{t("addTag")}</span>
        </button>
      </div>

      <TagModal
        showTagModal={showTagModal}
        setShowTagModal={setShowTagModal}
        tagInput={tagInput}
        setTagInput={setTagInput}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        onTagsChange={onTagsChange}
        t={t}
      />

      <FormatToolbar t={t} />
    </div>
  )
}