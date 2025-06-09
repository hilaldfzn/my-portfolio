"use client"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Calendar, Clock, Eye, Heart, Bookmark } from "lucide-react"
import Image from "next/image"
import SocialShare from "./social-share"

interface BlogPostProps {
  post: {
    id: number
    title: string
    content: string
    featuredImage: string
    category: { name: string; slug: string }
    tags: { name: string; slug: string }[]
    readingTime: number
    views: number
    publishedAt: string
  }
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{post.category.name}</Badge>
          {post.tags.map((tag) => (
            <Badge key={tag.slug} variant="outline" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{post.title}</h1>

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

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              Like
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>
            <SocialShare url={`${window.location.origin}/blog/${post.id}`} title={post.title} />
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
        <Image src={post.featuredImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag.slug} variant="outline">
              #{tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Social Share */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">Share this article</h3>
        <SocialShare url={`${window.location.origin}/blog/${post.id}`} title={post.title} showLabels />
      </div>
    </article>
  )
}