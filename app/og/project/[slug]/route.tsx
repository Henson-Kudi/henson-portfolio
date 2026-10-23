import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"
import { projectsRepo } from "@/lib/repositories/projects"
import { Frame, Kicker, Chip, OG_SIZE, og, ogFonts } from "@/lib/og"

// Generated cover for a project: /og/project/<slug>  (1200×630 PNG).
// Used as the project's cover image and share image when no hand-made
// cover has been uploaded. Same visual system as the blog covers.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const p = await projectsRepo.getBySlug((await params).slug)
  if (!p || !p.published) notFound()

  const kicker = [p.badge, p.role, p.org].filter(Boolean).join(" · ")
  const titleSize = p.title.length > 22 ? 60 : 72

  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Kicker>{kicker || "Selected work"}</Kicker>
          {p.confidential && (
            <div
              style={{
                display: "flex",
                fontFamily: "Plex Mono",
                fontSize: 14,
                letterSpacing: 3,
                color: og.faint,
                border: `1px solid rgba(255,255,255,0.12)`,
                padding: "6px 12px",
              }}
            >
              CONFIDENTIAL · NDA
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Plex Sans",
              fontWeight: 600,
              fontSize: titleSize,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: og.ink,
              maxWidth: 1000,
            }}
          >
            {p.title}
          </div>
          <div style={{ display: "flex", width: 72, height: 2, background: og.cyan, marginTop: 26 }} />
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontFamily: "Plex Sans",
              fontWeight: 400,
              fontSize: 25,
              lineHeight: 1.45,
              color: og.muted,
              maxWidth: 900,
            }}
          >
            {p.summary}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 34 }}>
          {p.stack.slice(0, 6).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </Frame>
    ),
    {
      ...OG_SIZE,
      fonts: await ogFonts(),
      headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
    },
  )
}
