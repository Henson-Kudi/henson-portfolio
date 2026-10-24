import type { Metadata } from "next"
import Link from "next/link"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { PageHead } from "@/components/site/page-head"
import { ProjectCard } from "@/components/site/project-card"
import { ContactForm } from "@/components/site/contact-form"
import { ContactMethods } from "@/components/site/contact-methods"
import { Headline } from "@/components/site/headline"
import { Reveal } from "@/components/site/reveal"
import { projectsRepo } from "@/lib/repositories/projects"
import { testimonialsRepo } from "@/lib/repositories/testimonials"
import { site } from "@/lib/site-content"
import { hirePage as c } from "@/lib/hire-content"
import { SITE_URL, AUTHOR } from "@/lib/post-utils"

export const dynamic = "force-dynamic"

const URL = `${SITE_URL}/hire`

export const metadata: Metadata = {
  title: { absolute: `${c.title} | ${site.name}` },
  description: c.description,
  keywords: [
    "hire backend engineer",
    "freelance backend developer fintech",
    "fractional tech lead",
    "crypto custody developer",
    "payments backend consultant",
    "Node.js NestJS contractor",
    "senior backend engineer Dubai",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: c.title,
    description: c.description,
    siteName: site.name,
    images: [{ url: `${SITE_URL}/images/share-card.jpg`, width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", title: c.title, description: c.description },
}

const wrap = "mx-auto max-w-[1120px] px-10 max-sm:px-6"
const secHead = "mb-[44px] flex items-baseline gap-4"
const idx = "font-mono text-xs text-brand"
const h2 = "font-serif text-[clamp(30px,4vw,46px)] font-normal tracking-[-0.015em]"

export default async function HirePage() {
  const [projects, testimonials] = await Promise.all([
    projectsRepo.listPublished({ pageSize: 3 }),
    testimonialsRepo.listPublished(),
  ])

  // Service (what is offered, by whom, where) + FAQPage (the questions below,
  // eligible for rich results) + Breadcrumb. The provider @id is the Person
  // declared on the homepage so all pages describe one entity.
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Senior backend engineering and technical leadership for fintech, payments and crypto",
        serviceType: "Software development",
        description: c.description,
        url: URL,
        provider: { "@id": AUTHOR.id },
        areaServed: "Worldwide",
        availableLanguage: ["en", "fr"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Ways to engage",
          itemListElement: c.engagements.items.map((e) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: e.title, description: e.desc },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${URL}#faq`,
        mainEntity: c.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Hire", item: URL },
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
        <div className="flex flex-wrap items-center gap-4 py-8">
          <a
            href="#contact"
            className="inline-flex items-center gap-[9px] rounded-[2px] border border-foreground bg-foreground px-6 py-3.5 text-[15px] text-background transition-colors hover:border-brand hover:bg-brand hover:text-white"
          >
            Tell me about your project →
          </a>
          <a
            href="/api/resume?download=1"
            className="inline-flex items-center gap-[9px] rounded-[2px] border border-border px-6 py-3.5 text-[15px] transition-colors hover:border-foreground"
          >
            Download CV
          </a>
          <span className="font-mono text-xs text-muted-foreground">
            {site.location} · remote worldwide · {site.email}
          </span>
        </div>
      </div>

      {/* WHO */}
      <section className="border-t border-border py-[80px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>01</span>
              <h2 className={h2}>{c.whoFor.heading}</h2>
            </div>
            <div className="grid grid-cols-2 gap-px border border-border bg-border max-md:grid-cols-1">
              {c.whoFor.items.map((it) => (
                <div key={it.title} className="bg-background p-9 transition-colors hover:bg-card max-sm:p-7">
                  <h3 className="font-serif text-[24px] font-medium tracking-[-0.01em]">{it.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-muted-foreground">{it.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section className="border-t border-border py-[80px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>02</span>
              <h2 className={h2}>{c.engagements.heading}</h2>
            </div>
            <div className="grid grid-cols-3 gap-[22px] max-md:grid-cols-1">
              {c.engagements.items.map((e) => (
                <div key={e.title} className="flex flex-col rounded border border-border bg-card p-8">
                  <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-brand">{e.meta}</div>
                  <h3 className="mt-3 font-serif text-[26px] font-medium tracking-[-0.01em]">{e.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">{e.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-border py-[80px]">
        <div className={wrap}>
          <Reveal>
            <div className={secHead}>
              <span className={idx}>03</span>
              <h2 className={h2}>{c.process.heading}</h2>
            </div>
            <ol className="grid grid-cols-4 gap-10 max-md:grid-cols-2 max-sm:grid-cols-1">
              {c.process.steps.map((s, i) => (
                <li key={s.title} className="border-t border-border pt-5">
                  <div className="font-mono text-xs text-brand">/ 0{i + 1}</div>
                  <h3 className="mt-3 font-serif text-[22px] font-medium">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-muted-foreground">{s.desc}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* PROOF */}
      {projects.items.length > 0 && (
        <section className="border-t border-border py-[80px]">
          <div className={wrap}>
            <div className={secHead}>
              <span className={idx}>04</span>
              <h2 className={h2}>Recent work</h2>
              <Link href="/projects" className="self-center font-mono text-[13px] text-brand hover:underline">
                All projects →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-[22px] max-md:grid-cols-1">
              {projects.items.map((p) => (
                <Reveal key={p.id}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
            {testimonials.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-[22px] max-md:grid-cols-1">
                {testimonials.slice(0, 2).map((t) => (
                  <figure key={t.id} className="rounded border border-dashed border-border bg-card p-8">
                    <blockquote className="font-serif text-xl italic leading-[1.5] text-muted-foreground">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-4 text-sm">
                      {t.authorName}
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {" "}
                        · {[t.authorRole, t.authorCompany].filter(Boolean).join(" · ")}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="border-t border-border py-[80px]">
        <div className={wrap}>
          <div className={secHead}>
            <span className={idx}>05</span>
            <h2 className={h2}>Questions people ask</h2>
          </div>
          <dl className="grid grid-cols-2 gap-x-[60px] max-md:grid-cols-1">
            {c.faq.map((f) => (
              <div key={f.q} className="border-t border-border py-6">
                <dt className="font-serif text-[22px] font-medium tracking-[-0.01em]">{f.q}</dt>
                <dd className="mt-3 text-[15px] leading-[1.7] text-ink-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-border py-[80px]">
        <div className={wrap}>
          <div className="grid grid-cols-2 items-start gap-[60px] max-md:grid-cols-1 max-md:gap-10">
            <div>
              <div className="mb-7 flex items-baseline gap-4">
                <span className={idx}>06</span>
              </div>
              <h2 className="font-serif text-[clamp(34px,5vw,56px)] font-normal leading-[1.05] tracking-[-0.02em]">
                Tell me what you&apos;re <em className="italic text-brand">building.</em>
              </h2>
              <p className="mt-[22px] max-w-[42ch] text-lg text-ink-soft">
                A few lines about the product, the timeline and the stack is enough to start. I reply
                with questions and a proposed call.
              </p>
              <div className="mt-[34px]">
                <ContactMethods />
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
