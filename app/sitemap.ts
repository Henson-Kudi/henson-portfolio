import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { postsRepo } from "@/lib/repositories/posts"
import { SITE_URL } from "@/lib/post-utils"

export const dynamic = "force-dynamic"

// /sitemap.xml — every public URL with its last-modified date so crawlers
// pick up new posts and edits quickly. Drafts are excluded.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    postsRepo.listPublishedForSitemap(),
    prisma.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ])

  const latestPost = posts.reduce<Date | undefined>(
    (acc, p) => (!acc || p.updatedAt > acc ? p.updatedAt : acc),
    undefined,
  )

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
