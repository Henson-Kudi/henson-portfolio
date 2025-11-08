"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" // Simplified to only dark/light, system preference can be added back if needed

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: Theme
}

const initialState: ThemeProviderState = {
  theme: "dark", // Default to dark, matching your app/layout.tsx
  setTheme: () => null,
  resolvedTheme: "dark",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "dark", storageKey = "theme", ...props }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // On the client, try to read from localStorage first
    if (typeof window !== "undefined") {
      try {
        const storedTheme = localStorage.getItem(storageKey) as Theme | null
        if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
          return storedTheme
        }
      } catch (e) {
        console.warn(`Failed to read theme from localStorage: ${e}`)
      }
    }
    // Fallback to defaultTheme (which is "dark")
    return defaultTheme
  })

  const [mounted, setMounted] = useState(false)

  // Effect to apply the theme to the document and save to localStorage
  useEffect(() => {
    if (!mounted) return // Only run on client after mount

    const root = window.document.documentElement

    // Apply the current theme
    if (theme === "light") {
      root.classList.remove("dark")
      root.classList.add("light")
    } else {
      root.classList.remove("light")
      root.classList.add("dark")
    }

    try {
      localStorage.setItem(storageKey, theme)
    } catch (e) {
      console.warn(`Failed to set theme in localStorage: ${e}`)
    }
  }, [theme, mounted, storageKey])

  // Effect to mark as mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // To prevent FOUC, we ensure children are only rendered after mount on client,
  // or always on server. The initial theme is set from localStorage sync or default.
  const childrenToRender = mounted || typeof window === "undefined" ? children : null

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, setTheme: setThemeState, resolvedTheme: theme }}>
      {childrenToRender}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
