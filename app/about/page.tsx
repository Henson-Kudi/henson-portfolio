import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { PageHead } from "@/components/site/page-head"
import { Headline, Bold } from "@/components/site/headline"
import { Reveal } from "@/components/site/reveal"
import { experienceRepo } from "@/lib/repositories/experience"
import { fmtPeriod } from "@/lib/format"
import { site, stack } from "@/lib/site-content"
import { aboutPage as c } from "@/lib/hire-content"
import { SITE_URL, AUTHOR } from "@/lib/post-utils"

export const dynamic = "force-dynamic"

const URL = `${SITE_URL}/about`
const PORTRAIT = `${SITE_URL}/images/profile.jpg`

export const metadata: Metadata = {
  title: { absolute: `${c.title} | Senior Backend Engineer, Dubai` },
  description: c.description,
  alternates: { canonical: URL },
  openGraph: {
    type: "profile",
    url: URL,
    title: c.title,
    description: c.description,
    siteName: site.name,
    firstName: "Henson",
    lastName: "Kudi Amah",
    images: [{ url: `${SITE_URL}/images/share-card.jpg`, width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", title: c.title, description: c.description },
}

const wrap = "mx-auto max-w-[1120px] px-10 max-sm:px-6"
const secHead = "mb-[44px] flex items-baseline gap-4"
const idx = "font-mono text-xs text-brand"
const h2 = "font-serif text-[clamp(30px,4vw,46px)] font-normal tracking-[-0.015em]"

export default async function AboutPage() {
  const experiences = await experienceRepo.listPublished()
  const current = experiences.find((e) => !e.endDate)

  // ProfilePage whose main entity is the same Person (@id) the homepage and
  // every article point at. This is the page Google should treat as the
  // canonical description of the author.
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${URL}#page`,
        url: URL,
        name: c.title,
        description: c.description,
        mainEntity: { "@id": AUTHOR.id },
      },
      {
        "@type": "Person",
        "@id": AUTHOR.id,
        name: site.name,
        givenName: "Henson",
        familyName: "Kudi Amah",
        jobTitle: site.role,
        description: c.description,
        url: SITE_URL,
        mainEntityOfPage: URL,
        image: PORTRAIT,
        email: `mailto:${site.email}`,
        address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
        sameAs: Object.values(site.socials),
        knowsLanguage: ["en", "fr"],
        knowsAbout: [
          "Fintech",
          "Payments",
          "Crypto custody",
          "Backend architecture",
          "Microservices",
          "Node.js",
          "TypeScript",
          "ASP.NET Core",
          "AWS",
          "Technical leadership",
        ],
        ...(current
          ? { worksFor: { "@type": "Organization", name: current.company.split(" · ")[0] } }
          : {}),
        hasOccupation: { "@type": "Occupation", name: site.role },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "About", item: URL },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
      <SiteNav />
      <div className={wrap}>
        <PageHead kicker={c.kicker} title={<Headline parts={c.headline} />} intro={c.intro} />
      </div>

      {/* STORY + PORTRAIT */}
      <section className="py-[80px]">
        <div className={wrap}>
          <div className="grid grid-cols-[1fr_340px] gap-[60px] max-md:grid-cols-1 max-md:gap-10">
            <div className="space-y-6">
              {c.story.map((p, i) => (
                <p key={i} className="text-[19px] leading-[1.7] text-ink-soft">
                  <Bold text={p} />
                </p>
              ))}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/hire"
                  className="inline-flex items-center gap-[9px] rounded-[2px] border border-foreground bg-foreground px-6 py-3.5 text-[15px] text-background transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  Work with me →
                </Link>
                <a
                  href="/api/resume?download=1"
                  className="inline-flex items-center gap-[9px] rounded-[2px] border border-border px-6 py-3.5 text-[15px] transition-colors hover:border-foreground"
                >
                  Download CV
                </a>
              </div>
            </div>
            <aside>
              <div className="relative aspect-[1050/1350] w-full overflow-hidden rounded border border-border bg-card">
                <Image
                  src="/images/profile.jpg"
                  alt={`Portrait of ${site.name}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 340px"
                  className="object-cover"
                />
              </div>
              <dl className="mt-6">
                {c.facts.map((f) => (
                  <div key={f.k} className="grid grid-cols-[110px_1fr] gap-3 border-b border-border py-[9px] text-[14px]">
                    <dt className="font-mono text-[11px] uppercase leading-[1.9] tracking-[0.08em] text-muted-foreground">
                      {f.k}
                    </dt>
                    <dd className="text-ink-soft">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="border-t border-border py-[80px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>01</span>
              <h2 className={h2}>{c.principles.heading}</h2>
            </div>
            <div className="grid grid-cols-2 gap-px border border-border bg-border max-md:grid-cols-1">
              {c.principles.items.map((it) => (
                <div key={it.title} className="bg-background p-9 transition-colors hover:bg-card max-sm:p-7">
                  <h3 className="font-serif text-[24px] font-medium tracking-[-0.01em]">{it.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-muted-foreground">{it.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="border-t border-border py-[80px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>02</span>
              <h2 className={h2}>Experience</h2>
            </div>
            <div className="border-t border-border">
              {experiences.map((e) => (
                <article
                  key={e.id}
                  className="grid grid-cols-[180px_1fr] gap-10 border-b border-border py-[30px] max-md:grid-cols-1 max-md:gap-2"
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
                    {e.highlights.length > 0 && (
                      <ul className="mt-3 max-w-[62ch] list-disc space-y-1 pl-5 text-[15px] leading-[1.6] text-muted-foreground">
                        {e.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* STACK */}
      <section className="border-t border-border py-[80px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>03</span>
              <h2 className={h2}>Tech stack</h2>
            </div>
            <div className="grid grid-cols-3 gap-10 max-md:grid-cols-1">
              {stack.map((col) => (
                <div key={col.heading}>
                  <h3 className="mb-[18px] border-b border-border pb-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-brand">
                    {col.heading}
                  </h3>
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

      {/* CTA */}
      <section className="border-t border-border py-[80px]">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-6`}>
          <div>
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-normal tracking-[-0.015em]">
              Building something that moves money?
            </h2>
            <p className="mt-2 text-lg text-ink-soft">See how I work with teams, or read the writing.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/hire"
              className="inline-flex items-center rounded-[2px] border border-foreground bg-foreground px-6 py-3.5 text-[15px] text-background transition-colors hover:border-brand hover:bg-brand hover:text-white"
            >
              Work with me →
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center rounded-[2px] border border-border px-6 py-3.5 text-[15px] transition-colors hover:border-foreground"
            >
              Writing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
