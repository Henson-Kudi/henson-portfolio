import { site } from "@/lib/site-content"

export function SiteFooter() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-10 max-sm:px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          © 2026 {site.name} · {site.location}
        </div>
        <div className="flex gap-[22px]">
          <a
            href={site.website}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-muted-foreground transition-colors hover:text-brand"
          >
            amahkudi.dev
          </a>
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
