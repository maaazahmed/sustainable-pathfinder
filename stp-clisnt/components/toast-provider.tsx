"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { CustomToast } from "@/components/ui/custom-toast"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
  position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft"
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (
    message: string,
    type?: ToastType,
    duration?: number,
    position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft",
  ) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration = 3000,
    position: "topRight" | "topLeft" | "bottomRight" | "bottomLeft" = "topRight"
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, message, type, duration, position }
    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto-remove toast after duration
    setTimeout(() => {
      hideToast(id)
    }, duration)
  }

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <CustomToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            position={toast.position}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToastCustom() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
