import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin, parseBody } from "@/lib/api"
import { notifyIndexNow } from "@/lib/indexnow"
import { publicUrls } from "@/lib/public-urls"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const body = z.object({ urls: z.array(z.string().url()).max(1000).optional() })

// POST /api/indexnow            → submit every live public URL
// POST /api/indexnow {urls:[…]} → submit just those
// Admin only. Use after a scheduled post goes live, or after editing a page
// that has no save hook (hire, about).
export async function POST(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  const text = await req.text()
  let urls: string[] | undefined
  if (text.trim()) {
    const parsed = await parseBody(new Request(req.url, { method: "POST", body: text }), body)
    if (parsed.error) return parsed.error
    urls = parsed.data.urls
  }
  const list = urls ?? (await publicUrls()).map((u) => u.url)
  const result = await notifyIndexNow(list)
  return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}
