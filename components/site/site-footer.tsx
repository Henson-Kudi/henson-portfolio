import Link from "next/link"
import { site } from "@/lib/site-content"

const internal = [
  { label: "Work", href: "/projects" },
  { label: "Writing", href: "/blog" },
  { label: "CV (PDF)", href: "/henson-resume.pdf" },
  { label: "RSS", href: "/feed.xml" },
]

export function SiteFooter() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-10 max-sm:px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          © 2026 {site.name} · {site.location}
        </div>
        <div className="flex flex-wrap gap-[22px]">
          {internal.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={site.socials.github}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-muted-foreground transition-colors hover:text-brand"
          >
            GitHub
          </a>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-muted-foreground transition-colors hover:text-brand"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
