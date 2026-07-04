import { prisma } from "@/lib/prisma"
import type { SeoInput } from "@/lib/validation"

const HOMEPAGE = "homepage"

export const seoRepo = {
  get: () => prisma.seoSettings.findUnique({ where: { id: HOMEPAGE } }),

  update: (data: SeoInput) =>
    prisma.seoSettings.upsert({
      where: { id: HOMEPAGE },
      update: data,
      create: { id: HOMEPAGE, ...data },
    }),
}
