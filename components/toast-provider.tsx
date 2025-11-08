"use client"

import { useToast } from "@/hooks/use-toast"
import { ToastProvider as Provider, ToastViewport } from "@/components/ui/toast"
import { Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast"

export function ToastProvider() {
  const { toasts } = useToast()

  return (
    <Provider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </Provider>
  )
}
