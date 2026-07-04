// Deterministic (en-US) date formatting — safe across server/client so it
// doesn't cause hydration mismatches.
export function fmtMonthYear(d: Date | string | null | undefined): string {
  if (!d) return ""
  const dt = typeof d === "string" ? new Date(d) : d
  return Number.isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

// "Jun 1, 2026"
export function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return ""
  const dt = typeof d === "string" ? new Date(d) : d
  return Number.isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

// "Jan 2026 — Present" / "Mar 2025 — Jan 2026"
export function fmtPeriod(
  start: Date | string,
  end: Date | string | null | undefined,
): string {
  return `${fmtMonthYear(start)} — ${end ? fmtMonthYear(end) : "Present"}`
}
