import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Content mirrors the design's store.js seed (the canonical, richest version).
// Idempotent: upserts keyed on slug / well-known id, safe to re-run.

const projects = [
  {
    slug: "biztrack-cm",
    title: "BizTrack CM",
    badge: "Founder",
    role: "Founder & Lead Engineer",
    org: "HK-Solutions",
    summary:
      "Offline-first, OHADA-compliant POS & business-management platform for shop owners in Cameroon.",
    overview:
      "BizTrack CM is a business-management and point-of-sale platform built for shop owners in Cameroon, designed to run fully offline on Android in low-connectivity environments. It handles split cash / MTN MoMo / Orange Money payments, inventory, credit and receivables, and generates OHADA-format profit & loss statements.",
    problem:
      "Most small retailers in the region operate in areas with unreliable connectivity, and existing software assumes an always-on connection and Western accounting formats that don't match local regulation.",
    contribution:
      "I designed and built the platform end to end — an offline-first sync architecture, the payment reconciliation logic across three payment rails, and OHADA-compliant reporting. As founder I also own product direction and roadmap.",
    challenges:
      "Designing a conflict-resolving sync layer so a device can operate for days offline and reconcile cleanly on reconnect, without ever losing or double-counting a transaction.",
    outcomes:
      "A working product used by real shop owners, with a codebase structured for multi-tenant expansion across OHADA-region markets.",
    stack: ["React Native", "Expo", "NestJS", "Next.js", "PostgreSQL", "Offline-first"],
    liveUrl: "https://hk-solutions.app",
    confidential: false,
    featured: true,
    published: true,
    order: 0,
  },
  {
    slug: "nexus-crypto-exchange",
    title: "Nexus Crypto Exchange",
    badge: "Team Lead",
    role: "Team Lead & Product Owner",
    org: "ITSEC",
    summary:
      "A VARA-regulated custodial crypto exchange owned end to end — core infrastructure and a provider-agnostic multi-custody layer.",
    overview:
      "Nexus is a VARA-regulated custodial cryptocurrency exchange. I engineered core infrastructure — asset management, deposit and withdrawal flows, and admin tooling — and designed a provider-agnostic multi-custody architecture.",
    problem:
      "The exchange needed to add a second custody provider (Liminal) alongside the incumbent (Fireblocks) without breaking live customer flows or coupling business logic to any single vendor.",
    contribution:
      "Promoted to Team Lead & Product Owner: I own roadmap, backlog and sprint planning for a cross-functional team while staying hands-on in architecture and code review.",
    challenges:
      "Introducing a custody-provider abstraction so providers can be swapped or run in parallel, with zero breaking changes to deposit/withdrawal flows already in production.",
    outcomes:
      "A regulated exchange with a vendor-agnostic custody layer and infrastructure hardened for audit and scale.",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Redis", "Fireblocks", "Liminal", "AWS"],
    confidential: true,
    featured: true,
    published: true,
    order: 1,
  },
  {
    slug: "multi-tenant-accounting-saas",
    title: "Multi-Tenant Accounting SaaS",
    badge: "Architecture",
    role: "Solo architecture & build",
    summary:
      "A SaaS accounting platform with fully isolated per-tenant data and logic — invoicing, expenses, reporting, user & group management.",
    overview:
      "A multi-tenant SaaS accounting platform where each tenant's data and logic are fully isolated. Features include invoicing, expense tracking, financial reporting, and user and group management with role-based access.",
    problem:
      "Serving many organizations from one deployment while guaranteeing that no tenant can ever read or affect another's data.",
    contribution:
      "Sole architect and engineer — data model, tenant isolation strategy, API design, infrastructure and CI/CD.",
    challenges:
      "Choosing and enforcing a tenant-isolation model that stays performant as tenants grow, and wiring it through every query and background job.",
    outcomes: "A deployable multi-tenant foundation with automated CI/CD on AWS.",
    stack: ["Node.js", "Express", "PostgreSQL", "AWS", "Docker", "CI/CD"],
    confidential: false,
    featured: true,
    published: true,
    order: 2,
  },
  {
    slug: "odix-pay",
    title: "Odix Pay",
    badge: "Backend",
    role: "Senior Backend Developer",
    summary:
      "A crypto-to-fiat card-payment backend letting users spend cryptocurrencies via cards.",
    overview:
      "Odix Pay is a payment backend that lets users spend cryptocurrencies through cards. Built as modular ASP.NET Core microservices with Clean Architecture, it integrates Ethereum, Tron and Bitcoin, supports multi-tenancy, and includes secure transaction and wallet-sweeping engines.",
    problem:
      "Bridging on-chain balances to fiat card rails securely, across multiple chains, with strict correctness on every value transfer.",
    contribution:
      "Senior backend developer — built microservices, multi-chain integration, and the secure transaction and wallet-sweeping engines, deployed to AWS ECS.",
    challenges:
      "Designing wallet-sweeping and transaction engines that are correct and secure under concurrency across three different chains.",
    outcomes: "A modular, multi-tenant payment backend running on AWS ECS with CI/CD.",
    stack: ["ASP.NET Core", "C#", "PostgreSQL", "AWS ECS", "Multi-tenant", "EVM / Tron / BTC"],
    confidential: true,
    featured: false,
    published: true,
    order: 3,
  },
]

const posts = [
  {
    slug: "provider-agnostic-crypto-custody",
    title: "Designing provider-agnostic crypto custody",
    excerpt:
      "How to add a second custody provider alongside a live one — without coupling your business logic to either.",
    publishedAt: new Date("2026-06-01"),
    tags: ["architecture", "crypto", "custody"],
    body: "<p>Draft — replace with your real article. Rich text from the admin editor lands here as HTML.</p><h2>The problem</h2><p>Coupling deposit/withdrawal flows directly to a single custody vendor makes migration risky and testing hard.</p><h2>The approach</h2><p>Introduce a provider abstraction with a stable interface, and adapt each vendor behind it.</p>",
    featured: true,
    published: true,
    order: 0,
  },
  {
    slug: "offline-first-low-connectivity",
    title: "Building offline-first for low-connectivity markets",
    excerpt:
      "Lessons from shipping a POS that has to work for days without a network — and reconcile cleanly when it comes back.",
    publishedAt: new Date("2026-05-10"),
    tags: ["offline-first", "mobile", "sync"],
    body: "<p>Draft — replace with your real article.</p><h2>Design for the network you don't have</h2><p>Treat the server as an eventual destination, not a dependency.</p>",
    featured: true,
    published: true,
    order: 1,
  },
  {
    slug: "reconciling-ledger-balance-custody",
    title: "Reconciling ledger, balance and custody state",
    excerpt:
      "An accountant-turned-engineer's take on keeping three sources of truth in agreement.",
    publishedAt: new Date("2026-04-18"),
    tags: ["fintech", "ledgers"],
    body: "<p>Draft — replace with your real article.</p>",
    featured: false,
    published: false, // draft
    order: 2,
  },
]

const experiences = [
  {
    role: "Team Lead & Product Owner",
    company: "ITSEC · Nexus Crypto Exchange",
    location: "Dubai",
    startDate: new Date("2026-01-01"),
    endDate: null,
    summary:
      "Promoted to lead a VARA-regulated custodial crypto exchange end to end — roadmap, backlog and sprint planning for a cross-functional team, while remaining hands-on in architecture and code review.",
    highlights: [],
  },
  {
    role: "Senior Backend Developer",
    company: "Odix Pay",
    location: "Dubai",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2026-01-01"),
    summary:
      "Built a crypto-to-fiat card-payment backend in ASP.NET Core with Clean Architecture, multi-chain integration and multi-tenancy, deployed to AWS ECS with GitHub Actions CI/CD.",
    highlights: [],
  },
  {
    role: "Contract Technical Lead",
    company: "NFC Rent",
    location: "Dubai",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2025-03-01"),
    summary:
      "Delivered a car-rental platform with fiat & crypto payments and an investment portal for fractional vehicle ownership with smart-contract asset tracking, on Node.js and PostgreSQL.",
    highlights: [],
  },
  {
    role: "Technical Lead / Full-Stack",
    company: "Alba Cars LLC",
    location: "Dubai",
    startDate: new Date("2022-10-01"),
    endDate: new Date("2024-09-01"),
    summary:
      "Led six engineers across the SDLC. Refactored a legacy monolith into Node.js microservices, introduced event-driven patterns with Redis Streams and WebSockets, and shipped WCAG-standard React/Next.js SPAs.",
    highlights: [],
  },
  {
    role: "Full-Stack Blockchain Developer",
    company: "Strider Labs LLC",
    location: "Abu Dhabi",
    startDate: new Date("2020-09-01"),
    endDate: new Date("2022-10-01"),
    summary:
      "Developed and audited Solidity smart contracts for DeFi and NFT projects with a focus on gas efficiency, and built React dashboards with wallet auth and on-chain analytics.",
    highlights: [],
  },
]

const seo = {
  metaTitle: "Henson Kudi Amah — Senior Full-Stack Engineer & Team Lead",
  metaDescription:
    "Senior full-stack engineer in Dubai building secure, high-availability backends for fintech, payments and crypto. Available for freelance & remote engagements worldwide.",
  keywords: [
    "senior backend engineer",
    "freelance software engineer Dubai",
    "remote engineer",
    "fintech developer",
    "blockchain developer",
    "microservices",
    "NestJS",
    ".NET",
    "crypto exchange",
    "VARA",
  ],
  author: "Henson Kudi Amah",
  canonicalUrl: "https://amahkudi.dev",
  ogImage: null as string | null,
  twitterHandle: null as string | null,
}

async function main() {
  for (const p of projects) {
    await prisma.project.upsert({ where: { slug: p.slug }, update: p, create: p })
  }
  console.log(`✔ Seeded ${projects.length} projects`)

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {}, // don't clobber edits on re-seed
      create: p,
    })
  }
  console.log(`✔ Seeded ${posts.length} posts`)

  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.createMany({ data: experiences })
    console.log(`✔ Seeded ${experiences.length} experiences`)
  } else {
    console.log("• Experiences already present — skipped")
  }

  await prisma.seoSettings.upsert({
    where: { id: "homepage" },
    update: {}, // don't clobber admin edits
    create: { id: "homepage", ...seo },
  })
  console.log("✔ Seeded homepage SEO settings")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
