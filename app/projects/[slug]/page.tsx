import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { projectsRepo } from "@/lib/repositories/projects"
import { AUTHOR, SITE_URL } from "@/lib/post-utils"

export const dynamic = "force-dynamic"

const wrap = "mx-auto max-w-[1120px] px-10 max-sm:px-6"
const stripes =
  "repeating-linear-gradient(135deg, hsl(var(--paper-2)) 0 14px, hsl(var(--card)) 14px 28px)"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const p = await projectsRepo.getBySlug((await params).slug)
  if (!p || !p.published) return { title: "Project not found", robots: { index: false } }
  const url = `${SITE_URL}/projects/${p.slug}`
  const description = p.summary
  return {
    title: p.title,
    description,
    keywords: p.stack.length ? p.stack : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: p.title,
      description,
      siteName: AUTHOR.name,
      images: p.coverImage ? [{ url: p.coverImage, alt: p.title }] : undefined,
    },
    twitter: {
      card: p.coverImage ? "summary_large_image" : "summary",
      title: p.title,
      description,
      images: p.coverImage ? [p.coverImage] : undefined,
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await projectsRepo.getBySlug((await params).slug)
  if (!p || !p.published) notFound()

  const sectionDefs: [string, string | null][] = [
    ["Overview", p.overview],
    ["The problem", p.problem],
    ["My role", p.contribution],
    ["Key challenge", p.challenges],
    ["Outcome", p.outcomes],
  ]
  const sections = sectionDefs.filter((s): s is [string, string] => Boolean(s[1]))

  const links: { label: string; href: string }[] = []
  if (!p.confidential) {
    if (p.liveUrl) links.push({ label: "↗ Live site", href: p.liveUrl })
    if (p.repoUrl) links.push({ label: "↗ Repository", href: p.repoUrl })
    if (p.caseStudyUrl) links.push({ label: "↗ Case study", href: p.caseStudyUrl })
  }

  // Structured data: the project as a CreativeWork by the site owner, plus
  // breadcrumbs so search results show "Home › Work › Project".
  const url = `${SITE_URL}/projects/${p.slug}`
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: p.title,
      description: p.summary,
      url,
      image: p.coverImage || undefined,
      author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
      creator: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
      keywords: p.stack.length ? p.stack.join(", ") : undefined,
      dateCreated: p.createdAt.toISOString(),
      dateModified: p.updatedAt.toISOString(),
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/projects` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteNav />
      <div className={wrap}>
        <div className="border-b border-border pb-[34px] pt-[60px]">
          <Link
            href="/projects"
            className="mb-[22px] inline-flex items-center gap-2 font-mono text-[13px] text-muted-foreground transition-colors hover:text-brand"
          >
            ← All work
          </Link>
          {(p.badge || p.role || p.org) && (
            <div className="mb-4 flex flex-wrap items-center gap-2.5 font-mono text-xs text-muted-foreground">
              {p.badge && <span className="text-brand">{p.badge}</span>}
              {p.badge && (p.role || p.org) && <span>·</span>}
              {(p.role || p.org) && <span>{[p.role, p.org].filter(Boolean).join(" · ")}</span>}
            </div>
          )}
          <h1 className="font-serif text-[clamp(36px,6vw,64px)] font-normal leading-[1.03] tracking-[-0.02em]">
            {p.title}
          </h1>
          <p className="mt-[18px] max-w-[60ch] text-xl leading-[1.55] text-ink-soft">{p.summary}</p>
        </div>

        <div
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
        </div>

        <div className="grid grid-cols-[1fr_300px] items-start gap-14 pb-20 pt-[50px] max-lg:grid-cols-1 max-lg:gap-9">
          <div>
            {sections.map(([label, val]) => (
              <div key={label} className="mb-[34px]">
                <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-brand">{label}</h2>
                <p className="text-[18px] leading-[1.7] text-ink-soft">{val}</p>
              </div>
            ))}
            {sections.length === 0 && (
              <p className="text-[18px] leading-[1.7] text-ink-soft">{p.summary}</p>
            )}
          </div>

          <aside className="border-l border-border pl-8 max-lg:border-l-0 max-lg:pl-0 lg:sticky lg:top-[90px]">
            <h4 className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              Tech stack
            </h4>
            <div className="mb-[26px] flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border px-2.5 py-[5px] font-mono text-[11px] text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
            {(links.length > 0 || p.confidential) && (
              <>
                <h4 className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  Links
                </h4>
                <div className="flex flex-col gap-2.5">
                  {links.length > 0 ? (
                    links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="border-b border-border py-2.5 text-sm text-brand transition-colors hover:border-brand"
                      >
                        {l.label}
                      </a>
                    ))
                  ) : (
                    <span className="border-b border-border py-2.5 text-sm text-muted-foreground">
                      Confidential · details on request
                    </span>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
