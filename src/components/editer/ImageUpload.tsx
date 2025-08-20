"use client"

import type React from "react"
import { useState, useRef } from "react"
//import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, GripVertical } from "lucide-react"
import { ImageWithFallback } from "./ImageWithFallback"

interface UploadedImage {
  id: string
  name: string
  size: number
  type: string
  url?: string
  file: File
}

interface ImageUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  required?: boolean
  url?: string;
}

export function ImageUpload({ images, onImagesChange, maxImages = 12 }: ImageUploadProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null)
  const [touchPosition, setTouchPosition] = useState({
    x: 0,
    y: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList) => {
    const newImages: UploadedImage[] = []
    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`文件 ${file.name} 超过8MB限制`)
        return
      }
      if (!file.type.startsWith("image/")) {
        alert(`文件 ${file.name} 不是图片格式`)
        return
      }
      const imageId = Math.random().toString(36).substring(7)
      const url = URL.createObjectURL(file)
      newImages.push({
        id: imageId,
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        file,
      })
    })

    const totalImages = images.length + newImages.length
    if (totalImages > maxImages) {
      alert(`最多只能上传 ${maxImages} 张图片`)
      return
    }

    onImagesChange([...images, ...newImages])
  }

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id)
    onImagesChange(updatedImages)
  }

  // 桌面端拖拽处理
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null) return
    if (draggedIndex !== index) {
      const newImages = [...images]
      const draggedImage = newImages[draggedIndex]
      newImages.splice(draggedIndex, 1)
      newImages.splice(index, 0, draggedImage)
      onImagesChange(newImages)
      setDraggedIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // 移动端触摸处理
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0]
    setTouchStartIndex(index)
    setTouchPosition({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault() // 防止滚动
    if (touchStartIndex === null) return

    const touch = e.touches[0]
    const touchElement = document.elementFromPoint(touch.clientX, touch.clientY)
    const targetElement = touchElement?.closest("[data-image-index]") as HTMLElement

    if (targetElement) {
      const targetIndex = Number.parseInt(targetElement.dataset.imageIndex || "-1")
      if (targetIndex >= 0 && targetIndex !== touchStartIndex) {
        const newImages = [...images]
        const draggedImage = newImages[touchStartIndex]
        newImages.splice(touchStartIndex, 1)
        newImages.splice(targetIndex, 0, draggedImage)
        onImagesChange(newImages)
        setTouchStartIndex(targetIndex)
      }
    }
  }

  const handleTouchEnd = () => {
    setTouchStartIndex(null)
  }

  return (
    <div className="space-y-4">

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            已上传 {images.length} 张图片
            <span className="hidden sm:inline">(拖拽调整顺序)</span>
            <span className="sm:hidden">(长按拖动调整顺序)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                data-image-index={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`relative group touch-none border rounded-lg overflow-hidden aspect-square ${
                  draggedIndex === index || touchStartIndex === index ? "opacity-50 scale-95" : ""
                } transition-all duration-200`}
              >
                <ImageWithFallback
                  src={image.url || "/placeholder.svg"}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                {/* 拖拽手柄 */}
                <div className="absolute top-2 left-2 p-1 bg-black/60 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-3 w-3" />
                </div>
                {/* 删除按钮 */}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <X className="h-3 w-3" />
                </button>
                {/* 文件名显示 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 text-white text-xs">
                    <span className="truncate">{image.name}</span>
                  </div>
                </div>
                {/* 序号显示 */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-zinc-800 text-white rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-gray-400 transition-colors border md:px-3.5 md:py-3.5 dark:border-gray-200 dark:hover:border-gray-500">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-2 rounded-lg hover:bg-accent transition-colors py-2.5"
        >
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-100" />
            <p className="text-sm md:text-sm text-gray-500 dark:text-gray-100">点击上传图片 (可选)</p>
            <p className="text-xs text-gray-500 dark:text-gray-100">支持 PNG、JPG 格式，单个文件不超过 8MB，最多 {maxImages} 张</p>
          </div>
        </button>
      </div>
    </div>
  )
}
