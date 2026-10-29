import { NextResponse, after } from "next/server"
import { requireAdmin, parseBody, notFound } from "@/lib/api"
import { postUpdate } from "@/lib/validation"
import { postsRepo } from "@/lib/repositories/posts"
import { isLive } from "@/lib/post-utils"
import { notifyIndexNow, postUrls } from "@/lib/indexnow"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const item = await postsRepo.getById((await params).id)
  return item ? NextResponse.json(item) : notFound()
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const parsed = await parseBody(req, postUpdate)
  if (parsed.error) return parsed.error
  const id = (await params).id
  const before = await postsRepo.getById(id)
  if (!before) return notFound()
  try {
    const saved = await postsRepo.update(id, parsed.data)
    // Ping search engines when the post is live, or just stopped being live
    // (so they re-crawl and drop it). Scheduled posts are pinged by the admin
    // "Notify" button once their time comes.
    if (isLive(saved) || isLive(before)) after(() => notifyIndexNow([...postUrls(saved.slug), ...postUrls(before.slug)]))
    return NextResponse.json(saved)
  } catch {
    return notFound()
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const id = (await params).id
  const before = await postsRepo.getById(id)
  if (!before) return notFound()
  try {
    await postsRepo.remove(id)
    if (isLive(before)) after(() => notifyIndexNow(postUrls(before.slug)))
    return NextResponse.json({ ok: true })
  } catch {
    return notFound()
  }
}
