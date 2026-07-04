import { NextResponse } from "next/server"
import { requireAdmin, parseBody } from "@/lib/api"
import { seoInput } from "@/lib/validation"
import { seoRepo } from "@/lib/repositories/seo"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  return NextResponse.json(await seoRepo.get())
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  const parsed = await parseBody(req, seoInput)
  if (parsed.error) return parsed.error
  return NextResponse.json(await seoRepo.update(parsed.data))
}
