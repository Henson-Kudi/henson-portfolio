import type { ReactNode } from "react"
import { site } from "@/lib/site-content"

// The direct ways to reach Henson. Shared by the homepage contact section
// and /hire so the two never drift apart.
export function ContactMethods() {
  return (
    <div className="flex flex-col">
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
  children: ReactNode
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
