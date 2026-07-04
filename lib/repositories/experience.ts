import { prisma } from "@/lib/prisma"
import type { ExperienceInput } from "@/lib/validation"

// Sorted most-recent first (structured dates → no manual ordering needed).
export const experienceRepo = {
  listAll: () => prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
  listPublished: () =>
    prisma.experience.findMany({ where: { published: true }, orderBy: { startDate: "desc" } }),
  getById: (id: string) => prisma.experience.findUnique({ where: { id } }),
  create: (data: ExperienceInput) => prisma.experience.create({ data }),
  update: (id: string, data: Partial<ExperienceInput>) =>
    prisma.experience.update({ where: { id }, data }),
  remove: (id: string) => prisma.experience.delete({ where: { id } }),
}
