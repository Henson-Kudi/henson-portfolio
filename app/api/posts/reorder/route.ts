import { NextResponse } from "next/server"
import { requireAdmin, parseBody } from "@/lib/api"
import { reorderInput } from "@/lib/validation"
import { postsRepo } from "@/lib/repositories/posts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  const parsed = await parseBody(req, reorderInput)
  if (parsed.error) return parsed.error
  await postsRepo.reorder(parsed.data.ids)
  return NextResponse.json({ ok: true })
}
