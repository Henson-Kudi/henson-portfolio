import { cn } from "@/lib/utils"

const base =
  "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.05em]"

export function StatusPill({
  published,
  scheduled,
}: {
  published: boolean
  /** Published but with a future publish time: hidden until then. */
  scheduled?: boolean
}) {
  if (scheduled)
    return (
      <span className={cn(base, "border-sky-600/40 bg-sky-600/10 text-sky-700 dark:text-sky-400")}>
        scheduled
      </span>
    )
  return published ? (
    <span className={cn(base, "border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400")}>
      published
    </span>
  ) : (
    <span className={cn(base, "border-amber-600/40 bg-amber-600/10 text-amber-700 dark:text-amber-400")}>
      draft
    </span>
  )
}

export function FeaturedPill({ children = "home" }: { children?: string }) {
  return <span className={cn(base, "border-brand/40 bg-brand/10 text-brand")}>{children}</span>
}
