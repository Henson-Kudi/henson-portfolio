import { NextResponse } from "next/server"
import { requireAdmin, parseBody } from "@/lib/api"
import { experienceInput } from "@/lib/validation"
import { experienceRepo } from "@/lib/repositories/experience"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  return NextResponse.json(await experienceRepo.listAll())
}

export async function POST(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  const parsed = await parseBody(req, experienceInput)
  if (parsed.error) return parsed.error
  return NextResponse.json(await experienceRepo.create(parsed.data), { status: 201 })
}
