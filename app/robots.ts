import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/post-utils"

// /robots.txt — crawl everything public, keep the admin, auth and API out of
// the index, and point crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/auth/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
