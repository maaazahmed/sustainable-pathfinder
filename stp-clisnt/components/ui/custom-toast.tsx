"use client"

import { useState } from "react"

import { useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react"
import { cva } from "class-variance-authority"
import { useToast } from "@/components/ui/use-toast"

const toastVariants = cva(
  "fixed flex items-center w-full max-w-sm p-4 mb-4 text-gray-500 bg-white rounded-lg shadow right-5 dark:text-gray-400 dark:bg-gray-800 transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "border-l-4 border-brand-blue",
        success: "border-l-4 border-green-500",
        error: "border-l-4 border-red-500",
        warning: "border-l-4 border-yellow-500",
      },
      position: {
        topRight: "top-5 right-5",
        topLeft: "top-5 left-5",
        bottomRight: "bottom-5 right-5",
        bottomLeft: "bottom-5 left-5",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "topRight",
    },
  },
)

interface CustomToastProps {
  message: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft"
}

export function showCustomToast({ message, type = "info", duration = 3000, position = "topRight" }: CustomToastProps) {
  const { toast } = useToast()

  let icon
  let variant
  let title

  switch (type) {
    case "success":
      icon = <CheckCircle className="w-5 h-5 text-green-500" />
      variant = "success"
      title = "Success"
      break
    case "error":
      icon = <XCircle className="w-5 h-5 text-red-500" />
      variant = "error"
      title = "Error"
      break
    case "warning":
      icon = <AlertCircle className="w-5 h-5 text-yellow-500" />
      variant = "warning"
      title = "Warning"
      break
    default:
      icon = <AlertCircle className="w-5 h-5 text-brand-blue" />
      variant = "default"
      title = "Information"
  }

  toast({
    title,
    description: message,
    variant: type === "error" ? "destructive" : "default",
    duration,
  })
}

export function CustomToast({ message, type = "info", duration = 3000, position = "topRight" }: CustomToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  let icon
  let variant:"default" | "success" | "error" | "warning"

  switch (type) {
    case "success":
      icon = <CheckCircle className="w-5 h-5 text-green-500" />
      variant = "success"
      break
    case "error":
      icon = <XCircle className="w-5 h-5 text-red-500" />
      variant = "error"
      break
    case "warning":
      icon = <AlertCircle className="w-5 h-5 text-yellow-500" />
      variant = "warning"
      break
    default:
      icon = <AlertCircle className="w-5 h-5 text-brand-blue" />
      variant = "default"
  }

  return (
    <div className={toastVariants({ variant, position })}>
      <div className="inline-flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={() => setIsVisible(false)}
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
