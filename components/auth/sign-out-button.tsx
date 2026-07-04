import { signOutAction } from "@/app/auth/actions"

// A form posting to a server action — server-side sign-out, no client CSRF.
export function SignOutButton({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <form action={signOutAction} className="contents">
      <button type="submit" className={className}>
        {children ?? "Sign out"}
      </button>
    </form>
  )
}
