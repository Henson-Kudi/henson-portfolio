"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, FolderKanban, PenLine, Briefcase, Quote, Search } from "lucide-react"
import { Toaster } from "sonner"
import { cn } from "@/lib/utils"
import { SignOutButton } from "@/components/auth/sign-out-button"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/posts", label: "Writing", icon: PenLine },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/seo", label: "SEO & meta", icon: Search },
]

export function AdminShell({ email, children }: { email?: string | null; children: ReactNode }) {
  const pathname = usePathname()
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] max-md:grid-cols-1">
      <aside className="sticky top-0 flex h-screen flex-col border-r border-border bg-card px-4 py-6 max-md:static max-md:h-auto">
        <div className="mb-7 px-2 font-serif text-xl">
          Henson<span className="text-brand">.</span>admin
        </div>
        <nav className="flex flex-col gap-1 max-md:flex-row max-md:flex-wrap">
          {NAV.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors",
                  active(item.href, item.exact)
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-border pt-4 max-md:hidden">
          {email && (
            <p className="px-2 text-xs text-muted-foreground">
              Signed in as <span className="text-foreground">{email}</span>
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 rounded border border-border px-3 py-1.5 text-center font-mono text-xs transition-colors hover:border-foreground"
            >
              View site ↗
            </Link>
            <SignOutButton className="rounded border border-transparent px-3 py-1.5 font-mono text-xs text-destructive transition-colors hover:bg-destructive/10" />
          </div>
        </div>
      </aside>
      <main className="h-screen overflow-auto max-md:h-auto">{children}</main>
      <Toaster position="bottom-center" toastOptions={{ className: "font-sans" }} />
    </div>
  )
}
