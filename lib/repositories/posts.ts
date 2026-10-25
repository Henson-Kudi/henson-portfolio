import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slug"
import type { PostInput } from "@/lib/validation"
import { bodyStats } from "@/lib/post-utils"
import { buildPaginated, normalizePageParams, type PageParams } from "@/lib/pagination"

const orderBy = [
  { order: "asc" },
  { publishedAt: "desc" },
] satisfies Prisma.PostOrderByWithRelationInput[]

async function page(where: { published?: boolean }, params?: Partial<PageParams>) {
  const { page, pageSize } = normalizePageParams(params)
  const [items, total] = await prisma.$transaction([
    prisma.post.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.post.count({ where }),
  ])
  return buildPaginated(items, total, { page, pageSize })
}

// Word count + reading time are derived from the body whenever it is saved,
// so the public page never shows a stale number.
function withStats<T extends Partial<PostInput>>(data: T): T {
  if (typeof data.body !== "string") return data
  return { ...data, ...bodyStats(data.body) }
}

// Fields the public pages need when listing linked posts (hub / related / children).
const linkSelect = { id: true, slug: true, title: true, excerpt: true, postType: true } as const
export type PostLink = Prisma.PostGetPayload<{ select: typeof linkSelect }>

export const postsRepo = {
  // Homepage uses listPublished({ pageSize: 4 }) → 4 items + hasMore.
  listAll: (params?: Partial<PageParams>) => page({}, params),
  listPublished: (params?: Partial<PageParams>) => page({ published: true }, params),
  getById: (id: string) => prisma.post.findUnique({ where: { id } }),
  getBySlug: (slug: string) => prisma.post.findUnique({ where: { slug } }),

  // Published posts by slug, in the order the slugs were given (missing/draft ones dropped).
  getPublishedBySlugs: async (slugs: string[]): Promise<PostLink[]> => {
    if (slugs.length === 0) return []
    const rows = await prisma.post.findMany({
      where: { slug: { in: slugs }, published: true },
      select: linkSelect,
    })
    const bySlug = new Map(rows.map((r) => [r.slug, r]))
    return slugs.map((s) => bySlug.get(s)).filter((r): r is PostLink => Boolean(r))
  },

  // Published posts that name `slug` as their hub → the hub's "down" links.
  getPublishedChildren: (slug: string): Promise<PostLink[]> =>
    prisma.post.findMany({ where: { hubSlug: slug, published: true }, orderBy, select: linkSelect }),

  // Published posts with the fields needed to match them to a project
  // (tags / keywords / title) for the "Related writing" box on case studies.
  listPublishedForMatching: () =>
    prisma.post.findMany({
      where: { published: true },
      select: { ...linkSelect, tags: true, keywords: true, primaryKeyword: true, category: true },
      orderBy,
    }),

  // For the sitemap.
  listPublishedForSitemap: () =>
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy,
    }),

  create: (data: PostInput) =>
    prisma.post.create({
      data: withStats({ ...data, slug: data.slug?.trim() || slugify(data.title) }),
    }),

  update: (id: string, data: Partial<PostInput>) => {
    const patch: Partial<PostInput> = withStats({ ...data })
    if (data.title && !data.slug) patch.slug = slugify(data.title)
    return prisma.post.update({ where: { id }, data: patch })
  },

  remove: (id: string) => prisma.post.delete({ where: { id } }),

  reorder: (ids: string[]) =>
    prisma.$transaction(
      ids.map((id, i) => prisma.post.update({ where: { id }, data: { order: i } })),
    ),
}
