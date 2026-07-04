import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"
import { isAdminEmail } from "@/lib/auth/admin"
import { SignInButtons } from "@/components/auth/sign-in-buttons"
import { SignOutButton } from "@/components/auth/sign-out-button"

export const dynamic = "force-dynamic"

export const metadata = { title: "Admin sign-in", robots: { index: false, follow: false } }

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { data: session } = await auth.getSession()

  // Already signed in as an allowed admin → straight to the dashboard.
  if (session?.user && isAdminEmail(session.user.email)) redirect("/admin")

  // Signed in, but not permitted. Generic message — reveals nothing about the
  // allowlist or the account.
  if (session?.user) {
    return (
      <div className="w-full rounded border border-border bg-card p-9">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">Admin</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight">No access</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This account can't access the admin area. Sign out and try another.
        </p>
        <SignOutButton className="mt-6 inline-flex h-11 items-center justify-center rounded border border-border px-5 text-sm transition-colors hover:border-foreground" />
      </div>
    )
  }

  // Not signed in → SSO.
  const hasError = Boolean((await searchParams).error)
  return (
    <div className="w-full rounded border border-border bg-card p-9">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">Portfolio admin</p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight">Sign in</h1>
      <p className="mb-7 mt-3 text-sm text-muted-foreground">
        Manage projects, writing, testimonials and SEO for amahkudi.dev. Access is limited to
        approved accounts.
      </p>
      {hasError && (
        <p className="mb-4 rounded border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Something went wrong. Please try again.
        </p>
      )}
      <SignInButtons />
    </div>
  )
}
