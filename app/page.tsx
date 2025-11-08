import { ServerHeroSection } from "@/components/server-hero-section"
import { FeaturedProjects } from "@/components/featured-projects"
import { ArrowRight, Code2 } from "lucide-react"
import Link from "next/link"
import resumeData from "@/data/resume-data"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container h-full flex flex-col py-16">
        {/* Server-rendered Hero Section */}
        <ServerHeroSection />

        {/* Professional Summary Section - Simplified */}
        <div className="mt-16 pt-16 border-t border-border/50 w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">About Me</h2>
          </div>
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed text-lg max-w-none">{resumeData.summary[0]}</p>
            <div>
              <Link href="/resume" className="inline-flex items-center text-primary hover:text-primary/80 group">
                <span className="underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary/60 transition-colors">
                  View my full resume
                </span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Projects Section */}
        <div className="mt-24 w-full">
          <FeaturedProjects />
        </div>
      </div>
    </div>
  )
}
