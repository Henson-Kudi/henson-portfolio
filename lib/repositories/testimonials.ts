import { prisma } from "@/lib/prisma"
import type { TestimonialInput } from "@/lib/validation"

export const testimonialsRepo = {
  listAll: () => prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
  listPublished: () =>
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  getById: (id: string) => prisma.testimonial.findUnique({ where: { id } }),

  create: (data: TestimonialInput) => prisma.testimonial.create({ data }),
  update: (id: string, data: Partial<TestimonialInput>) =>
    prisma.testimonial.update({ where: { id }, data }),
  remove: (id: string) => prisma.testimonial.delete({ where: { id } }),

  reorder: (ids: string[]) =>
    prisma.$transaction(
      ids.map((id, i) => prisma.testimonial.update({ where: { id }, data: { order: i } })),
    ),
}
