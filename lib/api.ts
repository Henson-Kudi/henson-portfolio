import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSession } from "@/lib/auth/guard"

// Guard: returns an early 401 response if the caller isn't an admin.
export async function requireAdmin(): Promise<
  { error: NextResponse; session: null } | { error: null; session: Awaited<ReturnType<typeof getAdminSession>> }
> {
  const session = await getAdminSession()
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null }
  }
  return { error: null, session }
}

// Parse + validate a JSON body. Returns a 422 response on failure.
// Infers the schema's OUTPUT type (defaults applied) so downstream repos
// receive fully-resolved values.
export async function parseBody<S extends z.ZodTypeAny>(
  req: Request,
  schema: S,
): Promise<{ data: z.output<S>; error: null } | { data: null; error: NextResponse }> {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return { data: null, error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }
  }
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return {
      data: null,
      error: NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 },
      ),
    }
  }
  return { data: parsed.data, error: null }
}

export const notFound = () => NextResponse.json({ error: "Not found" }, { status: 404 })
