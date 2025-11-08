export type Project = {
  id: number
  title: string
  description: string
  image?: string | null
  tags: string[]
  github: string
  demo: string | null
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Website",
    description:
      "A modern e-commerce platform built with a microservices architecture, supporting user authentication, product catalogs, shopping carts, and multiple payment gateways (Stripe). Designed for scalability, performance, and a seamless user shopping experience.",
    image: "/images/project-images/e-commerce-website.png",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Microservices"],
    github: "https://github.com/zufichris/vendor-verse-frontend",
    demo: "https://lux-coral.vercel.app",
  },
  {
    id: 2,
    title: "E-commerce Admin Dashboard",
    description:
      "An admin dashboard for managing products, orders, customers, and payments in real time. Built with role-based access control, analytics dashboards, and responsive UI for both desktop and mobile. Integrates seamlessly with the core e-commerce microservices.",
    image: "/images/project-images/e-commerce-admin.png",
    tags: ["Next.js", "TypeScript", "Node.js", "RBAC", "REST API", "ECS", "Clean Architecture"],
    github: "https://github.com/Henson-Kudi/admin-dashboard",
    demo: "https://admin-dashboard-commerce-five.vercel.app/",
  },
  {
    id: 3,
    title: "Multi-tenant Accounting Software",
    description:
      "A SaaS accounting platform supporting multiple tenants with isolated databases and business logic. Includes invoicing, expense tracking, financial reporting, and user/group management. Built with clean architecture principles and deployed to AWS with CI/CD pipelines.",
    image: "/images/project-images/multi-tenant-acc-soft.png",
    tags: ["Node JS", "PostgreSQL", "AWS", "Docker", "Multi-tenancy", "Microservices"],
    github: "https://github.com/Henson-Kudi?tab=repositories&q=accounting",
    demo: "",
  },
  {
    id: 4,
    title: "Multi-tenant E-commerce Website",
    description:
      "A full-featured e-commerce SaaS platform where each business gets its own subdomain, database, and isolated resources. Features include store setup, product management, payments, analytics, and role-based permissions. Optimized for scalability and client onboarding automation.",
    image: "/images/project-images/multi-tenant-ecommerce.png",
    tags: ["Node.js", "Next.js", "Prisma", "PostgreSQL", "Multi-tenancy", "Microservices"],
    github: "https://github.com/Henson-Kudi?tab=repositories&q=e-commerce",
    demo: "",
  },
  {
    id: 5,
    title: "Crypto Wallet",
    description:
      "A secure, multi-chain crypto wallet supporting Ethereum, Tron, and Bitcoin networks. Enables users to send, receive, and monitor transactions in real time with integrated balance tracking, wallet sweeping, and cold storage management. Built with modular APIs and blockchain SDKs for scalability.",
    image: "/images/project-images/crypto-wallet.png",
    tags: ["Blockchain", "Web3.js", "Ethers.js", "Node.js", "Security", "Tronweb", "Next.js"],
    github: "https://github.com/Henson-Kudi/fluxe-rent-wallet",
    demo: "https://fluxe-rent-wallet.vercel.app/",
  },
  {
    id: 6,
    title: "Crypto Payments System",
    description:
      "A crypto-to-fiat payments backend that allows businesses to accept digital assets and settle in local currency. Supports real-time conversion, transaction monitoring, and card spending via blockchain integrations. Deployed on AWS ECS with CI/CD pipelines and observability tooling.",
    image: "",
    tags: ["ASP.NET Core", "C#", "Blockchain", "AWS", "Crypto Payments"],
    github: "https://github.com/Henson-Kudi",
    demo: "",
  },
];


export const featuredProjects = [projects[0], projects[1], projects[2]]

export default {
  projects,
  featuredProjects,
}
