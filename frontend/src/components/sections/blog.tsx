import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Blog() {
  const blogPosts = [
    {
      title: "The Evolution of Deployment: From Manual Chaos to Automated Mastery with Docker & Cloud Run",
      excerpt:
        "Explore how modern deployment practices with Docker and Cloud Run have revolutionized the way we deploy applications.",
      image: "/assets/deployment-evolution.png",
      readingTime: 19,
      publishedAt: "2025-05-27",
      slug: "deployment-evolution-docker-cloud-run",
      url: "https://medium.com/@hilalfauzan9/the-evolution-of-deployment-from-manual-chaos-to-automated-mastery-with-docker-cloud-run-d546565dc021",
    },
    {
      title: "Mastering Database Management: A Complete Guide to Automatic Data Seeding and Migration",
      excerpt:
        "Learn how to effectively manage your database with automatic data seeding and migration techniques for better development workflow.",
      image: "/assets/database-management.png",
      readingTime: 10,
      publishedAt: "2025-05-27",
      slug: "database-management-seeding-migration",
      url: "https://medium.com/@hilalfauzan9/mastering-database-management-a-complete-guide-to-automatic-data-seeding-and-migration-59fdff63a0c3",
    },
    {
      title: "Mock Objects & Stubs: Your Key to Bulletproof Test Isolation",
      excerpt:
        "Discover how to use mock objects and stubs to create isolated, reliable, and maintainable tests for your applications.",
      image: "/assets/mock-testing.png",
      readingTime: 10,
      publishedAt: "2025-05-27",
      slug: "mock-objects-stubs-test-isolation",
      url: "https://medium.com/@hilalfauzan9/mock-objects-stubs-your-key-to-bulletproof-test-isolation-9137ec062371",
    },
    {
      title: "Test-Driven Development: The Key to Building Reliable and Scalable Software",
      excerpt:
        "Discover how TDD methodology can help you build more reliable, maintainable, and scalable software applications.",
      image: "/assets/TDD.png",
      readingTime: 10,
      publishedAt: "2025-05-18",
      slug: "test-driven-development-reliable-software",
      url: "https://medium.com/@hilalfauzan9/test-driven-development-the-key-to-building-reliable-and-scalable-software-f6f355901330",
    },
    {
      title: "From Duplication to Elegance: How SOLID Principles Transformed Our Authentication System",
      excerpt:
        "Learn how applying SOLID principles can transform messy, duplicated code into elegant, maintainable authentication systems.",
      image: "/assets/SOLID.png",
      readingTime: 10,
      publishedAt: "2025-05-17",
      slug: "solid-principles-authentication-system",
      url: "https://medium.com/@hilalfauzan9/from-duplication-to-elegance-how-solid-principles-transformed-our-authentication-system-f4411cc4675f",
    },
    {
      title: "OWASP Compliance and Beyond: Building Robust Security Through Secure Programming",
      excerpt:
        "Comprehensive guide to implementing OWASP security principles and building secure applications with robust programming practices.",
      image:
        "/assets/secure-programming.png",
      readingTime: 12,
      publishedAt: "2025-04-03",
      slug: "owasp-compliance-security-programming",
      url: "https://medium.com/@hilalfauzan9/owasp-compliance-and-beyond-building-a-robust-security-through-secure-programming-aba4060f0280",
    },
  ]

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest <span className="gradient-text">Blogs</span>
          </h2>
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
                  <Link href={post.url} target="_blank" rel="noopener noreferrer">
                    Read on Medium
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