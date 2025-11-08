"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  title: string
  url: string
  className?: string
}

export function ShareButton({ title, url, className }: ShareButtonProps) {
  const { toast } = useToast()

  const handleShare = async () => {
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "The post URL has been copied to your clipboard.",
        })
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Could not copy the link to your clipboard.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Button variant="ghost" size="sm" className={className} onClick={handleShare} title="Share this post">
      <Share2 className="h-4 w-4" />
      <span className="sr-only">Share</span>
    </Button>
  )
}
