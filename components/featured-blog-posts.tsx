import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { featuredBlogPosts } from "@/data/blog-data"

interface FeaturedBlogPostsProps {
  className?: string
  showViewAll?: boolean
}

export function FeaturedBlogPosts({ className, showViewAll = true }: FeaturedBlogPostsProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Featured Blog Posts</h2>
          <p className="text-zinc-400">My latest articles and insights</p>
        </div>
        {showViewAll && (
          <Link href="/blog">
            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
              View All Posts
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredBlogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden bg-zinc-900/50 border-zinc-800/50">
            <div className="aspect-video w-full overflow-hidden">
              {post.image ? (
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-all hover:scale-105"
                />
              ) : (
                <PlaceholderImage type="blog" title={post.title} className="transition-all hover:scale-105" />
              )}
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-zinc-400 mb-4">
                {post.excerpt.length > 100 ? post.excerpt.substring(0, 100) + "..." : post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-zinc-800 text-zinc-300 rounded-full px-3 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
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
