import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"
import { isAdminEmail } from "@/lib/auth/admin"
import { AdminShell } from "@/components/admin/admin-shell"

// Full SSR: re-check the session on every request. Unauthenticated or
// non-admin visitors go to /auth/sign-in (which renders the "no access"
// state for signed-in-but-not-allowed accounts — no redirect loop).
export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session } = await auth.getSession()
  if (!session?.user || !isAdminEmail(session.user.email)) {
    redirect("/auth/sign-in")
  }
  return <AdminShell email={session.user.email}>{children}</AdminShell>
}
