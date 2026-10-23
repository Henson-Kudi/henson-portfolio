import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"

// Editorial type system:
//  - Newsreader (serif)      → headlines, italic accents
//  - IBM Plex Sans           → body copy
//  - IBM Plex Mono           → labels, kickers, code, metadata
export const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  // 300 and 600 were never used by any serif element; fewer files = fewer late swaps.
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

export const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-sans",
})

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
})

export const fontVariables = `${serif.variable} ${sans.variable} ${mono.variable}`
