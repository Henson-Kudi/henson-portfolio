import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Analytics } from "@vercel/analytics/react"
import { fontVariables } from "@/lib/fonts"
import { Providers } from "@/components/providers"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://amahkudi.dev"),
  title: {
    default: "Henson Kudi Amah — Senior Full-Stack Engineer & Team Lead",
    template: "%s | Henson Kudi Amah",
  },
  description:
    "Senior full-stack engineer in Dubai building secure, high-availability backends for fintech, payments and crypto.",
  authors: [{ name: "Henson Kudi Amah" }],
  creator: "Henson Kudi Amah",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Theme is stored in a cookie and applied server-side — no client init
  // script (avoids React 19's script warning) and no flash of the wrong theme.
  const isDark = (await cookies()).get("theme")?.value === "dark"

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontVariables}${isDark ? " dark" : ""}`}
    >
      {/* suppressHydrationWarning: browser extensions add attributes to <body>. */}
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background font-sans text-foreground antialiased"
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
