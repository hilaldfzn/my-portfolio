"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Calendar, Clock, Search, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with actual API calls
  const blogPosts = [
    {
      id: 1,
      title: "Building Modern Web Applications with Next.js and Django",
      excerpt: "Learn how to create full-stack applications using Next.js for the frontend and Django for the backend.",
      image: "/placeholder.svg?height=200&width=400",
      category: { name: "Web Development", slug: "web-development" },
      tags: [
        { name: "Next.js", slug: "nextjs" },
        { name: "Django", slug: "django" },
      ],
      readingTime: 8,
      views: 1250,
      publishedAt: "2024-01-15",
      slug: "building-modern-web-applications-nextjs-django",
    },
    {
      id: 2,
      title: "The Future of Frontend Development",
      excerpt: "Exploring upcoming trends and technologies that will shape the future of frontend development.",
      image: "/placeholder.svg?height=200&width=400",
      category: { name: "Technology", slug: "technology" },
      tags: [
        { name: "Frontend", slug: "frontend" },
        { name: "Trends", slug: "trends" },
      ],
      readingTime: 7,
      views: 890,
      publishedAt: "2024-01-10",
      slug: "future-of-frontend-development",
    },
    {
      id: 3,
      title: "Optimizing React Performance",
      excerpt:
        "Best practices and techniques for optimizing React applications for better performance and user experience.",
      image: "/placeholder.svg?height=200&width=400",
      category: { name: "React", slug: "react" },
      tags: [
        { name: "React", slug: "react" },
        { name: "Performance", slug: "performance" },
      ],
      readingTime: 6,
      views: 1100,
      publishedAt: "2024-01-05",
      slug: "optimizing-react-performance",
    },
  ]

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Blog Posts */}
      <div className="space-y-8">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="glass-effect overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="relative h-48 md:h-full">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
              </div>
              <div className="md:w-2/3">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category.name}</Badge>
                    {post.tags.map((tag) => (
                      <Badge key={tag.slug} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readingTime} min read
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views} views
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button asChild>
                    <Link href={`/blog/${post.slug}`}>Read Full Article</Link>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found matching your search.</p>
        </div>
      )}
    </div>
  )
}