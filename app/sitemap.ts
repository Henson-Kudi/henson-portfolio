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

  const newest = (rows: { updatedAt: Date }[]) =>
    rows.reduce<Date | undefined>((acc, p) => (!acc || p.updatedAt > acc ? p.updatedAt : acc), undefined)
  const latestPost = newest(posts)
  const latestProject = newest(projects)
  const latestAny = [latestPost, latestProject]
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0]

  return [
    { url: SITE_URL, lastModified: latestAny, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: latestProject, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/hire`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
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
