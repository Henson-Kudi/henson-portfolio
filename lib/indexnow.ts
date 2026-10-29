import { SITE_URL } from "@/lib/post-utils"

// IndexNow: tell Bing (and Yandex, Naver, Seznam, DuckDuckGo via Bing) the
// moment a URL is added, changed or removed, instead of waiting for a crawl.
// Google does not take part; Search Console "Request indexing" stays manual.
//
// The key is public by design: search engines fetch <site>/<key>.txt to prove
// the submitter controls the host. Anyone could submit our own URLs with it,
// which is harmless — the API rejects URLs on other hosts.
export const INDEXNOW_KEY = "dc99e77f98d02dac265558134cdcff49"
export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`

const ENDPOINT = "https://api.indexnow.org/IndexNow"
const HOST = new URL(SITE_URL).host

export type IndexNowResult = { ok: boolean; status: number; urls: string[]; skipped?: string }

// Submit up to 10,000 absolute URLs on our host. Never throws: a search-engine
// hiccup must not fail an admin save. 200 and 202 both mean "accepted".
export async function notifyIndexNow(urls: string[]): Promise<IndexNowResult> {
  const list = Array.from(new Set(urls)).filter((u) => u.startsWith(`${SITE_URL}/`) || u === SITE_URL)
  if (list.length === 0) return { ok: true, status: 0, urls: [], skipped: "no urls" }
  if (process.env.NODE_ENV !== "production" && !process.env.INDEXNOW_FORCE) {
    return { ok: true, status: 0, urls: list, skipped: "not production" }
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: INDEXNOW_KEY_LOCATION, urlList: list }),
      signal: AbortSignal.timeout(8000),
    })
    const ok = res.status === 200 || res.status === 202
    if (!ok) console.warn("[indexnow] rejected", res.status, await res.text().catch(() => ""))
    return { ok, status: res.status, urls: list }
  } catch (e) {
    console.warn("[indexnow] failed", e instanceof Error ? e.message : e)
    return { ok: false, status: 0, urls: list }
  }
}

// URLs to refresh when a post changes: the post, the lists that show it,
// and the feed. Also used when a post is unpublished or deleted, so Bing
// re-crawls, sees the 404 and drops it.
export const postUrls = (slug: string) => [`${SITE_URL}/blog/${slug}`, `${SITE_URL}/blog`, SITE_URL, `${SITE_URL}/feed.xml`]
export const projectUrls = (slug: string) => [`${SITE_URL}/projects/${slug}`, `${SITE_URL}/projects`, SITE_URL]
