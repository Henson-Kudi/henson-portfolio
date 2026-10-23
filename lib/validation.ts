import { z } from "zod"

// Shared validation for API routes AND client forms (so the same checks run
// before submitting to the server). Keep field names aligned with Prisma.

// Optional URL. An empty string means "clear it" → null (Prisma ignores
// undefined, so undefined could never remove a value once saved).
const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .nullable()
  .optional()
  .transform((v) => (v === "" ? null : v))

// Optional free text with the same clear-on-empty behaviour.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v))

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

// A cited source: label + public URL. Stored as JSON on the post.
export const postSource = z.object({
  label: z.string().trim().min(1, "Source label is required").max(160),
  url: z.string().trim().url("Source must be a valid URL"),
})
export type PostSource = z.infer<typeof postSource>

export const postInput = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  slug: slug.optional(),
  excerpt: optionalText(400),
  body: z.string().default(""),
  coverImage: optionalUrl,
  coverAlt: optionalText(400),
  tags: z.array(z.string().trim().min(1)).max(24).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date().optional(),
  readingMinutes: z.number().int().min(0).max(600).optional(),
  wordCount: z.number().int().min(0).optional(),
  order: z.number().int().min(0).default(0),
  // SEO
  seoTitle: optionalText(160),
  seoDescription: optionalText(320),
  primaryKeyword: optionalText(120),
  keywords: z.array(z.string().trim().min(1).max(80)).max(24).default([]),
  canonicalUrl: optionalUrl,
  // Taxonomy
  category: optionalText(120),
  postType: optionalText(60),
  // Internal links — slugs of other posts
  hubSlug: slug
    .or(z.literal(""))
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v)),
  relatedSlugs: z.array(slug).max(24).default([]),
  sources: z.array(postSource).max(40).default([]),
  shareText: optionalText(3000),
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
