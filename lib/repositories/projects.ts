import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slug"
import type { ProjectInput } from "@/lib/validation"
import { buildPaginated, normalizePageParams, type PageParams } from "@/lib/pagination"

const orderBy = { order: "asc" } as const

async function page(where: { published?: boolean }, params?: Partial<PageParams>) {
  const { page, pageSize } = normalizePageParams(params)
  const [items, total] = await prisma.$transaction([
    prisma.project.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.project.count({ where }),
  ])
  return buildPaginated(items, total, { page, pageSize })
}

export const projectsRepo = {
  // Paginated lists (admin sees all; public sees published only).
  // Homepage uses listPublished({ pageSize: 4 }) → 4 items + hasMore.
  listAll: (params?: Partial<PageParams>) => page({}, params),
  listPublished: (params?: Partial<PageParams>) => page({ published: true }, params),
  getById: (id: string) => prisma.project.findUnique({ where: { id } }),
  getBySlug: (slug: string) => prisma.project.findUnique({ where: { slug } }),
  // Ordered slugs + titles of every published project, for prev/next links.
  listPublishedNav: () =>
    prisma.project.findMany({ where: { published: true }, orderBy, select: { slug: true, title: true } }),

  create: (data: ProjectInput) =>
    prisma.project.create({ data: { ...data, slug: data.slug?.trim() || slugify(data.title) } }),

  update: (id: string, data: Partial<ProjectInput>) => {
    const patch: Partial<ProjectInput> = { ...data }
    if (data.title && !data.slug) patch.slug = slugify(data.title)
    return prisma.project.update({ where: { id }, data: patch })
  },

  remove: (id: string) => prisma.project.delete({ where: { id } }),

  reorder: (ids: string[]) =>
    prisma.$transaction(
      ids.map((id, i) => prisma.project.update({ where: { id }, data: { order: i } })),
    ),
}
