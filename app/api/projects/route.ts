import { NextResponse } from "next/server"
import { requireAdmin, parseBody } from "@/lib/api"
import { projectInput } from "@/lib/validation"
import { projectsRepo } from "@/lib/repositories/projects"
import { parsePageParams } from "@/lib/pagination"

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
  return NextResponse.json(await projectsRepo.create(parsed.data), { status: 201 })
}
