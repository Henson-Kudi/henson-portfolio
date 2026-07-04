import Link from "next/link"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto flex min-h-[62vh] max-w-[1120px] flex-col items-start justify-center px-10 py-24 max-sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">Error 404</p>
        <h1 className="mt-4 max-w-[16ch] font-serif text-[clamp(48px,9vw,104px)] font-normal leading-[0.98] tracking-[-0.02em]">
          Page <em className="italic text-brand">not found.</em>
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-[1.6] text-ink-soft">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-[9px] rounded-[2px] border border-foreground bg-foreground px-6 py-3.5 text-[15px] text-background transition-colors hover:border-brand hover:bg-brand hover:text-white"
          >
            ← Back home
          </Link>
          <Link
            href="/projects"
            className="rounded-[2px] border border-border px-6 py-3.5 text-[15px] transition-colors hover:border-foreground"
          >
            View work
          </Link>
          <Link
            href="/blog"
            className="rounded-[2px] border border-border px-6 py-3.5 text-[15px] transition-colors hover:border-foreground"
          >
            Read writing
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
