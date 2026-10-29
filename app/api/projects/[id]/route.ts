import { NextResponse, after } from "next/server"
import { requireAdmin, parseBody, notFound } from "@/lib/api"
import { projectUpdate } from "@/lib/validation"
import { projectsRepo } from "@/lib/repositories/projects"
import { notifyIndexNow, projectUrls } from "@/lib/indexnow"

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
  const id = (await params).id
  const before = await projectsRepo.getById(id)
  if (!before) return notFound()
  try {
    const saved = await projectsRepo.update(id, parsed.data)
    if (saved.published || before.published) {
      after(() => notifyIndexNow([...projectUrls(saved.slug), ...projectUrls(before.slug)]))
    }
    return NextResponse.json(saved)
  } catch {
    return notFound()
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin()
  if (error) return error
  const id = (await params).id
  const before = await projectsRepo.getById(id)
  if (!before) return notFound()
  try {
    await projectsRepo.remove(id)
    if (before.published) after(() => notifyIndexNow(projectUrls(before.slug)))
    return NextResponse.json({ ok: true })
  } catch {
    return notFound()
  }
}
