import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export const controlClass =
  "w-full rounded border border-border bg-card px-3.5 py-2.5 text-sm text-foreground transition-colors focus:border-brand focus:outline-none placeholder:text-muted-foreground"

export const labelClass =
  "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.05em] text-muted-foreground"

// Field wrapper. `full` spans both columns of a two-column form grid.
export function Field({
  label,
  help,
  full,
  children,
}: {
  label: string
  help?: string
  full?: boolean
  children: ReactNode
}) {
  return (
    <div className={cn(full && "col-span-full")}>
      <label className={labelClass}>{label}</label>
      {children}
      {help && <p className="mt-1.5 text-xs text-muted-foreground">{help}</p>}
    </div>
  )
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[hsl(var(--brand))]"
      />
      {label}
    </label>
  )
}
