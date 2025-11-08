import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Database, FileText, Video } from "lucide-react"

interface PlaceholderImageProps extends HTMLAttributes<HTMLDivElement> {
  type?: "project" | "talk" | "blog" | "publication" | "generic"
  title?: string
  className?: string
}

export function PlaceholderImage({ type = "generic", title, className, ...props }: PlaceholderImageProps) {
  // Simplified icon set with consistent sizing
  const getIcon = () => {
    switch (type) {
      case "project":
        return <FileText className="h-14 w-14 text-blue-400" />
      case "talk":
        return <Video className="h-14 w-14 text-purple-400" />
      case "blog":
        return <FileText className="h-14 w-14 text-emerald-400" />
      case "publication":
        return <Database className="h-14 w-14 text-amber-400" />
      default:
        return <FileText className="h-14 w-14 text-zinc-400" />
    }
  }

  return (
    <div
      className={cn("relative flex flex-col items-center justify-center w-full h-full bg-zinc-900", className)}
      {...props}
    >
      <div className="flex items-center justify-center">{getIcon()}</div>
    </div>
  )
}
