import type { ReactNode } from "react"

export function PageHead({
  kicker,
  title,
  intro,
}: {
  kicker: string
  title: ReactNode
  intro?: string
}) {
  return (
    <div className="border-b border-border pb-10 pt-[70px] max-sm:pt-12">
      <div className="font-mono text-xs uppercase tracking-[0.12em] text-brand">{kicker}</div>
      <h1 className="mt-3.5 font-serif text-[clamp(38px,6vw,68px)] font-normal leading-[1.02] tracking-[-0.02em]">
        {title}
      </h1>
      {intro && <p className="mt-[18px] max-w-[62ch] text-[19px] leading-[1.6] text-ink-soft">{intro}</p>}
    </div>
  )
}
