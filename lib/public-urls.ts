import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { postsRepo } from "@/lib/repositories/posts"
import { SITE_URL } from "@/lib/post-utils"
import { hirePage, aboutPage } from "@/lib/hire-content"

// Every public, indexable URL with its last-modified date. One source for
// the sitemap and for IndexNow "resubmit everything".
export async function publicUrls(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, experience] = await Promise.all([
    postsRepo.listPublishedForSitemap(),
    prisma.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.experience.findMany({ where: { published: true }, select: { updatedAt: true } }),
  ])

  const newest = (rows: { updatedAt: Date }[]) =>
    rows.reduce<Date | undefined>((acc, p) => (!acc || p.updatedAt > acc ? p.updatedAt : acc), undefined)
  const latest = (...dates: (Date | undefined)[]) =>
    dates.filter((d): d is Date => !!d).sort((a, b) => b.getTime() - a.getTime())[0]
  const latestPost = newest(posts)
  const latestProject = newest(projects)

  return [
    { url: SITE_URL, lastModified: latest(latestPost, latestProject), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: latestProject, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/hire`, lastModified: new Date(hirePage.updated), changeFrequency: "monthly", priority: 0.9 },
    // About shows the experience timeline, so it changes when that does.
    {
      url: `${SITE_URL}/about`,
      lastModified: latest(new Date(aboutPage.updated), newest(experience)),
      changeFrequency: "monthly",
      priority: 0.7,
    },
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
