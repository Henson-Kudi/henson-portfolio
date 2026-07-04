"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark"

const ThemeContext = createContext<{ theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
})

// Theme is persisted in a cookie and applied on <html> by the server layout,
// so no script is rendered client-side (avoids React 19's script warning).
export function Providers({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")

  // Sync from whatever the server already applied to <html>.
  useEffect(() => {
    setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light")
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    document.documentElement.classList.toggle("dark", t === "dark")
    // 1-year cookie so the server can render the right theme on next load.
    document.cookie = `theme=${t}; path=/; max-age=31536000; samesite=lax`
  }, [])

  const toggle = useCallback(
    () => setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark"),
    [setTheme],
  )

  return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
