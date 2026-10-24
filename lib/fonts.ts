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
  // 500 is only ever used on serif elements; dropping it removes a 40 KB critical file.
  weight: ["400", "600"],
  variable: "--font-sans",
})

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  // Small labels only: no need to preload ahead of the document and CSS.
  preload: false,
  weight: ["400"],
  variable: "--font-mono",
})

export const fontVariables = `${serif.variable} ${sans.variable} ${mono.variable}`
