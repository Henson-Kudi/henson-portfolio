import type { ReactNode } from "react"

// Sticky per-page header inside the admin main area (title + subtitle + actions).
export function AdminHeader({
  title,
  sub,
  actions,
}: {
  title: string
  sub?: string
  actions?: ReactNode
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/85 px-8 py-4 backdrop-blur">
      <div>
        <h2 className="font-serif text-2xl tracking-tight">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
