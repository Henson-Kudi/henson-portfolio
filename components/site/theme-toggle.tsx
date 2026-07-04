"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/providers"

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label="Toggle theme"
      onClick={toggle}
      className="grid h-[38px] w-[38px] place-items-center rounded-full border border-border bg-card text-foreground transition-[border-color,transform] hover:-rotate-[15deg] hover:border-brand"
    >
      {isDark ? <Sun className="h-[15px] w-[15px]" /> : <Moon className="h-[15px] w-[15px]" />}
    </button>
  )
}
