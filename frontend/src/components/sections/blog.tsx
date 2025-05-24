import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Blog() {
  const blogPosts = [
    {
      title: "Building Modern Web Applications with Next.js",
      excerpt:
        "Learn how to create performant and scalable web applications using Next.js and modern development practices.",
      image: "/placeholder.svg?height=200&width=400",
      category: "Web Development",
      readingTime: 5,
      publishedAt: "2024-01-15",
      slug: "building-modern-web-applications-nextjs",
    },
    {
      title: "The Future of Frontend Development",
      excerpt: "Exploring upcoming trends and technologies that will shape the future of frontend development.",
      image: "/placeholder.svg?height=200&width=400",
      category: "Technology",
      readingTime: 7,
      publishedAt: "2024-01-10",
      slug: "future-of-frontend-development",
    },
    {
      title: "Optimizing React Performance",
      excerpt:
        "Best practices and techniques for optimizing React applications for better performance and user experience.",
      image: "/placeholder.svg?height=200&width=400",
      category: "React",
      readingTime: 6,
      publishedAt: "2024-01-05",
      slug: "optimizing-react-performance",
    },
  ]

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Blog Posts</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on web development and technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card key={index} className="glass-effect overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4" variant="secondary">
                  {post.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readingTime} min read
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="ghost" asChild className="w-full">
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/blog">
              View All Posts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}