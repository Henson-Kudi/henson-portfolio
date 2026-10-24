"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

// Fade + rise on scroll into view. Respects prefers-reduced-motion.
//
// Server-rendered VISIBLE: the HTML never hides content, so the first paint
// is complete before any JavaScript runs (Speed Index, crawlers, JS-off).
// After mount, sections that are still below the viewport are hidden and
// revealed as they scroll in; anything already on screen stays as it is.
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: "div" | "section" | "article" | "header"
}) {
  const ref = useRef<HTMLElement | null>(null)
  // "idle" = not yet decided (render visible), "hidden" = waiting to scroll in, "shown" = animate in.
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Anything already touching the viewport stays visible: hiding it would
    // flash (visible → hidden → fade in) and count as a late visual change.
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setState("hidden")
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown")
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      // @ts-expect-error polymorphic ref
      ref={ref}
      style={state === "shown" ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        state !== "idle" && "transition-[opacity,transform] [transition-duration:400ms] ease-out",
        state === "hidden" && "translate-y-5 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  )
}
