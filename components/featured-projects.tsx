import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import projectsData from "@/data/projects-data"

interface FeaturedProjectsProps {
  className?: string
  showViewAll?: boolean
}

export function FeaturedProjects({ className, showViewAll = true }: FeaturedProjectsProps) {
  const { featuredProjects } = projectsData


  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
          <p className="text-muted-foreground">Some of my recent work and contributions</p>
        </div>
        {showViewAll && (
          <Link href="/projects">
            <Button variant="default" className="group">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project) => (
          <Card
            key={project.id}
            className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-border"
          >
            <CardHeader className="p-0">
              <div className="aspect-video w-full overflow-hidden bg-muted/50">
                {project.image ? (
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <PlaceholderImage
                    type="project"
                    title={project.title}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                {project.demo && (
                  <Link href={project.demo} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="sm" className="w-full group">
                      <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Demo
                    </Button>
                  </Link>
                )}
                <Link href={`${project.github}?source=mgiovani.com`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full group">
                    <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Code
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
