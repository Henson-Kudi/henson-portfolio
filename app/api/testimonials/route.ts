import { NextResponse } from "next/server"
import { requireAdmin, parseBody } from "@/lib/api"
import { testimonialInput } from "@/lib/validation"
import { testimonialsRepo } from "@/lib/repositories/testimonials"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  return NextResponse.json(await testimonialsRepo.listAll())
}

export async function POST(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  const parsed = await parseBody(req, testimonialInput)
  if (parsed.error) return parsed.error
  return NextResponse.json(await testimonialsRepo.create(parsed.data), { status: 201 })
}
