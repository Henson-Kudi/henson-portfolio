import Link from "next/link"
import { Github, Linkedin, Mail, Phone } from "lucide-react"
import resumeData from "@/data/resume-data"

export default function Footer() {
  const {personalInfo:{github, linkedin, email, phone}} = resumeData

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Henson Kudi Amah. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={github!}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">E-mail</span>
          </Link>
          <Link
            href={`tel:${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <Phone className="h-5 w-5" />
            <span className="sr-only">Tel</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
