import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import resumeData from "@/data/resume-data"

export function ServerHeroSection() {
  return (
    <div className="grid lg:grid-cols-[1fr_auto] items-start gap-12 lg:gap-16">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">{resumeData.personalInfo.name}</h1>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-xl">{resumeData.personalInfo.title}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <MapPin className="h-4 w-4" />
            <span>{resumeData.personalInfo.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/resume">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 dark:bg-white dark:text-black">
              View Resume
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 dark:border-white/20 dark:text-white"
            >
              Contact Me
            </Button>
          </Link>
        </div>

        <div className="flex gap-6">
          <Link
            href={`${resumeData.personalInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href={`${resumeData.personalInfo.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href={`mailto:${resumeData.personalInfo.email}`}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
          <Link
            href={`tel:${resumeData.personalInfo.phone}`}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span className="sr-only">Phone</span>
          </Link>
        </div>
      </div>

      <div className="flex items-start justify-center lg:justify-end pt-1">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white/10">
          <Image
            src="/images/profile.jpg"
            alt={resumeData.personalInfo.name}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </div>
  )
}
