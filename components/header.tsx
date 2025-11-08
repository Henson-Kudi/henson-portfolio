import Link from "next/link"
import { HeaderClient } from "./header-client"

// Navigation items - defined server-side
const navItems = [
  { name: "Home", path: "/" },
  { name: "Resume", path: "/resume" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6">
          <span className="text-xl font-bold">@HK</span>
        </Link>

        {/* Desktop Navigation -P Server Rendered */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              // We'll handle active state on the client
              className="text-sm font-medium transition-colors hover:text-white text-zinc-400"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Client-side mobile menu handling */}
        <HeaderClient navItems={navItems} />
      </div>
    </header>
  )
}
