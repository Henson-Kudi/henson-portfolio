import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { site } from "@/lib/site-content"
import { Frame, Kicker, Chip, OG_SIZE, og, ogFonts } from "@/lib/og"

// Homepage share card: the portrait at full height with name and role.
// 1200×630 so LinkedIn, X and Slack show the large preview layout
// instead of the small square thumbnail a 512×512 icon gets.
export const runtime = "nodejs"
export const dynamic = "force-static"

export async function GET() {
  const photo = await readFile(join(process.cwd(), "public", "images", "profile.jpg"))
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`

  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", flex: 1, alignItems: "stretch", gap: 56, marginBottom: 30 }}>
          {/* Portrait panel. The photo is 1050×1350; cover-crop it into a 400×470 frame. */}
          <div
            style={{
              display: "flex",
              width: 400,
              height: 470,
              borderRadius: 6,
              overflow: "hidden",
              border: `1px solid rgba(255,255,255,0.14)`,
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" width={400} height={470} style={{ objectFit: "cover", objectPosition: "center top" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
            <Kicker>{site.location}</Kicker>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontFamily: "Plex Sans",
                fontWeight: 600,
                fontSize: 66,
                lineHeight: 1.05,
                letterSpacing: -1.5,
                color: og.ink,
              }}
            >
              {site.name}
            </div>
            <div style={{ display: "flex", width: 72, height: 2, background: og.cyan, marginTop: 24 }} />
            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontFamily: "Plex Sans",
                fontWeight: 400,
                fontSize: 27,
                lineHeight: 1.4,
                color: og.muted,
                maxWidth: 600,
              }}
            >
              {site.role}. Secure, high-availability backends for fintech, payments and crypto.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 34 }}>
              <Chip>Fintech</Chip>
              <Chip>Payments</Chip>
              <Chip>Crypto custody</Chip>
              <Chip>Team lead</Chip>
            </div>
          </div>
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  )
}
