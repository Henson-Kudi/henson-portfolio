import { postsRepo } from "@/lib/repositories/posts"
import { htmlToText, postUrl, AUTHOR, SITE_URL } from "@/lib/post-utils"

export const dynamic = "force-dynamic"

// /feed.xml — RSS 2.0 of published posts. Feed readers and some crawlers
// poll this to discover new writing without waiting for a recrawl.
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export async function GET() {
  const { items } = await postsRepo.listPublished({ page: 1, pageSize: 50 })
  const latest = items.reduce<Date | undefined>(
    (acc, p) => (!acc || p.updatedAt > acc ? p.updatedAt : acc),
    undefined,
  )

  const entries = items
    .map((p) => {
      const url = postUrl(p.slug)
      const summary = p.seoDescription || p.excerpt || htmlToText(p.body).slice(0, 300)
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${(p.publishedAt ?? p.createdAt).toUTCString()}</pubDate>
      <description>${esc(summary)}</description>
      ${p.tags.map((t) => `<category>${esc(t)}</category>`).join("\n      ")}
      ${p.coverImage ? `<enclosure url="${esc(p.coverImage)}" type="image/png" length="0" />` : ""}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(AUTHOR.name)} — Writing</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Writing on backend architecture, crypto custody, payments and offline-first design.</description>
    <language>en</language>
    ${latest ? `<lastBuildDate>${latest.toUTCString()}</lastBuildDate>` : ""}
${entries}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
    },
  })
}
