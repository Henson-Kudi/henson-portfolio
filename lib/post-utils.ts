import type { Post } from "@prisma/client"
import type { PostSource } from "@/lib/validation"

// Shared helpers for posts. Pure functions, safe on both server and client.

// Strip HTML to plain text (good enough for counting words / building a
// description — not a sanitizer).
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

// Word count + reading time (225 wpm, the usual estimate for technical prose).
export function bodyStats(html: string): { wordCount: number; readingMinutes: number } {
  const text = htmlToText(html)
  const wordCount = text ? text.split(" ").length : 0
  return { wordCount, readingMinutes: wordCount === 0 ? 0 : Math.max(1, Math.round(wordCount / 225)) }
}

// `sources` is a Json column; narrow it to the shape the form writes.
export function postSources(p: Pick<Post, "sources">): PostSource[] {
  if (!Array.isArray(p.sources)) return []
  return p.sources.filter(
    (s): s is PostSource =>
      typeof s === "object" &&
      s !== null &&
      typeof (s as PostSource).label === "string" &&
      typeof (s as PostSource).url === "string",
  )
}

export const SITE_URL = "https://amahkudi.dev"
export const postUrl = (slug: string) => `${SITE_URL}/blog/${slug}`
export const AUTHOR = { name: "Henson Kudi Amah", url: SITE_URL }

// The subset of a post the JSON-LD needs. Plain strings so the admin form can
// build a live preview from its own state before anything is saved.
export type ArticleLdInput = {
  slug: string
  title: string
  seoTitle?: string | null
  seoDescription?: string | null
  excerpt?: string | null
  coverImage?: string | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
  primaryKeyword?: string | null
  keywords?: string[]
  tags?: string[]
  category?: string | null
  wordCount?: number | null
  canonicalUrl?: string | null
}

const iso = (d: Date | string | null | undefined) => {
  if (!d) return undefined
  const dt = typeof d === "string" ? new Date(d) : d
  return Number.isNaN(dt.getTime()) ? undefined : dt.toISOString()
}

// schema.org Article — what Google reads for rich results. Keyword order:
// primary first, then secondary, then tags (deduplicated).
export function buildArticleJsonLd(p: ArticleLdInput) {
  const keywords = Array.from(
    new Set([p.primaryKeyword, ...(p.keywords ?? []), ...(p.tags ?? [])].filter((k): k is string => !!k)),
  )
  const url = p.canonicalUrl || postUrl(p.slug)
  const published = iso(p.publishedAt)
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt || undefined,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    datePublished: published,
    dateModified: iso(p.updatedAt) ?? published,
    image: p.coverImage || undefined,
    mainEntityOfPage: url,
    url,
    keywords: keywords.length ? keywords.join(", ") : undefined,
    articleSection: p.category || undefined,
    wordCount: p.wordCount || undefined,
    inLanguage: "en",
  }
  return Object.fromEntries(Object.entries(ld).filter(([, v]) => v !== undefined))
}

// Where the primary keyword shows up — the on-page checklist from the
// publishing pack. Each entry is a place the keyword should (ideally) appear.
export function keywordPlacement(kw: string, p: { title: string; slug: string; seoDescription?: string | null; body: string; tags?: string[] }) {
  const k = kw.trim().toLowerCase()
  if (!k) return []
  const has = (s: string | null | undefined) => (s ?? "").toLowerCase().includes(k)
  const slugForm = k.replace(/[^a-z0-9]+/g, "-")
  const h2s = Array.from(p.body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)).map((m) => htmlToText(m[1]))
  const firstParagraph = htmlToText(p.body.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? "")
  return [
    { where: "Title", ok: has(p.title) },
    { where: "Slug", ok: p.slug.toLowerCase().includes(slugForm) },
    { where: "Meta description", ok: has(p.seoDescription) },
    { where: "Opening paragraph", ok: has(firstParagraph) },
    { where: "An H2", ok: h2s.some(has) },
    { where: "Tags", ok: (p.tags ?? []).some(has) },
  ]
}
