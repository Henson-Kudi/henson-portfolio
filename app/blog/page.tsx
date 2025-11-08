import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ExternalLink } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { ShareButton } from "@/components/share-button"
import { allBlogPosts } from "@/data/blog-data"

export const metadata = {
  title: "Blog",
  description: "Technical articles, insights, and thoughts on software engineering by Giovani Moutinho.",
}

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div>
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground mb-8">Thoughts, insights, and technical articles</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allBlogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col bg-zinc-900/50 border-zinc-800/50">
            <div className="aspect-video w-full overflow-hidden">
              {post.image ? (
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={500}
                  height={300}
                  className="object-cover transition-all hover:scale-105"
                />
              ) : (
                <PlaceholderImage
                  type="blog"
                  title={post.title}
                  className="w-full h-full transition-all hover:scale-105"
                />
              )}
            </div>
            <CardContent className="flex flex-col flex-grow p-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
                <ShareButton title={post.title} url={`https://mgiovani.com/blog/${post.slug}`} className="ml-auto" />
              </div>
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-zinc-400 mb-4 flex-grow">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-zinc-800 text-zinc-300 rounded-full px-3 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="default" size="sm" className="bg-white text-black hover:bg-zinc-200">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Read Article
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
