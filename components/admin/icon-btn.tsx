"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function IconBtn({
  children,
  title,
  on,
  onClick,
}: {
  children: ReactNode
  title: string
  on?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded border transition-colors",
        on
          ? "border-brand bg-brand/10 text-brand"
          : "border-border bg-background text-muted-foreground hover:border-brand hover:text-brand",
      )}
    >
      {children}
    </button>
  )
}
