import type { Metadata } from "next"
import Link from "next/link"
import type { Project } from "@prisma/client"
import { projectsRepo } from "@/lib/repositories/projects"
import { postsRepo } from "@/lib/repositories/posts"
import { testimonialsRepo } from "@/lib/repositories/testimonials"
import { experienceRepo } from "@/lib/repositories/experience"
import { seoRepo } from "@/lib/repositories/seo"
import { fmtPeriod } from "@/lib/format"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { ContactForm } from "@/components/site/contact-form"
import { Reveal } from "@/components/site/reveal"
import { site, hero, about, services, stack, contact } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoRepo.get()
  const title = seo?.metaTitle ?? `${site.name} | ${site.role}`
  const description = seo?.metaDescription ?? hero.lede
  return {
    title,
    description,
    keywords: seo?.keywords,
    authors: [{ name: seo?.author ?? site.name }],
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      url: seo?.canonicalUrl ?? site.website,
      siteName: site.name,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    twitter: {
      card: seo?.ogImage ? "summary_large_image" : "summary",
      title,
      description,
      creator: seo?.twitterHandle ?? undefined,
    },
  }
}

// ---- small render helpers ----
function Headline({ parts }: { parts: readonly (string | { em: string })[] }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          p
        ) : (
          <em key={i} className="italic text-brand">
            {p.em}
          </em>
        ),
      )}
    </>
  )
}

function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}

function fmtDate(d: Date | string | null): string {
  if (!d) return ""
  const dt = typeof d === "string" ? new Date(d) : d
  return Number.isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

const wrap = "mx-auto max-w-[1120px] px-10 max-sm:px-6"
const secHead = "mb-[52px] flex items-baseline gap-4"
const idx = "font-mono text-xs text-brand"
const h2 = "font-serif text-[clamp(30px,4vw,46px)] font-normal tracking-[-0.015em]"

export default async function HomePage() {
  const [projects, posts, testimonials, experiences] = await Promise.all([
    projectsRepo.listPublished({ pageSize: 4 }),
    postsRepo.listPublished({ pageSize: 4 }),
    testimonialsRepo.listPublished(),
    experienceRepo.listPublished(),
  ])

  // Person + WebSite structured data: tells search engines who the site is
  // about (name, role, location, profiles) so the name query shows a rich card.
  const personLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.website}/#person`,
        name: site.name,
        jobTitle: site.role,
        url: site.website,
        email: `mailto:${site.email}`,
        address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
        sameAs: Object.values(site.socials),
        knowsAbout: ["Fintech", "Payments", "Crypto custody", "Backend architecture", "Node.js", "TypeScript", "AWS"],
      },
      {
        "@type": "WebSite",
        "@id": `${site.website}/#website`,
        url: site.website,
        name: site.name,
        publisher: { "@id": `${site.website}/#person` },
        inLanguage: "en",
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }}
      />
      <SiteNav />

      {/* HERO */}
      <header id="top" className="border-b border-border py-[100px] max-sm:py-16">
        <div className={wrap}>
          <Reveal>
            <div className="mb-[34px] inline-flex items-center gap-[9px] font-mono text-xs tracking-[0.06em] text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {hero.availability}
            </div>
            <h1 className="max-w-[15ch] font-serif text-[clamp(44px,7vw,88px)] font-normal leading-[1.02] tracking-[-0.02em]">
              <Headline parts={hero.headline} />
            </h1>
            <p className="mt-[30px] max-w-[58ch] text-xl leading-[1.55] text-ink-soft">{hero.lede}</p>
            <div className="mt-[42px] flex flex-wrap items-center gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center gap-[9px] rounded-[2px] border border-foreground bg-foreground px-6 py-3.5 text-[15px] text-background transition-colors hover:border-brand hover:bg-brand hover:text-white"
              >
                Start a project →
              </Link>
              <a
                href="/api/resume?download=1"
                className="inline-flex items-center gap-[9px] rounded-[2px] border border-border px-6 py-3.5 text-[15px] transition-colors hover:border-foreground"
              >
                Download CV
              </a>
            </div>
            <div className="mt-14 flex flex-wrap gap-12 border-t border-border pt-[30px]">
              {hero.stats.map((s) => (
                <div key={s.l}>
                  <div className="font-serif text-[34px]">{s.n}</div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      {/* ABOUT */}
      <section id="about" className="border-b border-border py-[90px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>01</span>
              <h2 className={h2}>About</h2>
            </div>
            <div className="grid grid-cols-2 gap-[60px] max-md:grid-cols-1 max-md:gap-10">
              <div className="space-y-5">
                {about.paragraphs.map((p, i) => (
                  <p key={i} className="text-[19px] leading-[1.7] text-ink-soft">
                    <Bold text={p} />
                  </p>
                ))}
              </div>
              <div className="border-l border-border pl-8 max-md:border-l-0 max-md:pl-0">
                {about.side.map((block) => (
                  <div key={block.heading} className="mb-[30px] last:mb-0">
                    <h4 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                      {block.heading}
                    </h4>
                    <ul>
                      {block.items.map((it) => (
                        <li
                          key={it}
                          className="border-b border-border py-[7px] text-[15px] text-ink-soft"
                        >
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-b border-border py-[90px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>02</span>
              <h2 className={h2}>How I can help</h2>
            </div>
            <div className="grid grid-cols-2 gap-px border border-border bg-border max-md:grid-cols-1">
              {services.map((s) => (
                <div key={s.title} className="bg-background p-10 transition-colors hover:bg-card max-sm:p-8">
                  <div className="font-mono text-xs text-brand">{s.num}</div>
                  <h3 className="mb-3 mt-4 font-serif text-[26px] font-medium tracking-[-0.01em]">
                    {s.title}
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="border-b border-border py-[90px]">
        <div className={wrap}>
          <div className={secHead}>
            <span className={idx}>03</span>
            <h2 className={h2}>Selected work</h2>
            <Link href="/projects" className="self-center font-mono text-[13px] text-brand hover:underline">
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-[26px]">
            {projects.items.map((p, i) => (
              <Reveal key={p.id} as="article">
                <ProjectRow project={p} reversed={i % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="border-b border-border py-[90px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>04</span>
              <h2 className={h2}>Experience</h2>
            </div>
            <div className="border-t border-border">
              {experiences.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-[180px_1fr] gap-10 border-b border-border py-[30px] transition-[padding] hover:pl-3 max-md:grid-cols-1 max-md:gap-2"
                >
                  <div className="pt-1.5 font-mono text-xs tracking-[0.04em] text-muted-foreground">
                    {fmtPeriod(e.startDate, e.endDate)}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-medium tracking-[-0.01em]">{e.role}</h3>
                    <div className="my-1 font-mono text-sm tracking-[0.03em] text-brand">
                      {[e.company, e.location].filter(Boolean).join(" · ")}
                    </div>
                    <p className="max-w-[62ch] text-base leading-[1.6] text-ink-soft">{e.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* STACK */}
      <section id="skills" className="border-b border-border py-[90px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>05</span>
              <h2 className={h2}>Tech stack</h2>
            </div>
            <div className="grid grid-cols-3 gap-10 max-md:grid-cols-1">
              {stack.map((col) => (
                <div key={col.heading}>
                  <h4 className="mb-[18px] border-b border-border pb-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-brand">
                    {col.heading}
                  </h4>
                  <ul>
                    {col.items.map((it) => (
                      <li key={it} className="py-1.5 text-base text-ink-soft">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS (only when there are some) */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="border-b border-border py-[90px]">
          <div className={wrap}>
            <Reveal>
              <div className={secHead}>
                <span className={idx}>06</span>
                <h2 className={h2}>What people say</h2>
              </div>
              <div className="grid grid-cols-2 gap-[22px] max-md:grid-cols-1">
                {testimonials.map((t) => (
                  <figure key={t.id} className="rounded border border-dashed border-border bg-card p-8">
                    <div className="font-serif text-[52px] leading-[0.5] text-brand">”</div>
                    <blockquote className="my-5 font-serif text-xl italic leading-[1.5] text-muted-foreground">
                      {t.quote}
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border border-border bg-secondary" />
                      <div>
                        <div className="text-sm text-foreground">{t.authorName}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {[t.authorRole, t.authorCompany].filter(Boolean).join(" · ")}
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* WRITING */}
      <section id="writing" className="border-b border-border py-[90px]">
        <div className={wrap}>
          <div className={secHead}>
            <span className={idx}>07</span>
            <h2 className={h2}>Writing</h2>
            <Link href="/blog" className="self-center font-mono text-[13px] text-brand hover:underline">
              View all →
            </Link>
          </div>
          {posts.items.length === 0 ? (
            <p className="font-mono text-[13px] text-muted-foreground">No published posts yet.</p>
          ) : (
            <div className="flex flex-col">
              {posts.items.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="grid grid-cols-[130px_1fr_auto] items-center gap-[30px] border-b border-border py-6 transition-[padding] hover:pl-2.5 max-sm:grid-cols-1 max-sm:gap-1.5"
                >
                  <div className="font-mono text-xs text-muted-foreground">{fmtDate(p.publishedAt)}</div>
                  <h3 className="font-serif text-[22px] font-medium">{p.title}</h3>
                  <div className="text-lg text-brand max-sm:hidden">→</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-[90px]">
        <div className={wrap}>
          <div className="grid grid-cols-2 items-start gap-[60px] max-md:grid-cols-1 max-md:gap-10">
            <div>
              <div className="mb-7 flex items-baseline gap-4">
                <span className={idx}>08</span>
              </div>
              <h2 className="font-serif text-[clamp(34px,5vw,56px)] font-normal leading-[1.05] tracking-[-0.02em]">
                <Headline parts={contact.headline} />
              </h2>
              <p className="mt-[22px] max-w-[42ch] text-lg text-ink-soft">{contact.blurb}</p>
              <div className="mt-[34px] flex flex-col">
                <ContactMethod k="Email" href={`mailto:${site.email}`}>
                  {site.email}
                </ContactMethod>
                <ContactMethod k="Phone" href={site.phone.href}>
                  {site.phone.display}
                </ContactMethod>
                <ContactMethod k="WhatsApp" href={site.whatsapp.href} external>
                  {site.whatsapp.display}
                </ContactMethod>
                <ContactMethod k="LinkedIn" href={site.socials.linkedin} external>
                  henson-kudi-amah
                </ContactMethod>
                <ContactMethod k="GitHub" href={site.socials.github} external>
                  Henson-Kudi
                </ContactMethod>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}

function ContactMethod({
  k,
  href,
  external,
  children,
}: {
  k: string
  href: string
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="flex items-center gap-3.5 border-b border-border py-3.5 text-base transition-colors hover:text-brand"
    >
      <span className="w-[90px] font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        {k}
      </span>
      {children}
    </a>
  )
}

function ProjectRow({ project: p, reversed }: { project: Project; reversed: boolean }) {
  return (
    <div className="grid grid-cols-[1.1fr_1fr] overflow-hidden rounded-[3px] border border-border bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)] max-md:grid-cols-1">
      <div
        className={`relative min-h-[300px] max-md:min-h-[180px] ${reversed ? "md:order-2" : ""}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, hsl(var(--paper-2)) 0 12px, hsl(var(--card)) 12px 24px)",
        }}
      >
        <div className="absolute inset-0 grid place-items-center font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
          [ {p.title.toLowerCase()} ]
        </div>
      </div>
      <div className="flex flex-col p-11 max-sm:p-7">
        {p.badge && (
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-brand">{p.badge}</div>
        )}
        <h3 className="my-3 font-serif text-[32px] font-medium tracking-[-0.015em]">{p.title}</h3>
        {(p.role || p.org) && (
          <div className="-mt-1 font-serif text-sm italic text-muted-foreground">
            {[p.role, p.org].filter(Boolean).join(" — ")}
          </div>
        )}
        <p className="mt-3.5 text-base leading-[1.65] text-ink-soft">{p.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {p.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full border border-border px-2.5 py-[5px] font-mono text-[11px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <Link
          href={`/projects/${p.slug}`}
          className="mt-auto inline-flex items-center gap-[7px] pt-6 text-sm text-brand hover:underline"
        >
          View project →
        </Link>
      </div>
    </div>
  )
}
