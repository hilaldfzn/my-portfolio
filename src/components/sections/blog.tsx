"use client"

import { motion } from "framer-motion"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { SectionHeading } from "../section-heading"
import { GlassmorphicCard } from "../glassmorphic-card"

export function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      title: "The Evolution of Deployment: From Manual Chaos to Automated Mastery with Docker & Cloud Run",
      excerpt:
        "Explore how modern deployment practices with Docker and Cloud Run have revolutionized the way we deploy applications.",
      image: "/assets/deployment-evolution.png",
      category: { name: "DevOps", slug: "devops" },
      tags: [
        { name: "Docker", slug: "docker" },
        { name: "Cloud Run", slug: "cloud-run" },
        { name: "Deployment", slug: "deployment" },
        { name: "DevOps", slug: "devops" },
      ],
      readingTime: 20,
      publishedAt: "2025-05-27",
      slug: "deployment-evolution-docker-cloud-run",
      url: "https://medium.com/@hilalfauzan9/the-evolution-of-deployment-from-manual-chaos-to-automated-mastery-with-docker-cloud-run-d546565dc021",
    },
    {
      id: 2,
      title: "Mock Objects & Stubs: Your Key to Bulletproof Test Isolation",
      excerpt:
        "Discover how to use mock objects and stubs to create isolated, reliable, and maintainable tests for your applications.",
      image: "/assets/mock-testing.png",
      category: { name: "Testing", slug: "testing" },
      tags: [
        { name: "Testing", slug: "testing" },
        { name: "Mock Objects", slug: "mock-objects" },
        { name: "Test Isolation", slug: "test-isolation" },
      ],
      readingTime: 10,
      publishedAt: "2025-05-27",
      slug: "mock-objects-stubs-test-isolation",
      url: "https://medium.com/@hilalfauzan9/mock-objects-stubs-your-key-to-bulletproof-test-isolation-9137ec062371",
    },
    {
      id: 3,
      title: "Mastering Database Management: A Complete Guide to Automatic Data Seeding and Migration",
      excerpt:
        "Learn how to effectively manage your database with automatic data seeding and migration techniques for better development workflow.",
      image: "/assets/database-management.png",
      category: { name: "Database", slug: "database" },
      tags: [
        { name: "Database", slug: "database" },
        { name: "Migration", slug: "migration" },
        { name: "Seeding", slug: "seeding" },
      ],
      readingTime: 10,
      publishedAt: "2025-05-27",
      slug: "database-management-seeding-migration",
      url: "https://medium.com/@hilalfauzan9/mastering-database-management-a-complete-guide-to-automatic-data-seeding-and-migration-59fdff63a0c3",
    },
    {
      id: 4,
      title: "Test-Driven Development: The Key to Building Reliable and Scalable Software",
      excerpt:
        "Discover how TDD methodology can help you build more reliable, maintainable, and scalable software applications.",
      image: "/assets/TDD.png",
      category: { name: "Development", slug: "development" },
      tags: [
        { name: "Test-Driven Development", slug: "tdd" },
        { name: "Software Testing", slug: "software-testing" },
        { name: "Unit Testing", slug: "unit-testing" },
      ],
      readingTime: 10,
      publishedAt: "2025-05-18",
      slug: "test-driven-development-reliable-software",
      url: "https://medium.com/@hilalfauzan9/test-driven-development-the-key-to-building-reliable-and-scalable-software-f6f355901330",
    },
    {
      id: 5,
      title: "From Duplication to Elegance: How SOLID Principles Transformed Our Authentication System",
      excerpt:
        "Learn how applying SOLID principles can transform messy, duplicated code into elegant, maintainable authentication systems.",
      image: "/assets/SOLID.png",
      category: { name: "Best Practices", slug: "best-practices" },
      tags: [
        { name: "SOLID", slug: "solid" },
        { name: "Code Quality", slug: "code-quality" },
        { name: "Clean Code", slug: "clean-code" },
      ],
      readingTime: 10,
      publishedAt: "2025-05-17",
      slug: "solid-principles-authentication-system",
      url: "https://medium.com/@hilalfauzan9/from-duplication-to-elegance-how-solid-principles-transformed-our-authentication-system-f4411cc4675f",
    },
    {
      id: 6,
      title: "OWASP Compliance and Beyond: Building Robust Security Through Secure Programming",
      excerpt:
        "Comprehensive guide to implementing OWASP security principles and building secure applications with robust programming practices.",
      image: "/assets/secure-programming.png",
      category: { name: "Security", slug: "security" },
      tags: [
        { name: "OWASP", slug: "owasp" },
        { name: "Security", slug: "security" },
        { name: "Authentication", slug: "authentication" },
        { name: "Authorization", slug: "authorization" },
      ],
      readingTime: 12,
      publishedAt: "2025-04-03",
      slug: "owasp-compliance-security-programming",
      url: "https://medium.com/@hilalfauzan9/owasp-compliance-and-beyond-building-a-robust-security-through-secure-programming-aba4060f0280",
    },
  ]

  return (
    <section id="blog" className="py-32 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title="Latest Blog Posts" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {blogPosts.map((blog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30">{blog.category.name}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(blog.publishedAt).toLocaleDateString("en-ID")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {blog.readingTime} min read
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{blog.excerpt}</p>

                <Button variant="ghost" className="w-full justify-between group" asChild>
                  <a href={blog.url} target="_blank" rel="noopener noreferrer">
                    Read More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Button className="cyber-button">
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}