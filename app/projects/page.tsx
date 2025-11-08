import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ExternalLink, Github } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import projectsData from "@/data/projects-data"
import profileData from '@/data/resume-data'

export const metadata = {
  title: "Projects",
  description: "A collection of technical projects and software engineering work by Giovani Moutinho.",
}

export default function ProjectsPage() {
  const { projects } = projectsData
    const {personalInfo} = profileData

  return (
    <div className="container py-12">
      <div>
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-xl text-muted-foreground mb-8">A collection of my recent work and technical projects</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-4">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden flex flex-col bg-zinc-900/50 border-zinc-800/50">
            <div className="aspect-video w-full overflow-hidden bg-zinc-900">
              {project.image ? (
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-full"
                />
              ) : (
                <PlaceholderImage type="project" title={project.title} className="w-full h-full" />
              )}
            </div>
            <CardContent className="flex flex-col flex-grow p-6">
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-zinc-400 mb-4 flex-grow">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="bg-zinc-800 text-zinc-300 rounded-full px-3 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                {project.demo && (
                  <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                    <Button variant="default" size="sm" className="bg-white text-black hover:bg-zinc-200">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </Button>
                  </Link>
                )}
                <Link href={`${project.github}?source=mgiovani.com`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Link href={personalInfo.github! + '?tab=repositories'} target="_blank" className="inline-flex items-center text-primary hover:text-primary/80 group">
          <span className="underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary/60 transition-colors my-4">
            View my github repositories
          </span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
