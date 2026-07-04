import { NextResponse } from "next/server"
import { requireAdmin, parseBody, notFound } from "@/lib/api"
import { testimonialUpdate } from "@/lib/validation"
import { testimonialsRepo } from "@/lib/repositories/testimonials"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const item = await testimonialsRepo.getById((await params).id)
  return item ? NextResponse.json(item) : notFound()
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const parsed = await parseBody(req, testimonialUpdate)
  if (parsed.error) return parsed.error
  try {
    return NextResponse.json(await testimonialsRepo.update((await params).id, parsed.data))
  } catch {
    return notFound()
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    await testimonialsRepo.remove((await params).id)
    return NextResponse.json({ ok: true })
  } catch {
    return notFound()
  }
}
