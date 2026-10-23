import Link from "next/link"
import type { Project } from "@prisma/client"

const stripes =
  "repeating-linear-gradient(135deg, hsl(var(--paper-2)) 0 12px, hsl(var(--card)) 12px 24px)"

export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded border border-border bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)]"
    >
      <div className="relative h-[180px] border-b border-border" style={{ backgroundImage: stripes }}>
        {p.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverImage} alt={`${p.title} cover`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {p.badge && (
          <span className="absolute left-3.5 top-3.5 z-10 rounded-[2px] bg-brand px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white">
            {p.badge}
          </span>
        )}
        {!p.coverImage && (
          <div className="absolute inset-0 grid place-items-center font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            [ {p.title.toLowerCase()} ]
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-serif text-[28px] font-medium tracking-[-0.01em]">{p.title}</h3>
        {(p.role || p.org) && (
          <div className="mb-3 mt-1.5 font-serif text-sm italic text-muted-foreground">
            {[p.role, p.org].filter(Boolean).join(" · ")}
          </div>
        )}
        <p className="text-[15px] leading-[1.6] text-ink-soft">{p.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full border border-border px-2.5 py-[5px] font-mono text-[11px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <span className="mt-auto inline-flex items-center gap-[7px] pt-[22px] text-sm text-brand">
          View project →
        </span>
      </div>
    </Link>
  )
}
