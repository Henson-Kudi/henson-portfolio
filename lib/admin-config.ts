// SSO providers offered on the admin sign-in screen. Each must be enabled in
// the Neon Auth dashboard. Override with NEXT_PUBLIC_ADMIN_SSO_PROVIDERS
// (comma-separated), e.g. "github" or "github,google".
export const SSO_PROVIDERS: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_SSO_PROVIDERS || "github,google"
)
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

const LABELS: Record<string, string> = {
  github: "GitHub",
  google: "Google",
  gitlab: "GitLab",
  microsoft: "Microsoft",
}

export function providerLabel(id: string): string {
  return LABELS[id] ?? id.charAt(0).toUpperCase() + id.slice(1)
}
