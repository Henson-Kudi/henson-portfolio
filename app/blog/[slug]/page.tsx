import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { postsRepo } from "@/lib/repositories/posts"
import { fmtDate } from "@/lib/format"

export const dynamic = "force-dynamic"

const wrap = "mx-auto max-w-[1120px] px-10 max-sm:px-6"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const p = await postsRepo.getBySlug((await params).slug)
  if (!p || !p.published) return { title: "Post not found" }
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt || undefined,
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await postsRepo.getBySlug((await params).slug)
  if (!p || !p.published) notFound()

  return (
    <>
      <SiteNav />
      <div className={wrap}>
        <div className="border-b border-border pb-[34px] pt-[60px]">
          <Link
            href="/blog"
            className="mb-[22px] inline-flex items-center gap-2 font-mono text-[13px] text-muted-foreground transition-colors hover:text-brand"
          >
            ← Writing
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-2.5 font-mono text-xs text-muted-foreground">
            <span className="text-brand">{fmtDate(p.publishedAt)}</span>
            {p.tags.length > 0 && <span>·</span>}
            {p.tags.map((t) => (
              <span key={t} className="before:content-['#']">
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-[clamp(36px,6vw,64px)] font-normal leading-[1.03] tracking-[-0.02em]">
            {p.title}
          </h1>
          {p.excerpt && (
            <p className="mt-[18px] max-w-[60ch] text-xl leading-[1.55] text-ink-soft">{p.excerpt}</p>
          )}
        </div>

        {/* Body is authored by the admin (trusted) via the rich-text editor. */}
        <article
          className="article-body mx-auto max-w-[70ch] pb-20 pt-[50px]"
          dangerouslySetInnerHTML={{ __html: p.body }}
        />
      </div>
      <SiteFooter />
    </>
  )
}
