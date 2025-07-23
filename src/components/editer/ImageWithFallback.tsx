"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
}

export function ImageWithFallback({ src, alt, className }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
}
