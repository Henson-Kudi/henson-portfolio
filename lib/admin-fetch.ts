// Client helper for the admin API. Surfaces a useful (admin-only) error
// message — validation issues from the server's zod flatten() included.
type Flatten = { formErrors?: string[]; fieldErrors?: Record<string, string[] | undefined> }

function firstIssue(issues?: Flatten): string | undefined {
  if (!issues) return undefined
  if (issues.formErrors?.length) return issues.formErrors[0]
  for (const msgs of Object.values(issues.fieldErrors ?? {})) {
    if (msgs?.length) return msgs[0]
  }
  return undefined
}

export async function apiSend<T = unknown>(
  url: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try {
      const j = await res.json()
      msg = firstIssue(j?.issues) ?? j?.error ?? msg
    } catch {
      /* non-json response */
    }
    throw new Error(msg)
  }
  return (res.status === 204 ? undefined : await res.json()) as T
}
