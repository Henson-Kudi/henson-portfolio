// Editorial copy for /hire and /about. Static on purpose: these pages change
// rarely and the wording is tuned for search, so edits are a code review away.

export const hirePage = {
  // Title ≤ 60 chars before the " | Henson Kudi Amah" template suffix.
  title: "Hire a Fintech & Crypto Backend Engineer",
  // 150–160 chars.
  description:
    "Freelance senior backend engineer and fractional tech lead in Dubai for fintech, payments and crypto custody. Contract, part-time lead or full-time remote.",
  kicker: "Work with me",
  headline: ["Senior backend engineer for ", { em: "fintech, payments and crypto" }, "."] as const,
  intro:
    "I design and build the money-moving backends regulated companies run on, and I lead the teams that ship them. Available for contract work, fractional tech lead roles and full-time remote positions.",

  whoFor: {
    heading: "Who I work with",
    items: [
      {
        title: "Fintech and payments teams",
        desc: "Card programs, wallets, crypto-to-fiat rails, ledgers and reconciliation. Systems where a silent drift is a compliance incident.",
      },
      {
        title: "Crypto exchanges and custody providers",
        desc: "Custodial wallets, multi-chain integration (EVM, Tron, Bitcoin), provider-agnostic custody (Fireblocks, Liminal) and withdrawal pipelines in regulated environments such as VARA.",
      },
      {
        title: "Founders with a product to ship",
        desc: "Greenfield backends built right the first time: Clean Architecture, event-driven where it pays off, deployed to AWS with CI/CD from day one.",
      },
      {
        title: "Teams that need a lead",
        desc: "Roadmap, backlog, sprints, code review and turning regulatory obligations into shippable specs. I have led teams of six through a legacy-to-microservices rewrite.",
      },
    ],
  },

  engagements: {
    heading: "Ways to engage",
    items: [
      {
        title: "Project contract",
        desc: "A scoped build or integration with a fixed deliverable: a payment backend, a custody integration, a migration off a monolith. Fixed-scope or day rate, agreed after the intro call.",
        meta: "Typically 4–16 weeks",
      },
      {
        title: "Fractional tech lead",
        desc: "Two to three days a week owning architecture, reviews and delivery for a team that has engineers but no senior backend owner.",
        meta: "Monthly, 3-month minimum",
      },
      {
        title: "Full-time remote",
        desc: "Senior backend or team lead roles with companies building in fintech, payments or crypto. Dubai-based, remote worldwide.",
        meta: "Permanent",
      },
    ],
  },

  process: {
    heading: "How a project runs",
    steps: [
      {
        title: "Intro call",
        desc: "30 minutes on what you are building, the constraints and what done looks like. No charge.",
      },
      {
        title: "Written proposal",
        desc: "Scope, architecture outline, milestones, risks and price within a few days of the call.",
      },
      {
        title: "Build in the open",
        desc: "Two-week sprints with a demo at the end of each, a shared board and code in your repository from the first commit.",
      },
      {
        title: "Handover that holds",
        desc: "Runbooks, architecture notes, tests and a recorded walkthrough so your team owns it after I leave.",
      },
    ],
  },

  // Rendered as the FAQ section and emitted as FAQPage JSON-LD. Keep answers
  // self-contained: Google shows them without the surrounding page.
  faq: [
    {
      q: "What do you charge?",
      a: "Project work is quoted as a fixed price for a defined scope or as a day rate for open-ended work. Fractional lead roles are a monthly retainer. I send a written quote after the intro call, once I understand the scope and constraints.",
    },
    {
      q: "Are you available now?",
      a: "I take on a limited number of engagements alongside my current role so each one gets real attention. Send a few lines about the project and I usually reply within two working days with my earliest start date.",
    },
    {
      q: "Which time zones do you work with?",
      a: "I am based in Dubai (GMT+4), which overlaps the full working day in Europe and Africa and the morning in East Asia. For US teams I keep East Coast morning hours for meetings.",
    },
    {
      q: "Do you work remotely?",
      a: "Yes. Most of my work is remote with companies in the UAE, Europe and Africa. I am also open to on-site and hybrid work in Dubai.",
    },
    {
      q: "What stack do you work in?",
      a: "Node.js with NestJS and TypeScript, ASP.NET Core with C#, and Python. PostgreSQL, MongoDB and Redis for data. AWS (ECS, Lambda, RDS, S3), Docker, Kubernetes and Terraform for infrastructure. React, Next.js and React Native when the project needs a front end.",
    },
    {
      q: "Can you integrate crypto custody or blockchain rails?",
      a: "Yes. I have integrated EVM chains, Tron and Bitcoin, built custodial wallet infrastructure, and worked with Fireblocks and Liminal behind a provider-agnostic custody layer for a VARA-regulated exchange.",
    },
    {
      q: "Will you sign an NDA?",
      a: "Yes. Much of my past work is under NDA, which is why some case studies on this site describe the architecture without naming the client.",
    },
    {
      q: "How do we start?",
      a: "Use the form below or email contact@amahkudi.dev with what you are building, your timeline and the stack. I will reply with a few questions and propose a 30-minute call.",
    },
  ],
}

export const aboutPage = {
  title: "About Henson Kudi Amah",
  description:
    "Senior full-stack engineer and team lead in Dubai: from accounting and finance to VARA-regulated crypto custody, payments backends and offline-first software.",
  kicker: "About",
  headline: ["From balancing ledgers to ", { em: "building the systems" }, " that keep them balanced."] as const,
  intro:
    "I'm Henson Kudi Amah, a senior full-stack engineer and team lead based in Dubai. I build secure, high-availability backends for fintech, payments and crypto, and lead the teams that run them in regulated production.",
  // Longer-form story than the homepage paragraphs. **bold** is rendered.
  story: [
    "I started in **accounting and finance**, not software. That background is why I treat every money-moving system as a ledger: it has to balance, every state change has to reconcile, and nothing is allowed to drift quietly. It shapes how I design APIs, model events and write tests.",
    "Since 2020 I have worked across the fintech and crypto stack in the UAE: Solidity smart contracts and on-chain analytics at Strider Labs, a legacy monolith turned into Node.js microservices at Alba Cars where I led six engineers, a car-rental and fractional-ownership platform with fiat and crypto payments at NFC Rent, a crypto-to-fiat card-payment backend in ASP.NET Core at Odix Pay, and today the **VARA-regulated custodial exchange** at ITSEC, where I am team lead and product owner.",
    "Alongside that I founded **BizTrack CM**, an offline-first business platform for shop owners in Cameroon. Designing for places where connectivity comes and goes taught me to build for constraints most software assumes away, and it is the reason I write about offline-first systems.",
    "I prefer Clean Architecture, domain-driven design and event-driven patterns where they earn their keep, boring infrastructure on AWS, and test suites that let a team move fast without breaking money. Outside work I write about reliability patterns for payment systems and custody architecture on this site.",
  ],
  facts: [
    { k: "Based in", v: "Dubai, UAE (GMT+4)" },
    { k: "Working", v: "Remote worldwide, on-site in Dubai" },
    { k: "Since", v: "2020 in software, finance before that" },
    { k: "Languages", v: "English (native), French (professional)" },
    { k: "Current role", v: "Team Lead & Product Owner, ITSEC" },
    { k: "Founded", v: "BizTrack CM" },
  ],
  principles: {
    heading: "How I work",
    items: [
      {
        title: "Correctness before cleverness",
        desc: "Idempotent writes, explicit state machines, reconciliation jobs. The patterns are old because they work.",
      },
      {
        title: "Design for the audit",
        desc: "In regulated products every decision needs a trail. I build the logging, approvals and reports in from the start rather than bolting them on.",
      },
      {
        title: "Ship in small, demoable steps",
        desc: "Two-week sprints with a working demo at the end of each. Stakeholders see progress, and risk surfaces early.",
      },
      {
        title: "Leave the team stronger",
        desc: "Runbooks, architecture notes and reviews that teach. The measure of a lead is what the team can do without them.",
      },
    ],
  },
}
