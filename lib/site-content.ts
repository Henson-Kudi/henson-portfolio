// Static homepage content (the parts not managed in the CMS). Projects,
// posts, testimonials and SEO come from the DB; this is the editorial copy.

export const site = {
  name: "Henson Kudi Amah",
  role: "Senior Full-Stack Engineer & Team Lead",
  email: "contact@amahkudi.dev",
  phone: { display: "+971 58 862 9213", href: "tel:+971588629213" },
  // WhatsApp click-to-chat: same number, international format, no + or spaces.
  whatsapp: {
    display: "+971 58 862 9213",
    href: "https://wa.me/971588629213?text=" + encodeURIComponent("Hi Henson, I'd like to talk about a project."),
  },
  location: "Dubai, UAE",
  website: "https://amahkudi.dev",
  socials: {
    linkedin: "https://www.linkedin.com/in/henson-kudi-amah",
    github: "https://github.com/Henson-Kudi",
  },
  // Set to a Calendly / cal.com URL to enable the "Book a call" link.
  bookingUrl: "",
}

export const hero = {
  availability: "Available for freelance & remote roles — worldwide",
  // `em` renders italic + terracotta inside the headline.
  headline: ["Backend systems that move ", { em: "real money" }, ", built to hold."] as const,
  lede: "I'm Henson — a senior full-stack engineer and team lead in Dubai. I design secure, high-availability microservices for fintech, payments and crypto, and I lead teams that ship them into regulated production.",
  stats: [
    { n: "5+", l: "Years shipping" },
    { n: "VARA", l: "Regulated crypto" },
    { n: "6", l: "Engineers led" },
    { n: "1", l: "Product founded" },
  ],
}

export const about = {
  paragraphs: [
    "I started in **accounting and finance** — which is exactly why I think about money-moving systems the way I do: ledgers must balance, state must reconcile, and nothing can silently drift.",
    "Over the last five years I've built crypto-to-fiat payment backends, a VARA-regulated custodial exchange, and multi-tenant SaaS — mostly in Node.js/NestJS, TypeScript, ASP.NET Core and Python, using Clean Architecture and event-driven patterns on AWS.",
    "I also founded **BizTrack CM**, an offline-first business platform for shop owners in Cameroon. Building for low-connectivity environments taught me to design for constraints most software ignores.",
  ],
  side: [
    { heading: "Based in", items: ["Dubai, UAE · Open to remote worldwide"] },
    {
      heading: "Focus",
      items: [
        "Backend architecture & microservices",
        "Blockchain & custody integration",
        "Technical leadership",
      ],
    },
    { heading: "Languages", items: ["English (native) · French (professional)"] },
  ],
}

export const services = [
  {
    num: "/ 01",
    title: "Backend architecture",
    desc: "Modular microservices with Clean Architecture, DDD and event-driven design — the kind of foundation that survives scale and audits.",
  },
  {
    num: "/ 02",
    title: "Blockchain & payments",
    desc: "EVM, Tron and Bitcoin integration, wallet infrastructure, custody (Fireblocks, Liminal) and crypto-to-fiat flows built for regulated environments.",
  },
  {
    num: "/ 03",
    title: "Full-stack delivery",
    desc: "End-to-end products — React/Next.js and React Native front ends over solid APIs, from first commit to production on AWS.",
  },
  {
    num: "/ 04",
    title: "Technical leadership",
    desc: "Owning roadmap and backlog, running sprints, reviewing code and translating regulatory obligations into shippable specs.",
  },
]

export const experience = [
  {
    when: "Jan 2026 — Present",
    title: "Team Lead & Product Owner",
    co: "ITSEC · Nexus Crypto Exchange · Dubai",
    desc: "Promoted to lead a VARA-regulated custodial crypto exchange end to end — roadmap, backlog and sprint planning for a cross-functional team, while remaining hands-on in architecture and code review.",
  },
  {
    when: "Mar 2025 — Jan 2026",
    title: "Senior Backend Developer",
    co: "Odix Pay · Dubai",
    desc: "Built a crypto-to-fiat card-payment backend in ASP.NET Core with Clean Architecture, multi-chain integration and multi-tenancy, deployed to AWS ECS with GitHub Actions CI/CD.",
  },
  {
    when: "Oct 2024 — Mar 2025",
    title: "Contract Technical Lead",
    co: "NFC Rent · Dubai",
    desc: "Delivered a car-rental platform with fiat & crypto payments and an investment portal for fractional vehicle ownership with smart-contract asset tracking, on Node.js and PostgreSQL.",
  },
  {
    when: "Oct 2022 — Sep 2024",
    title: "Technical Lead / Full-Stack",
    co: "Alba Cars LLC · Dubai",
    desc: "Led six engineers across the SDLC. Refactored a legacy monolith into Node.js microservices, introduced event-driven patterns with Redis Streams and WebSockets, and shipped WCAG-standard React/Next.js SPAs.",
  },
  {
    when: "Sep 2020 — Oct 2022",
    title: "Full-Stack Blockchain Developer",
    co: "Strider Labs LLC · Abu Dhabi",
    desc: "Developed and audited Solidity smart contracts for DeFi and NFT projects with a focus on gas efficiency, and built React dashboards with wallet auth and on-chain analytics.",
  },
]

export const stack = [
  {
    heading: "Languages & backend",
    items: [
      "TypeScript · JavaScript",
      "C# · Python · SQL · Solidity",
      "Node.js · NestJS · Express",
      "ASP.NET Core · Django · Flask",
    ],
  },
  {
    heading: "Architecture & frontend",
    items: [
      "Microservices · Clean Architecture",
      "DDD · Event-Driven · Pub/Sub",
      "REST · TDD",
      "React · Next.js · Vue · Tailwind",
    ],
  },
  {
    heading: "Cloud, data & chain",
    items: [
      "AWS (ECS, EC2, Lambda, RDS, S3)",
      "Docker · Kubernetes · Terraform",
      "PostgreSQL · MongoDB · Redis",
      "EVM · Tron · Bitcoin · custody",
    ],
  },
]

export const contact = {
  headline: ["Let's build something ", { em: "that holds up." }] as const,
  blurb:
    "Available for freelance and remote engagements, in and out of the UAE. Tell me what you're building.",
}
