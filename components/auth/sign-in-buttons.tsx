"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth/client"
import { SSO_PROVIDERS, providerLabel } from "@/lib/admin-config"

// Custom SSO sign-in. No email/password, no signup — the only way in is an
// allowed admin email via SSO (the allowlist is enforced server-side).
export function SignInButtons() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function signIn(provider: string) {
    setError(null)
    setLoading(provider)
    try {
      // On success this redirects the browser to the provider then back to /admin.
      // OAuth-side failures redirect back here with ?error — kept generic on purpose.
      await authClient.signIn.social({
        provider,
        callbackURL: "/admin",
        errorCallbackURL: "/auth/sign-in?error=1",
      })
    } catch {
      setLoading(null)
      // Deliberately generic — never reveal provider/config/allowlist details.
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {SSO_PROVIDERS.map((provider) => (
        <button
          key={provider}
          type="button"
          disabled={loading !== null}
          onClick={() => signIn(provider)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded border border-ink-soft/30 bg-foreground px-5 font-sans text-sm text-background transition-colors hover:border-brand hover:bg-brand disabled:opacity-60"
        >
          {loading === provider ? "Redirecting…" : `Continue with ${providerLabel(provider)}`}
        </button>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
