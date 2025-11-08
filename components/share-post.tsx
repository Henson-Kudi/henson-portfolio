"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, Facebook, Linkedin, Twitter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SharePostProps {
  title: string
  slug: string
}

export function SharePost({ title, slug }: SharePostProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Construct the full URL for sharing
  const getPostUrl = () => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/blog/${slug}`
  }

  // Handle sharing to Twitter
  const shareToTwitter = () => {
    const url = getPostUrl()
    const text = `Check out this post: ${title}`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  // Handle sharing to LinkedIn
  const shareToLinkedIn = () => {
    const url = getPostUrl()
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  // Handle sharing to Facebook
  const shareToFacebook = () => {
    const url = getPostUrl()
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  // Handle copying link to clipboard
  const copyLink = async () => {
    const url = getPostUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "The post URL has been copied to your clipboard.",
      })

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to your clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Share this post</h2>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={shareToTwitter}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
        <Button variant="outline" onClick={shareToLinkedIn}>
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>
        <Button variant="outline" onClick={shareToFacebook}>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
        <Button variant="outline" onClick={copyLink}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
