"use client"
import { useState, useEffect } from "react"
import { AlertCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  description?: string
  type?: "info" | "warning" | "error" | "success"
  duration?: number
  onClose?: () => void
  show: boolean
}

export function Toast({ message, description, type = "warning", duration = 4000, onClose, show }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setTimeout(() => setIsAnimating(true), 10) // Small delay for animation

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, duration)

        return () => clearTimeout(timer)
      }
    }
  }, [show, duration])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300) // Match animation duration
  }

  const getToastStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "warning":
      default:
        return "bg-amber-50 border-amber-200 text-amber-800"
    }
  }

  const getIconColor = () => {
    switch (type) {
      case "error":
        return "text-red-600"
      case "success":
        return "text-green-600"
      case "info":
        return "text-blue-600"
      case "warning":
      default:
        return "text-amber-600"
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div
        className={`
          max-w-md w-full p-4 rounded-lg border shadow-lg transition-all duration-300 ease-out
          ${getToastStyles()}
          ${isAnimating ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${getIconColor()}`} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{message}</p>
            {description && <p className="text-xs mt-1 opacity-90">{description}</p>}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className={`flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors ${getIconColor()}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
