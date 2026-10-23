import type { Metadata } from "next"
import Link from "next/link"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { PageHead } from "@/components/site/page-head"
import { Pager } from "@/components/site/pager"
import { postsRepo } from "@/lib/repositories/posts"
import { normalizePageParams } from "@/lib/pagination"
import { fmtDate } from "@/lib/format"
import { SITE_URL, AUTHOR, postUrl } from "@/lib/post-utils"

export const dynamic = "force-dynamic"

const description =
  "Occasional writing on backend architecture, crypto custody, offline-first design and the finance-meets-engineering mindset."

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Writing",
    description,
    images: [{ url: `${SITE_URL}/android-chrome-512x512.png`, alt: "Henson Kudi Amah" }],
  },
}

const wrap = "mx-auto max-w-[1120px] px-10 max-sm:px-6"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const sp = await searchParams
  const { page, pageSize } = normalizePageParams({ page: sp.page }, { defaultPageSize: 12 })
  const result = await postsRepo.listPublished({ page, pageSize })

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Writing",
    description,
    url: `${SITE_URL}/blog`,
    author: { "@id": AUTHOR.id },
    publisher: { "@id": AUTHOR.id },
    blogPost: result.items.map((p) => ({
      "@type": "BlogPosting",
      headline: p.seoTitle || p.title,
      url: postUrl(p.slug),
      datePublished: p.publishedAt?.toISOString(),
      image: p.coverImage || undefined,
      author: { "@id": AUTHOR.id },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd).replace(/</g, "\\u003c") }}
      />
      <SiteNav />
      <div className={wrap}>
        <PageHead
          kicker="Writing"
          title={
            <>
              Notes on <em className="italic text-brand">building systems.</em>
            </>
          }
          intro={description}
        />
        <div className="py-[60px]">
          {result.items.length === 0 ? (
            <div className="py-20 text-center font-mono text-[13px] text-muted-foreground">
              No published posts yet.
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                {result.items.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="grid grid-cols-[150px_1fr_220px] gap-[34px] border-b border-border py-[34px] transition-[padding] first:border-t hover:pl-2.5 max-md:grid-cols-[150px_1fr] max-sm:grid-cols-1 max-sm:gap-2"
                  >
                    <div className="pt-1.5 font-mono text-xs text-muted-foreground">
                      {fmtDate(p.publishedAt)}
                      {p.readingMinutes ? (
                        <span className="block max-sm:ml-2 max-sm:inline">{p.readingMinutes} min read</span>
                      ) : null}
                    </div>
                    <div>
                      <h3 className="font-serif text-[26px] font-medium tracking-[-0.01em]">
                        {p.title}
                      </h3>
                      {p.excerpt && (
                        <p className="mt-2 max-w-[64ch] text-base leading-[1.55] text-ink-soft">
                          {p.excerpt}
                        </p>
                      )}
                      {p.tags.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-2">
                          {p.tags.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-[11px] text-muted-foreground before:content-['#']"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {p.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverImage}
                        alt={p.coverAlt ?? ""}
                        loading="lazy"
                        className="aspect-[16/10] w-full rounded border border-border object-cover max-md:hidden max-sm:order-first max-sm:block max-sm:aspect-[16/9]"
                      />
                    )}
                  </Link>
                ))}
              </div>
              <Pager page={result.page} totalPages={result.totalPages} basePath="/blog" />
            </>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
