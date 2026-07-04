import { z } from "zod"

// Shared validation for API routes AND client forms (so the same checks run
// before submitting to the server). Keep field names aligned with Prisma.

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .optional()
  .transform((v) => (v === "" ? undefined : v))

const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only")

export const projectInput = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  slug: slug.optional(),
  badge: z.string().trim().max(40).optional(),
  role: z.string().trim().max(120).optional(),
  org: z.string().trim().max(120).optional(),
  summary: z.string().trim().min(1, "Summary is required").max(400),
  overview: z.string().trim().max(4000).optional(),
  problem: z.string().trim().max(4000).optional(),
  contribution: z.string().trim().max(4000).optional(),
  challenges: z.string().trim().max(4000).optional(),
  outcomes: z.string().trim().max(4000).optional(),
  coverImage: optionalUrl,
  stack: z.array(z.string().trim().min(1)).max(24).default([]),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  caseStudyUrl: optionalUrl,
  confidential: z.boolean().default(false),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
})
export const projectUpdate = projectInput.partial()

export const postInput = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  slug: slug.optional(),
  excerpt: z.string().trim().max(400).optional(),
  body: z.string().default(""),
  coverImage: optionalUrl,
  tags: z.array(z.string().trim().min(1)).max(24).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date().optional(),
  readingMinutes: z.number().int().min(0).max(600).optional(),
  order: z.number().int().min(0).default(0),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
})
export const postUpdate = postInput.partial()

export const testimonialInput = z.object({
  quote: z.string().trim().min(1, "Quote is required").max(600),
  authorName: z.string().trim().min(1, "Author name is required").max(120),
  authorRole: z.string().trim().max(120).optional(),
  authorCompany: z.string().trim().max(120).optional(),
  avatarUrl: optionalUrl,
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
})
export const testimonialUpdate = testimonialInput.partial()

export const seoInput = z.object({
  metaTitle: z.string().trim().min(1, "Title is required").max(160),
  metaDescription: z.string().trim().min(1, "Description is required").max(320),
  keywords: z.array(z.string().trim().min(1)).max(40).default([]),
  author: z.string().trim().max(120).optional(),
  ogImage: optionalUrl,
  canonicalUrl: optionalUrl,
  twitterHandle: z.string().trim().max(40).optional(),
})

export const experienceInput = z.object({
  role: z.string().trim().min(1, "Role is required").max(120),
  company: z.string().trim().min(1, "Company is required").max(160),
  location: z.string().trim().max(120).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(), // null/absent = Present
  summary: z.string().trim().max(2000).default(""),
  highlights: z.array(z.string().trim().min(1)).max(24).default([]),
  published: z.boolean().default(true),
})
export const experienceUpdate = experienceInput.partial()
export type ExperienceInput = z.infer<typeof experienceInput>

export const reorderInput = z.object({ ids: z.array(z.string().min(1)) })

export const contactInput = z.object({
  name: z.string().trim().min(1, "Please add your name").max(120),
  email: z.string().trim().email("Please use a valid email").max(200),
  message: z.string().trim().min(1, "Please add a message").max(5000),
  // Honeypot: real users leave this empty; bots tend to fill every field.
  company: z.string().optional(),
})

export type ProjectInput = z.infer<typeof projectInput>
export type PostInput = z.infer<typeof postInput>
export type TestimonialInput = z.infer<typeof testimonialInput>
export type SeoInput = z.infer<typeof seoInput>
