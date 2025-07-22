"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

interface ToggleButtonProps {
  label: string
  value: boolean
  onValueChange: (value: boolean) => void
  icon?: React.ReactNode
  description?: string
  variant?: "default" | "success" | "warning"
}

export function ToggleButton({
  label,
  value,
  onValueChange,
  icon,
  description,
  variant = "default",
}: ToggleButtonProps) {
  const getVariantStyles = () => {
    if (value) {
      switch (variant) {
        case "success":
          return "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        case "warning":
          return "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
        default:
          return "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
      }
    }
    return "bg-background border-border text-muted-foreground hover:bg-accent"
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => onValueChange(!value)}
      className={`w-full h-auto p-4 justify-start ${getVariantStyles()}`}
    >
      <div className="flex items-start gap-3 w-full text-zinc-700">
        <div className="flex-shrink-0 mt-0.5">
          {value ? (
            <div className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center">
              <Check className="h-3 w-3" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-current/30" />
          )}
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            {icon}
            <Label className="cursor-pointer">{label}</Label>
          </div>
          {description && <p className="text-sm text-current/70 mt-1">{description}</p>}
        </div>

        <div className="text-xs opacity-60">{value ? "ON" : "OFF"}</div>
      </div>
    </Button>
  )
}
