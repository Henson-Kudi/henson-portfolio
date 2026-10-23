import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { ReactNode } from "react"

// Shared design for generated images (homepage share card, project covers).
// Matches the hand-made blog covers: deep navy, cyan accent, mono labels,
// bold IBM Plex Sans headline, faint grid, "— amahkudi.dev" sign-off.
// Rendered by next/og (satori): flexbox only, every multi-child node needs
// display:flex, no CSS grid, no shorthand like `inset`.

export const OG_SIZE = { width: 1200, height: 630 }

export const og = {
  bg: "#0b1521",
  bg2: "#0e1b2a",
  ink: "#eef3f7",
  muted: "#9aa7b5",
  faint: "#5d6b7a",
  cyan: "#4fc3e8",
  cyanDim: "rgba(79,195,232,0.35)",
  line: "rgba(255,255,255,0.045)",
}

const fontDir = join(process.cwd(), "assets", "fonts")

export async function ogFonts() {
  const [sansBold, sans, mono, monoMed] = await Promise.all([
    readFile(join(fontDir, "IBMPlexSans-SemiBold.ttf")),
    readFile(join(fontDir, "IBMPlexSans-Regular.ttf")),
    readFile(join(fontDir, "IBMPlexMono-Regular.ttf")),
    readFile(join(fontDir, "IBMPlexMono-Medium.ttf")),
  ])
  return [
    { name: "Plex Sans", data: sansBold, weight: 600 as const, style: "normal" as const },
    { name: "Plex Sans", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Plex Mono", data: mono, weight: 400 as const, style: "normal" as const },
    { name: "Plex Mono", data: monoMed, weight: 500 as const, style: "normal" as const },
  ]
}

// Faint background grid: 60px cells, drawn as thin absolutely-positioned divs.
function Grid() {
  const cols = Array.from({ length: Math.floor(OG_SIZE.width / 60) }, (_, i) => (i + 1) * 60)
  const rows = Array.from({ length: Math.floor(OG_SIZE.height / 60) }, (_, i) => (i + 1) * 60)
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: OG_SIZE.width, height: OG_SIZE.height, display: "flex" }}>
      {cols.map((x) => (
        <div key={`c${x}`} style={{ position: "absolute", left: x, top: 0, width: 1, height: OG_SIZE.height, background: og.line }} />
      ))}
      {rows.map((y) => (
        <div key={`r${y}`} style={{ position: "absolute", top: y, left: 0, height: 1, width: OG_SIZE.width, background: og.line }} />
      ))}
    </div>
  )
}

export function Kicker({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Plex Mono",
        fontWeight: 500,
        fontSize: 18,
        letterSpacing: 4,
        color: og.cyan,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  )
}

export function Chip({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Plex Mono",
        fontSize: 17,
        color: og.muted,
        border: `1px solid rgba(255,255,255,0.14)`,
        borderRadius: 999,
        padding: "8px 16px",
      }}
    >
      {children}
    </div>
  )
}

// Frame: background, grid, padding, sign-off. Children lay out in a column.
export function Frame({ children, signoff = "amahkudi.dev" }: { children: ReactNode; signoff?: string }) {
  return (
    <div
      style={{
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: `linear-gradient(135deg, ${og.bg} 0%, ${og.bg2} 60%, ${og.bg} 100%)`,
        color: og.ink,
        padding: "64px 64px 56px",
      }}
    >
      <Grid />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>{children}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "Plex Mono",
          fontSize: 18,
          color: og.muted,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", width: 26, height: 1, background: og.cyan }} />
        {signoff}
      </div>
    </div>
  )
}

// Abstract "ledger flow" motif: request → ledger → settle, with the middle
// node highlighted. Echoes the timeline diagrams on the blog covers.
export function FlowMotif({ width = 440 }: { width?: number }) {
  const y = 60
  const nodes = [
    { x: 20, label: "REQUEST" },
    { x: width / 2, label: "LEDGER", hot: true },
    { x: width - 20, label: "SETTLE" },
  ]
  return (
    <div style={{ display: "flex", position: "relative", width, height: 120 }}>
      <div style={{ position: "absolute", left: 20, top: y, width: width - 40, height: 1, background: og.cyanDim }} />
      {nodes.map((n) => (
        <div
          key={n.label}
          style={{
            position: "absolute",
            left: n.x - (n.hot ? 18 : 7),
            top: y - (n.hot ? 18 : 7),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: n.hot ? 36 : 14,
              height: n.hot ? 36 : 14,
              borderRadius: 999,
              border: `${n.hot ? 2 : 1}px solid ${og.cyan}`,
              background: n.hot ? "rgba(79,195,232,0.18)" : og.bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {n.hot && <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: og.cyan }} />}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: n.hot ? 14 : 24,
              fontFamily: "Plex Mono",
              fontSize: 13,
              letterSpacing: 2.5,
              color: n.hot ? og.ink : og.faint,
            }}
          >
            {n.label}
          </div>
        </div>
      ))}
    </div>
  )
}
