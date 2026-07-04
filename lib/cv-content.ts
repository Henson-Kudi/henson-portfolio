import { site } from "./site-content"

// Static parts of the generated CV. Experience comes from the DB; everything
// else lives here (edit to update the downloadable CV — no redeploy of code).
export const cvProfile = {
  name: site.name,
  title: site.role,
  location: site.location,
  email: site.email,
  phone: site.phone.display,
  website: "amahkudi.dev",
  linkedin: "linkedin.com/in/henson-kudi-amah",
  github: "github.com/Henson-Kudi",
  summary:
    "Senior full-stack engineer and team lead with 5+ years building secure, high-availability backends for fintech, payments and crypto. I design modular microservices with Clean Architecture, DDD and event-driven patterns on AWS. Starting in accounting and finance, I reason about money-moving systems as ledgers that must balance and reconcile — currently leading a VARA-regulated custodial crypto exchange.",
  skills: [
    {
      group: "Languages",
      items: ["TypeScript", "JavaScript", "C#", "Python", "SQL", "Solidity"],
    },
    {
      group: "Backend & architecture",
      items: [
        "Node.js",
        "NestJS",
        "Express",
        "ASP.NET Core",
        "Django / Flask",
        "Microservices",
        "Clean Architecture",
        "DDD",
        "Event-Driven",
        "REST",
        "TDD",
      ],
    },
    {
      group: "Cloud & DevOps",
      items: ["AWS (ECS, EC2, Lambda, RDS, S3)", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    },
    {
      group: "Data & blockchain",
      items: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "EVM / Ethereum",
        "Tron",
        "Bitcoin",
        "Fireblocks",
        "Liminal",
        "Wallet infrastructure",
      ],
    },
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "French", level: "Professional" },
  ],
}
