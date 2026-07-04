import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

const links = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Writing", href: "/#writing" },
  { label: "Contact", href: "/#contact" },
]

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between px-10 max-sm:px-6">
        <Link href="/" className="font-serif text-[22px] font-medium tracking-[-0.01em]">
          Henson<span className="text-brand">.</span>Kudi
        </Link>
        <div className="flex items-center gap-[30px]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft transition-colors hover:text-brand max-md:hidden"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="rounded-[2px] border border-foreground bg-foreground px-[18px] py-[9px] text-sm text-background transition-colors hover:border-brand hover:bg-brand hover:text-white max-md:hidden"
          >
            Hire me
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
