import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import Link from "next/link"

export default function BlogCategories() {
  const categories = [
    { name: "Web Development", slug: "web-development", count: 12 },
    { name: "React", slug: "react", count: 8 },
    { name: "Next.js", slug: "nextjs", count: 6 },
    { name: "Django", slug: "django", count: 4 },
    { name: "Technology", slug: "technology", count: 10 },
    { name: "Tutorials", slug: "tutorials", count: 15 },
  ]

  const popularTags = [
    "JavaScript",
    "TypeScript",
    "Python",
    "React",
    "Next.js",
    "Django",
    "Tailwind CSS",
    "API",
    "Database",
    "Performance",
    "SEO",
    "Deployment",
  ]

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
            >
              <span>{category.name}</span>
              <Badge variant="secondary">{category.count}</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag.toLowerCase().replace(" ", "-")}`}>
                <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { title: "Building Modern Web Apps", slug: "building-modern-web-apps", date: "Jan 15" },
            { title: "React Performance Tips", slug: "react-performance-tips", date: "Jan 10" },
            { title: "Django Best Practices", slug: "django-best-practices", date: "Jan 5" },
          ].map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-2 rounded hover:bg-muted transition-colors"
            >
              <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}