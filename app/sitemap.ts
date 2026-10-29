import type { MetadataRoute } from "next"
import { publicUrls } from "@/lib/public-urls"

export const dynamic = "force-dynamic"

// /sitemap.xml — every public URL with its last-modified date so crawlers
// pick up new posts and edits quickly. Drafts and scheduled posts are excluded.
export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return publicUrls()
}
