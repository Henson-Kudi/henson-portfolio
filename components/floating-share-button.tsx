"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Linkedin, Share2, Twitter, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FloatingShareButtonProps {
  title: string
  url: string
}

export function FloatingShareButton({ title, url }: FloatingShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const toggleShareMenu = () => {
    setIsOpen(!isOpen)
  }

  // Handle sharing to Twitter
  const shareToTwitter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  // Handle sharing to LinkedIn
  const shareToLinkedIn = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  // Handle sharing to Facebook
  const shareToFacebook = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  // Handle copying link to clipboard
  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied!",
        description: "The post URL has been copied to your clipboard.",
      })
      setIsOpen(false)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to your clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800"
          onClick={toggleShareMenu}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
        </Button>

        {isOpen && (
          <div className="flex flex-col space-y-2 animate-in fade-in slide-in-from-left-5 duration-300">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800"
              onClick={shareToTwitter}
              title="Share on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800"
              onClick={shareToLinkedIn}
              title="Share on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800"
              onClick={shareToFacebook}
              title="Share on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
