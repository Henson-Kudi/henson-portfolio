import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { postsRepo, type PostLink } from "@/lib/repositories/posts"
import { fmtDate } from "@/lib/format"
import { AUTHOR, SITE_URL, buildArticleJsonLd, postSources, postUrl } from "@/lib/post-utils"
import { site, hero } from "@/lib/site-content"

export const dynamic = "force-dynamic"

const wrap = "mx-auto max-w-[1120px] px-10 max-sm:px-6"

// Everything a search engine or social crawler reads for a post: title,
// description, canonical, Open Graph (article), Twitter card, keywords.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const p = await postsRepo.getBySlug((await params).slug)
  if (!p || !p.published) return { title: "Post not found", robots: { index: false } }
  const title = p.seoTitle || p.title
  const description = p.seoDescription || p.excerpt || undefined
  const url = postUrl(p.slug)
  const keywords = Array.from(new Set([p.primaryKeyword, ...p.keywords, ...p.tags].filter((k): k is string => !!k)))
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: p.canonicalUrl || url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: AUTHOR.name,
      publishedTime: p.publishedAt?.toISOString(),
      modifiedTime: p.updatedAt.toISOString(),
      authors: [AUTHOR.url],
      section: p.category ?? undefined,
      tags: p.tags,
      images: p.coverImage ? [{ url: p.coverImage, alt: p.coverAlt ?? title }] : undefined,
    },
    twitter: {
      card: p.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: p.coverImage ? [p.coverImage] : undefined,
    },
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await postsRepo.getBySlug((await params).slug)
  if (!p || !p.published) notFound()

  // Internal links: up (hub), across (related), down (posts naming this one as hub).
  const [hub, related, children] = await Promise.all([
    p.hubSlug ? postsRepo.getPublishedBySlugs([p.hubSlug]).then((r) => r[0] ?? null) : null,
    postsRepo.getPublishedBySlugs(p.relatedSlugs.filter((s) => s !== p.slug)),
    postsRepo.getPublishedChildren(p.slug),
  ])
  const sources = postSources(p)

  const articleLd = buildArticleJsonLd(p)
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Writing", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: p.title, item: postUrl(p.slug) },
    ],
  }

  const meta: string[] = []
  if (p.postType) meta.push(p.postType)
  if (p.readingMinutes) meta.push(`${p.readingMinutes} min read`)

  return (
    <>
      {/* Structured data. JSON.stringify output is safe inside a script tag
          once "<" is escaped so user text can't close the element. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleLd, breadcrumbLd]).replace(/</g, "\\u003c") }}
      />
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
            {meta.map((m) => (
              <span key={m} className="before:mr-2.5 before:content-['·']">
                {m}
              </span>
            ))}
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
          {hub && (
            <p className="mt-5 font-mono text-[13px] text-muted-foreground">
              Part of{" "}
              <Link href={`/blog/${hub.slug}`} className="text-brand underline underline-offset-4 hover:no-underline">
                {hub.title}
              </Link>
            </p>
          )}
        </div>

        {p.coverImage && (
          <figure className="mt-10">
            {/* LCP element: priority + sizes so the optimizer serves a right-sized AVIF/WebP. */}
            <Image
              src={p.coverImage}
              alt={p.coverAlt ?? ""}
              width={1200}
              height={630}
              priority
              sizes="(max-width: 1120px) 100vw, 1040px"
              className="max-h-[520px] w-full rounded-md border border-border object-cover"
            />
          </figure>
        )}

        {/* Body is authored by the admin (trusted) via the rich-text editor. */}
        <article
          className="article-body mx-auto max-w-[70ch] pb-14 pt-[50px]"
          dangerouslySetInnerHTML={{ __html: p.body }}
        />

        <AuthorBox />

        {(sources.length > 0 || related.length > 0 || children.length > 0) && (
          <aside className="mx-auto max-w-[70ch] border-t border-border pb-20 pt-10">
            {sources.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Sources</h2>
                <ol className="list-decimal space-y-1.5 pl-5 text-[15px] text-ink-soft">
                  {sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand underline underline-offset-4 hover:no-underline"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {children.length > 0 && <PostLinks heading="In this series" posts={children} />}
            {related.length > 0 && <PostLinks heading="Related" posts={related} />}
          </aside>
        )}
      </div>
      <SiteFooter />
    </>
  )
}

// Who wrote this and how to reach them. Search engines weigh a named,
// linked author; readers who want to hire get a path in one click.
function AuthorBox() {
  return (
    <aside className="mx-auto flex max-w-[70ch] items-start gap-5 border-t border-border py-8 max-sm:flex-col">
      <Image
        src="/apple-touch-icon.png"
        alt={site.name}
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
      />
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Written by</p>
        <p className="mt-1 font-serif text-xl text-foreground">{site.name}</p>
        <p className="mt-1.5 max-w-[56ch] text-[15px] leading-[1.6] text-ink-soft">
          {site.role} in {site.location}. I build secure, high-availability backends for fintech, payments and
          crypto, and lead the teams that ship them. {hero.availability}.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 font-mono text-[13px]">
          <Link href="/#contact" className="text-brand underline underline-offset-4 hover:no-underline">
            Work with me
          </Link>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer me" className="text-muted-foreground hover:text-brand">
            LinkedIn
          </a>
          <a href={site.socials.github} target="_blank" rel="noreferrer me" className="text-muted-foreground hover:text-brand">
            GitHub
          </a>
        </div>
      </div>
    </aside>
  )
}

function PostLinks({ heading, posts }: { heading: string; posts: PostLink[] }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{heading}</h2>
      <ul className="flex flex-col">
        {posts.map((r) => (
          <li key={r.id} className="border-t border-border last:border-b">
            <Link href={`/blog/${r.slug}`} className="group block py-3.5 transition-[padding] hover:pl-2">
              <span className="font-serif text-lg text-foreground group-hover:text-brand">{r.title}</span>
              {r.postType && <span className="ml-2 font-mono text-[11px] text-muted-foreground">{r.postType}</span>}
              {r.excerpt && <p className="mt-1 text-sm text-ink-soft">{r.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
