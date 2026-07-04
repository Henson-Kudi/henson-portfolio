import { NextResponse } from "next/server"
import { requireAdmin, parseBody, notFound } from "@/lib/api"
import { projectUpdate } from "@/lib/validation"
import { projectsRepo } from "@/lib/repositories/projects"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const item = await projectsRepo.getById((await params).id)
  return item ? NextResponse.json(item) : notFound()
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const parsed = await parseBody(req, projectUpdate)
  if (parsed.error) return parsed.error
  try {
    return NextResponse.json(await projectsRepo.update((await params).id, parsed.data))
  } catch {
    return notFound()
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    await projectsRepo.remove((await params).id)
    return NextResponse.json({ ok: true })
  } catch {
    return notFound()
  }
}
