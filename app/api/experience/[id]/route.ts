import { NextResponse } from "next/server"
import { requireAdmin, parseBody, notFound } from "@/lib/api"
import { experienceUpdate } from "@/lib/validation"
import { experienceRepo } from "@/lib/repositories/experience"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const item = await experienceRepo.getById((await params).id)
  return item ? NextResponse.json(item) : notFound()
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const parsed = await parseBody(req, experienceUpdate)
  if (parsed.error) return parsed.error
  try {
    return NextResponse.json(await experienceRepo.update((await params).id, parsed.data))
  } catch {
    return notFound()
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    await experienceRepo.remove((await params).id)
    return NextResponse.json({ ok: true })
  } catch {
    return notFound()
  }
}
