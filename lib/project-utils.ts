import type { Experience, Project } from "@prisma/client"

// Helpers that turn CMS rows into case-study context without new schema:
// the period comes from the matching experience entry, related writing from
// keyword overlap with posts.

const STOP = new Set([
  "the", "and", "for", "with", "that", "from", "this", "into", "over", "your", "their",
  "built", "build", "platform", "system", "systems", "backend", "crypto", "payment",
  "payments", "saas", "multi", "tenant", "pay", "architecture", "design", "designed", "designing",
  "secure", "security", "infrastructure", "integration", "logic", "management", "flows", "modular",
  "engineer", "developer", "developed", "deployed", "running", "across", "without", "every", "existing",
  "regulated", "regulation", "production", "business", "users", "customer", "owners", "software",
])

function words(s: string | null | undefined): string[] {
  return (s ?? "")
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((w) => w.length > 3 && !STOP.has(w))
}

// The experience row whose company names this project's org or title,
// e.g. org "ITSEC" ↔ company "ITSEC · Nexus Crypto Exchange".
export function experienceForProject(p: Project, experiences: Experience[]): Experience | undefined {
  const needles = [p.org, p.title].filter((s): s is string => Boolean(s)).map((s) => s.toLowerCase())
  return experiences.find((e) => {
    const co = e.company.toLowerCase()
    return needles.some((n) => co.includes(n) || n.includes(co.split(" · ")[0]))
  })
}

export type MatchablePost = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  postType: string | null
  tags: string[]
  keywords: string[]
  primaryKeyword: string | null
  category: string | null
}

// Score posts by overlap between the project's stack / title / summary / key
// challenge and the post's tags, keywords and title. Returns the best few.
export function relatedPostsForProject(p: Project, posts: MatchablePost[], limit = 3): MatchablePost[] {
  const projectTerms = new Set([
    ...p.stack.map((s) => s.toLowerCase()),
    ...words(p.title),
    ...words(p.summary),
    ...words(p.challenges),
    ...words(p.problem),
  ])
  // Compound terms the stack doesn't spell out but the writing does.
  const text = `${p.summary} ${p.overview} ${p.challenges} ${p.problem}`.toLowerCase()
  const compounds: [string, string][] = [
    ["offline", "offline-first"],
    ["custod", "custody"],
    ["idempoten", "idempotency"],
    ["reconcil", "reconciliation"],
    ["sync", "sync"],
    ["tenant", "multi-tenant"],
    ["wallet", "wallet"],
    ["crypto", "crypto"],
    ["payment", "payments"],
    ["chain", "blockchain"],
    ["exchange", "exchange"],
  ]
  for (const [needle, term] of compounds) if (text.includes(needle)) projectTerms.add(term)

  const scored = posts
    .map((post) => {
      const postTerms = [
        ...post.tags,
        ...post.keywords,
        ...(post.primaryKeyword ? [post.primaryKeyword] : []),
        ...(post.category ? [post.category] : []),
        post.title,
      ]
        .join(" ")
        .toLowerCase()
      let score = 0
      for (const term of projectTerms) if (postTerms.includes(term)) score += term.length > 6 ? 2 : 1
      return { post, score }
    })
    // One short shared word is coincidence; ask for two points of overlap.
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.post)
}

// The case-study chapters, in reading order. Only chapters with content render.
export function caseStudyChapters(p: Project): { id: string; label: string; heading: string; body: string }[] {
  const defs = [
    { id: "context", label: "Context", heading: "What it is", body: p.overview },
    { id: "problem", label: "Problem", heading: "The problem to solve", body: p.problem },
    { id: "work", label: "What I did", heading: "What I built and owned", body: p.contribution },
    { id: "challenge", label: "Hard part", heading: "The hardest part", body: p.challenges },
    { id: "outcome", label: "Outcome", heading: "Where it landed", body: p.outcomes },
  ]
  return defs.filter((d): d is typeof d & { body: string } => Boolean(d.body))
}
