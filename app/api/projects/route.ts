import { NextResponse, after } from "next/server"
import { requireAdmin, parseBody } from "@/lib/api"
import { projectInput } from "@/lib/validation"
import { projectsRepo } from "@/lib/repositories/projects"
import { parsePageParams } from "@/lib/pagination"
import { notifyIndexNow, projectUrls } from "@/lib/indexnow"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/projects?page=1&pageSize=12  → { items, total, page, pageSize, totalPages, hasMore }
export async function GET(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  const params = parsePageParams(new URL(req.url).searchParams, { maxPageSize: 100 })
  return NextResponse.json(await projectsRepo.listAll(params))
}

export async function POST(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  const parsed = await parseBody(req, projectInput)
  if (parsed.error) return parsed.error
  const created = await projectsRepo.create(parsed.data)
  if (created.published) after(() => notifyIndexNow(projectUrls(created.slug)))
  return NextResponse.json(created, { status: 201 })
}
