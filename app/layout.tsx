import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: {
    default: "Henson Kudi Amah | Senior Software Engineer",
    template: "%s | Henson Kudi Amah",
  },
  description:
    "Experienced Software Engineer with 5+ years in software development, microservices, and blockchain integration. Expert in Node.js, ASP.NET Core, and Python.",
  keywords: ["Software Engineer", "Python Developer", "Node.js", "Node Js Developer", "Backend Development", "Software Development", "Typescript", "C#", "Microservices", "CICD", "DevOps", "Frontend Developer", "Fullstack Developer", "Docker", "Kubernetes", "Henson Kudi Amah"],
  authors: [{ name: "Henson Kudi Amah" }],
  creator: "Henson Kudi Amah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://amahkudi.dev",
    title: "Henson Kudi Amah | Senior Software Engineer",
    description:
      "Experienced Software Engineer with 5+ years in software development, microservices, and blockchain integration. Expert in Node.js, ASP.NET Core, and Python.",
    siteName: "Henson's Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Henson Kudi Amah | Senior Software Engineer",
    description:
      "Experienced Software Engineer with 5+ years in software development, microservices, and blockchain integration. Expert in Node.js, ASP.NET Core, and Python.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  generator: 'Next.js'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'
