import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { projectsRepo } from "@/lib/repositories/projects"
import { postsRepo } from "@/lib/repositories/posts"
import { experienceRepo } from "@/lib/repositories/experience"
import { fmtPeriod } from "@/lib/format"
import { AUTHOR, SITE_URL } from "@/lib/post-utils"
import { caseStudyChapters, experienceForProject, relatedPostsForProject } from "@/lib/project-utils"

export const dynamic = "force-dynamic"

const wrap = "mx-auto max-w-[1120px] px-10 max-sm:px-6"
const stripes =
  "repeating-linear-gradient(135deg, hsl(var(--paper-2)) 0 14px, hsl(var(--card)) 14px 28px)"
const sideHead = "mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const p = await projectsRepo.getBySlug((await params).slug)
  if (!p || !p.published) return { title: "Project not found", robots: { index: false } }
  const url = `${SITE_URL}/projects/${p.slug}`
  const title = `${p.title} case study`
  // Summaries are short; add the author so the snippet says who did the work.
  const description =
    p.summary.length <= 120 ? `${p.summary} Case study by ${AUTHOR.name}${p.role ? `, ${p.role.toLowerCase()}` : ""}.` : p.summary
  return {
    title,
    description,
    keywords: [...p.stack, "case study", p.title],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: AUTHOR.name,
      images: p.coverImage ? [{ url: p.coverImage, width: 1200, height: 630, alt: `${p.title} cover` }] : undefined,
    },
    twitter: {
      card: p.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: p.coverImage ? [p.coverImage] : undefined,
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await projectsRepo.getBySlug((await params).slug)
  if (!p || !p.published) notFound()

  const [nav, posts, experiences] = await Promise.all([
    projectsRepo.listPublishedNav(),
    postsRepo.listPublishedForMatching(),
    experienceRepo.listPublished(),
  ])

  const chapters = caseStudyChapters(p)
  const related = relatedPostsForProject(p, posts)
  const period = experienceForProject(p, experiences)
  const i = nav.findIndex((n) => n.slug === p.slug)
  const prev = i > 0 ? nav[i - 1] : null
  const next = i >= 0 && i < nav.length - 1 ? nav[i + 1] : null

  const links: { label: string; href: string }[] = []
  if (!p.confidential) {
    if (p.liveUrl) links.push({ label: "Live site", href: p.liveUrl })
    if (p.repoUrl) links.push({ label: "Repository", href: p.repoUrl })
    if (p.caseStudyUrl) links.push({ label: "Full case study", href: p.caseStudyUrl })
  }

  const facts: { k: string; v: string }[] = [
    ...(p.role ? [{ k: "Role", v: p.role }] : []),
    ...(p.org ? [{ k: "Organisation", v: p.org }] : []),
    ...(period ? [{ k: "Period", v: fmtPeriod(period.startDate, period.endDate) }] : []),
    {
      k: "Status",
      v: p.confidential ? "Under NDA: architecture described, client details omitted" : p.liveUrl ? "In production" : "Delivered",
    },
  ]

  // Structured data: the project as a CreativeWork by the same Person entity
  // declared on the homepage and /about, plus breadcrumbs.
  const url = `${SITE_URL}/projects/${p.slug}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: p.title,
        headline: `${p.title} case study`,
        description: p.summary,
        abstract: p.overview || undefined,
        url,
        mainEntityOfPage: url,
        image: p.coverImage || undefined,
        author: { "@id": AUTHOR.id },
        creator: { "@id": AUTHOR.id },
        ...(p.org ? { sourceOrganization: { "@type": "Organization", name: p.org } } : {}),
        keywords: p.stack.length ? p.stack.join(", ") : undefined,
        dateCreated: p.createdAt.toISOString(),
        dateModified: p.updatedAt.toISOString(),
        inLanguage: "en",
        isPartOf: { "@type": "CollectionPage", url: `${SITE_URL}/projects`, name: "Selected work" },
      },
      {
        "@type": "Person",
        "@id": AUTHOR.id,
        name: AUTHOR.name,
        url: AUTHOR.url,
        sameAs: AUTHOR.sameAs,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/projects` },
          { "@type": "ListItem", position: 3, name: p.title, item: url },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteNav />
      <article className={wrap}>
        {/* HEADER */}
        <header className="pt-[60px] max-sm:pt-10">
          <Link
            href="/projects"
            className="mb-[22px] inline-flex items-center gap-2 font-mono text-[13px] text-muted-foreground transition-colors hover:text-brand"
          >
            ← All work
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-2.5 font-mono text-xs text-muted-foreground">
            <span className="text-brand">Case study</span>
            {p.badge && (
              <>
                <span>·</span>
                <span>{p.badge}</span>
              </>
            )}
            {p.confidential && (
              <>
                <span>·</span>
                <span className="rounded-[2px] border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em]">
                  NDA
                </span>
              </>
            )}
          </div>
          <h1 className="font-serif text-[clamp(36px,6vw,64px)] font-normal leading-[1.03] tracking-[-0.02em]">
            {p.title}
          </h1>
          <p className="mt-[18px] max-w-[60ch] text-xl leading-[1.55] text-ink-soft">{p.summary}</p>

          {/* AT A GLANCE */}
          <dl className="mt-9 grid grid-cols-4 gap-px border border-border bg-border max-md:grid-cols-2">
            {facts.map((f) => (
              <div key={f.k} className="bg-background p-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{f.k}</dt>
                <dd className="mt-1.5 text-[15px] leading-[1.45] text-foreground">{f.v}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* COVER */}
        <figure
          className="my-10 grid aspect-[1200/630] max-h-[560px] w-full place-items-center overflow-hidden rounded-md border border-border font-mono text-xs tracking-[0.08em] text-muted-foreground"
          style={p.coverImage ? undefined : { backgroundImage: stripes }}
        >
          {p.coverImage ? (
            <Image
              src={p.coverImage}
              alt={`${p.title} cover`}
              width={1200}
              height={630}
              priority
              sizes="(max-width: 1120px) 100vw, 1040px"
              className="h-full w-full object-cover"
            />
          ) : (
            `[ ${p.title.toLowerCase()} ]`
          )}
        </figure>

        {/* BODY */}
        <div className="grid grid-cols-[1fr_300px] items-start gap-14 pb-16 pt-6 max-lg:grid-cols-1 max-lg:gap-9">
          <div>
            {chapters.map((ch, idx) => (
              <section key={ch.id} id={ch.id} className="scroll-mt-24 border-t border-border py-9 first:border-t-0 first:pt-0">
                <div className="grid grid-cols-[110px_1fr] gap-6 max-sm:grid-cols-1 max-sm:gap-2">
                  <div className="font-mono text-xs uppercase tracking-[0.1em] text-brand">
                    0{idx + 1} · {ch.label}
                  </div>
                  <div>
                    <h2 className="font-serif text-[clamp(24px,3vw,32px)] font-medium leading-[1.15] tracking-[-0.015em]">
                      {ch.heading}
                    </h2>
                    <p className="mt-4 max-w-[62ch] text-[18px] leading-[1.7] text-ink-soft">{ch.body}</p>
                  </div>
                </div>
              </section>
            ))}
            {chapters.length === 0 && (
              <p className="text-[18px] leading-[1.7] text-ink-soft">{p.summary}</p>
            )}

            {/* STACK (in the flow on small screens, duplicated in the aside on large) */}
            <section className="border-t border-border py-9 lg:hidden">
              <h2 className={sideHead}>Tech stack</h2>
              <Chips items={p.stack} />
            </section>
          </div>

          <aside className="border-l border-border pl-8 max-lg:border-l-0 max-lg:pl-0 lg:sticky lg:top-[90px]">
            {chapters.length > 1 && (
              <nav aria-label="On this page" className="mb-7">
                <h2 className={sideHead}>On this page</h2>
                <ol className="flex flex-col">
                  {chapters.map((ch, idx) => (
                    <li key={ch.id}>
                      <a
                        href={`#${ch.id}`}
                        className="flex items-baseline gap-3 border-b border-border py-2 text-sm text-ink-soft transition-colors hover:text-brand"
                      >
                        <span className="font-mono text-[11px] text-muted-foreground">0{idx + 1}</span>
                        {ch.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="mb-7 max-lg:hidden">
              <h2 className={sideHead}>Tech stack</h2>
              <Chips items={p.stack} />
            </div>

            {(links.length > 0 || p.confidential) && (
              <div className="mb-7">
                <h2 className={sideHead}>Links</h2>
                <div className="flex flex-col">
                  {links.length > 0 ? (
                    links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="border-b border-border py-2.5 text-sm text-brand transition-colors hover:border-brand"
                      >
                        ↗ {l.label}
                      </a>
                    ))
                  ) : (
                    <span className="border-b border-border py-2.5 text-sm text-muted-foreground">
                      Confidential · details on request
                    </span>
                  )}
                </div>
              </div>
            )}

            {related.length > 0 && (
              <div className="mb-7">
                <h2 className={sideHead}>Related writing</h2>
                <ul className="flex flex-col">
                  {related.map((r) => (
                    <li key={r.id} className="border-b border-border">
                      <Link href={`/blog/${r.slug}`} className="group block py-3 transition-[padding] hover:pl-1.5">
                        <span className="font-serif text-[17px] leading-snug text-foreground group-hover:text-brand">
                          {r.title}
                        </span>
                        {r.postType && (
                          <span className="ml-2 font-mono text-[11px] text-muted-foreground">{r.postType}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded border border-border bg-card p-5">
              <div className="font-serif text-lg leading-snug">Building something like this?</div>
              <p className="mt-2 text-sm leading-[1.6] text-ink-soft">
                I take on a small number of fintech, payments and crypto backends a year.
              </p>
              <Link
                href="/hire"
                className="mt-4 inline-flex items-center rounded-[2px] border border-foreground bg-foreground px-4 py-2.5 text-sm text-background transition-colors hover:border-brand hover:bg-brand hover:text-white"
              >
                Work with me →
              </Link>
            </div>
          </aside>
        </div>

        {/* PREV / NEXT */}
        {(prev || next) && (
          <nav aria-label="More projects" className="grid grid-cols-2 gap-px border border-border bg-border max-sm:grid-cols-1">
            <ProjectNavLink item={prev} dir="prev" />
            <ProjectNavLink item={next} dir="next" />
          </nav>
        )}
        <div className="h-20" />
      </article>
      <SiteFooter />
    </>
  )
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span
          key={s}
          className="rounded-full border border-border px-2.5 py-[5px] font-mono text-[11px] text-muted-foreground"
        >
          {s}
        </span>
      ))}
    </div>
  )
}

function ProjectNavLink({ item, dir }: { item: { slug: string; title: string } | null; dir: "prev" | "next" }) {
  if (!item) return <div className="bg-background p-6 max-sm:hidden" />
  return (
    <Link
      href={`/projects/${item.slug}`}
      className={`group flex flex-col gap-1.5 bg-background p-6 transition-colors hover:bg-card ${dir === "next" ? "items-end text-right" : ""}`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        {dir === "prev" ? "← Previous project" : "Next project →"}
      </span>
      <span className="font-serif text-xl text-foreground group-hover:text-brand">{item.title}</span>
    </Link>
  )
}
