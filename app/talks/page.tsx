import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ExternalLink, FileText, MapPin } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

export const metadata = {
  title: "Talks & Presentations",
  description:
    "Conference talks, workshops, and presentations delivered by Giovani Moutinho on software engineering topics.",
}

// Sample talks data
const talks = [
  {
    id: 1,
    title: "Building High-Performance APIs with FastAPI",
    description: "Performance optimization techniques and best practices for building scalable FastAPI services.",
    event: "Python Web Conference 2023",
    date: "June 15, 2023",
    location: "Online",
    image: null,
    slides: "https://speakerdeck.com/mgiovani/building-high-performance-apis-with-fastapi",
    video: "https://www.youtube.com/watch?v=example1",
  },
  {
    id: 2,
    title: "Microservices Architecture with Python",
    description: "Design patterns and implementation strategies for Python microservices architecture.",
    event: "PyCon Brazil 2022",
    date: "October 17, 2022",
    location: "São Paulo, Brazil",
    image: null,
    slides: "https://speakerdeck.com/mgiovani/microservices-architecture-with-python",
    video: "https://www.youtube.com/watch?v=example2",
  },
  {
    id: 3,
    title: "Asynchronous Task Processing in Python Applications",
    description: "Building efficient async task processing systems with Celery and Redis.",
    event: "Python Summit 2022",
    date: "April 8, 2022",
    location: "Online",
    image: null,
    slides: "https://speakerdeck.com/mgiovani/asynchronous-task-processing-in-python",
    video: "https://www.youtube.com/watch?v=example3",
  },
  {
    id: 4,
    title: "GraphQL vs REST: Choosing the Right API Approach",
    description: "Comparing GraphQL and REST APIs: strengths, weaknesses, and implementation considerations.",
    event: "API Conference 2021",
    date: "November 10, 2021",
    location: "Online",
    image: null,
    slides: "https://speakerdeck.com/mgiovani/graphql-vs-rest-choosing-the-right-api-approach",
    video: "https://www.youtube.com/watch?v=example4",
  },
]

export default function TalksPage() {
  return (
    <div className="container py-12">
      <div>
        <h1 className="text-4xl font-bold mb-4">Talks & Presentations</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Conference talks, workshops, and presentations I've delivered
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {talks.map((talk) => (
          <Card key={talk.id} className="overflow-hidden bg-zinc-900/50 border-zinc-800/50">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
              <div className="relative w-full h-[200px] bg-zinc-900">
                {talk.image ? (
                  <Image src={talk.image || "/placeholder.svg"} alt={talk.title} fill className="object-cover" />
                ) : (
                  <PlaceholderImage type="talk" title={talk.title} className="absolute inset-0" />
                )}
              </div>
              <CardContent className="p-5">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{talk.title}</h2>
                    <p className="text-zinc-400 mb-4 line-clamp-1">{talk.description}</p>

                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {talk.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {talk.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link href={talk.slides} target="_blank" rel="noopener noreferrer">
                      <Button variant="default" size="sm" className="bg-white text-black hover:bg-zinc-200">
                        <FileText className="mr-2 h-4 w-4" />
                        Slides
                      </Button>
                    </Link>
                    <Link href={talk.video} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
