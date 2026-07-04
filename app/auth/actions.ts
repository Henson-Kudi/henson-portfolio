"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"

// Neon Auth's cookies. session_token is the real session; session_data is a
// cache the middleware re-mints from the token — both must go, or getSession()
// re-hydrates the signed-out user and the sign-in page bounces to /admin.
const KNOWN_AUTH_COOKIES = [
  "__Secure-neon-auth.session_token",
  "__Secure-neon-auth.local.session_data",
]

export async function signOutAction() {
  try {
    await auth.signOut()
  } catch {
    // ignore — the cookie clearing below is the real guarantee
  }

  const store = await cookies()
  const names = new Set(KNOWN_AUTH_COOKIES)
  for (const c of store.getAll()) {
    if (/neon-auth|session_token|session_data/i.test(c.name)) names.add(c.name)
  }
  for (const name of names) {
    // __Secure- prefixed cookies are ONLY cleared by a Secure Set-Cookie —
    // delete() (no Secure) is silently ignored by the browser.
    store.set(name, "", { path: "/", maxAge: 0, secure: true, sameSite: "lax" })
  }

  redirect("/auth/sign-in")
}
