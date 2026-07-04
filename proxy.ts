import { auth } from "@/lib/auth/server"

// Next 16 renames middleware.ts -> proxy.ts. Gate /admin: unauthenticated
// visitors are redirected to the sign-in page. Email-level authorization
// (ADMIN_EMAILS allowlist) is enforced in app/admin/layout.tsx.
export default auth.middleware({ loginUrl: "/auth/sign-in" })

export const config = {
  matcher: ["/admin/:path*"],
}
