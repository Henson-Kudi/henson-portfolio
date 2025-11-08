export type WorkExperience = {
  title: string
  company: string
  period: string
  location: string
  responsibilities: string[]
}

export type Language = {
  name: string
  level: string
  certificate?: string
}

export type Publication = {
  title: string
  description: string
  year: string
  link?: string
}

export type ResumeData = {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string | null
    website: string
    photo?: string
    yearsOfExperience: string
    teamLeadExperience: string
  }
  summary: string[]
  skills: {
    languages: string[]
    architecture: string[]
    cloud: string[]
    data: string[]
    quality: string[]
  }
  experience: WorkExperience[]
  hardSkills: string[]
  softSkills: string[]
  languages: Language[]
  publications: Publication[]
}

const resumeData: ResumeData = {
  personalInfo: {
    name: "Henson Kudi Amah",
    title: "Senior Software Engineer",
    email: "amahkudi@gmail.com",
    phone: "+971588629213",
    location: "Dubai, United Arab Emirates",
    linkedin: "https://www.linkedin.com/in/henson-kudi-amah-64736b190",
    github: "https://github.com/Henson-Kudi/",
    website: "https://amahkudi.dev",
    photo: "/images/profile.jpg",
    yearsOfExperience: "5+ years of coding experience",
    teamLeadExperience: "5+ years leading backend teams on Node Js, Typescript, C#, and AWS",
  },
  summary: ["Seasoned Software Engineer with 4+ years building backend systems, microservices, and blockchain‑integrated applications.I design high‑availability platforms in ASP.NET Core, Node.js, and Python using Clean Architecture and DevOps best practices. I’ve led cross‑functional teams, shipped secure, production‑ready software, and driven technical initiatives across fintech and payments ecosystems."],
  skills: {
    languages: ["Node Js", "C#", "Python", "Express Js", "React Js", "Next js", "Nest Js"],
    architecture: ["Clean Code Architecture", "DDD", "Microservices", "Pub/Sub", "TDD", "Event Driven Architecture (EDA)", "REST"],
    cloud: ["AWS – ECS, EC2, Lambda, RDS, S3", "Docker", "Kubernetes", "GitHub Actions", "Terraform"],
    data: ["PostgreSQL", "MySQL", "MongoDB", "MSSQL", "Redis", "Firebase", "Elasticsearch"],
    quality: ["TDD", "Jest", "Chai", "Mocha", "Cypress", "CI/CD"],
  },
  experience: [
    {
      title: "Senior Backend Developer",
      company: "Odix Pay",
      period: "Mar 2025 – Present",
      location: "Dubai, UAE",
      responsibilities: [
        "Designed and built a robust crypto-to-fiat payment backend enabling users to spend cryptocurrencies via cards.",
        "Architected modular microservices using ASP.NET Core (C#) and Clean Architecture for scalability and maintainability.",
        "Integrated multiple blockchains (Ethereum, Tron, Bitcoin) for real-time transactions and wallet services.",
        "Implemented multi-tenancy to serve multiple business clients with isolated data and logic.",
        "Deployed workloads to AWS ECS using Docker, and automated CI/CD pipelines via GitHub Actions.",
        "Developed secure transaction engines, currency rate services, and wallet sweeping mechanisms.",
        "Monitored infrastructure and application health using CloudWatch, Prometheus, and Grafana."
      ],
    },
    {
      title: "Contract Technical Lead / Full-Stack Developer",
      company: "NFC Rent",
      period: "Oct 2024 – Mar 2025",
      location: "Dubai, UAE",
      responsibilities: [
        "Built a car-rental platform integrating fiat and crypto payments, scheduling, and delivery logistics.",
        "Developed an investment portal enabling fractional vehicle ownership and automated dividend payouts.",
        "Engineered backend services in Node.js (Express) with PostgreSQL under Clean Architecture principles.",
        "Built responsive admin and user interfaces with Next.js (SSR/SEO) for a seamless experience.",
        "Integrated smart-contract asset tracking and wallet modules for reward distribution and transparency."
      ],
    },
    {
      title: "Technical Lead / Full-Stack Developer",
      company: "Alba Cars LLC",
      period: "Oct 2022 – Sept 2024",
      location: "Dubai, UAE",
      responsibilities: [
        "Led a team of six engineers, overseeing sprint planning, code reviews, and end-to-end SDLC.",
        "Refactored a legacy monolith into scalable Node.js microservices, improving release cadence and maintainability.",
        "Developed and optimized Express APIs and PostgreSQL queries for analytics and reporting.",
        "Introduced event-driven patterns using Redis Streams and WebSocket infrastructure for real-time notifications.",
        "Delivered modern SPAs in React/Next.js adhering to WCAG accessibility standards.",
        "Set up CI/CD pipelines using GitHub Actions and Docker, managing AWS ECS, EC2, and CloudWatch environments.",
        "Built Python (Django/Flask) services for reporting dashboards and partner API integrations."
      ],
    },
    {
      title: "Full-Stack Blockchain Developer",
      company: "Strider Labs LLC",
      period: "Sept 2020 – Oct 2022",
      location: "Abu Dhabi, UAE",
      responsibilities: [
        "Developed and audited Solidity smart contracts for DeFi and NFT projects with a focus on gas efficiency and security.",
        "Built blockchain dashboards with React, integrating wallet authentication and on-chain analytics.",
        "Indexed on-chain data and created Node.js APIs for high-performance data querying and visualization.",
        "Automated contract and API testing with Mocha/Chai and custom harnesses.",
        "Developed Python microservices (Flask/Django) for on-chain data indexing and analytics API backends."
      ],
    },
  ],
  hardSkills: [
    // Backend Frameworks & Languages
    "Node.js",
    "Express",
    "NestJS",
    "ASP.NET Core (C#)",
    "Python (Django)",
    "Pythong (Flask)",

    // Architectural Patterns
    "Clean Architecture",
    "Domain-Driven Design (DDD)",
    "Microservices",
    "Event-Driven Architecture",

    // Frontend & UI
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",

    // Cloud & DevOps
    "AWS (EC2, ECS, CloudWatch, Lambda, API Gateway)",
    "Docker",
    "Kubernetes",
    "Terraform",
    "GitHub Actions",
    "CI/CD Pipelines",

    // Databases & Storage
    "PostgreSQL",
    "SQL Server (MSSQL)",
    "MySQL",
    "MongoDB",
    "Redis (Pub/Sub, Streams, Caching)",
    "Elasticsearch",

    // Messaging & Realtime Systems
    "Kafka",
    "RabbitMQ",
    "Redis Streams",
    "Socket.IO",
    "WebSockets",

    // Blockchain & Web3
    "Solidity",
    "Ethers.js",
    "Web3.js",
    "TronWeb",
    "TronGrid",
    "Bitcoin APIs (BlockCypher, Blockstream)",
    "Hardhat",
    "Truffle",
    "NFTs (ERC-721, ERC-1155)",
    "DeFi Protocols",

    // Security & Authentication
    "OAuth2",
    "OpenID Connect (OIDC)",
    "Single Sign-On (SSO)",
    "JWT",
    "2FA/MFA",
    "OWASP Top 10",
    "Secret Management",

    // Testing & Quality Assurance
    "Jest",
    "Mocha",
    "Chai",
    "Cypress (E2E)",
    "TDD",

    // Task Queues & Background Jobs
    "BullMq",
    "Agenda",
    "Cron"
  ],

  softSkills: [
    "Problem Solving",
    "Remote Collaboration",
    "Adaptability",
    "Critical Thinking",
    "Communication",
    "Team Leadership",
  ],
  languages: [
    {
      name: "English",
      level: "Native",
    },
    {
      name: "French",
      level: "Professional"
    },
  ],
  publications: [],
}

export default resumeData
