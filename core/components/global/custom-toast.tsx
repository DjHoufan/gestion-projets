"use client"

import React from "react"

import { CheckCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react"
import { toast as sonnerToast } from "sonner"
import { cn } from "@/core/lib/utils"

type ToastType = "success" | "error" | "warning" | "info"

const toastStyles: Record<
  ToastType,
  {
    icon: React.ElementType
    gradient: string
    shadow: string
    hoverShadow: string
  }
> = {
  success: {
    icon: CheckCircle,
    gradient: "bg-gradient-to-r from-emerald-500 to-green-500",
    shadow: "shadow-emerald-500/25",
    hoverShadow: "hover:shadow-emerald-500/40",
  },
  error: {
    icon: ShieldAlert,
    gradient: "bg-gradient-to-r from-red-500 to-rose-500",
    shadow: "shadow-red-500/25",
    hoverShadow: "hover:shadow-red-500/40",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/25",
    hoverShadow: "hover:shadow-amber-500/40",
  },
  info: {
    icon: Info,
    gradient: "bg-gradient-to-r from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/25",
    hoverShadow: "hover:shadow-blue-500/40",
  },
}

type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

interface CustomToastProps {
  message: string
  position?: ToastPosition
  duration?: number
  [key: string]: any
}

// Add this ToastContent component before the createToast function
const ToastContent = ({
  type,
  message,
  duration,
  onDismiss,
}: {
  type: ToastType
  message: string
  duration: number
  onDismiss: () => void
}) => {
  const [isPaused, setIsPaused] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = React.useRef(Date.now())
  const remainingTimeRef = React.useRef(duration)

  React.useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        onDismiss()
      }, remainingTimeRef.current)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        remainingTimeRef.current = remainingTimeRef.current - (Date.now() - startTimeRef.current)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isPaused, onDismiss])

  const handleMouseEnter = () => {
    setIsPaused(true)
    startTimeRef.current = Date.now()
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
    startTimeRef.current = Date.now()
  }

  const { icon: Icon, gradient, shadow, hoverShadow } = toastStyles[type]

  return (
    <div
      className={cn(
        "relative w-full max-w-xs overflow-hidden rounded-lg z-[9999999999999999999999]",
        gradient,
        "shadow-2xl",
        shadow,
        "transform transition-all duration-300 ease-out slide-in-from-right-full",
        "hover:shadow-3xl hover:scale-105",
        hoverShadow,
        "border border-white/20 group",
      )}
      style={{
        animation: "slide-in-from-right-full 0.3s ease-out",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 rounded-lg" />
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full animate-ping" />
        <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute bottom-4 left-8 w-1 h-1 bg-white/50 rounded-full animate-bounce" />
      </div>
      <div className="relative flex items-center gap-3 p-4">
        <Icon className="h-5 w-5 text-white drop-shadow-sm flex-shrink-0" />
        <p className="flex-1 text-white font-medium text-sm leading-relaxed drop-shadow-sm">{message}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-lg overflow-hidden">
        <div
          className={cn("h-full bg-white/60 rounded-b-lg transition-all duration-100")}
          style={{
            animation: `progress ${duration}ms linear forwards`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        />
      </div>
    </div>
  )
}

// Replace the createToast function with this:
const createToast = (
  type: ToastType,
  { message, position = "top-right", duration = 5000, ...props }: CustomToastProps,
) => {
  return sonnerToast.custom(
    (t) => <ToastContent type={type} message={message} duration={duration} onDismiss={() => sonnerToast.dismiss(t)} />,
    {
      position,
      duration,
      ...props,
    },
  )
}

export const toast = {
  success: (opts: CustomToastProps) => createToast("success", opts),
  error: (opts: CustomToastProps) => createToast("error", opts),
  warning: (opts: CustomToastProps) => createToast("warning", opts),
  info: (opts: CustomToastProps) => createToast("info", opts),
}
