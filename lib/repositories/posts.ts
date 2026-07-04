import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slug"
import type { PostInput } from "@/lib/validation"
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

export const postsRepo = {
  // Homepage uses listPublished({ pageSize: 4 }) → 4 items + hasMore.
  listAll: (params?: Partial<PageParams>) => page({}, params),
  listPublished: (params?: Partial<PageParams>) => page({ published: true }, params),
  getById: (id: string) => prisma.post.findUnique({ where: { id } }),
  getBySlug: (slug: string) => prisma.post.findUnique({ where: { slug } }),

  create: (data: PostInput) =>
    prisma.post.create({ data: { ...data, slug: data.slug?.trim() || slugify(data.title) } }),

  update: (id: string, data: Partial<PostInput>) => {
    const patch: Partial<PostInput> = { ...data }
    if (data.title && !data.slug) patch.slug = slugify(data.title)
    return prisma.post.update({ where: { id }, data: patch })
  },

  remove: (id: string) => prisma.post.delete({ where: { id } }),

  reorder: (ids: string[]) =>
    prisma.$transaction(
      ids.map((id, i) => prisma.post.update({ where: { id }, data: { order: i } })),
    ),
}
