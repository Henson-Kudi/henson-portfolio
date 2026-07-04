"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

// Reusable slide-in editor drawer (matches the design's right-hand drawer).
export function Drawer({
  open,
  title,
  onClose,
  footer,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(680px,94vw)] flex-col border-l border-border bg-background transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h3 className="font-serif text-xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2.5 border-t border-border px-6 py-4">
            {footer}
          </div>
        )}
      </aside>
    </>
  )
}
