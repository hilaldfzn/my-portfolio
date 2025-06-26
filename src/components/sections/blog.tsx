"use client"

import { motion } from "framer-motion"
import { ArrowRight, Award, Calendar, Clock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { SectionHeading } from "../section-heading"
import { GlassmorphicCard } from "../glassmorphic-card"
import Link from "next/link"

// Medium logo component
const MediumLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

export function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      title: "The Evolution of Deployment: From Manual Chaos to Automated Mastery with Docker & Cloud Run",
      excerpt:
        "Explore how modern deployment practices with Docker and Cloud Run have revolutionized the way we deploy applications.",
      image: "/assets/deployment-evolution.png",
      categories: ["DevOps", "Cloud Computing"],
      tags: ["Docker", "Cloud Run", "Deployment", "DevOps"],
      readingTime: 20,
      publishedAt: "2025-05-27",
      url: "https://medium.com/@hilalfauzan9/the-evolution-of-deployment-from-manual-chaos-to-automated-mastery-with-docker-cloud-run-d546565dc021",
    },
    {
      id: 2,
      title: "Mock Objects & Stubs: Your Key to Bulletproof Test Isolation",
      excerpt:
        "Discover how to use mock objects and stubs to create isolated, reliable, and maintainable tests for your applications.",
      image: "/assets/mock-testing.png",
      categories: ["Testing", "Best Practices"],
      tags: ["Testing", "Mock Objects", "Test Isolation"],
      readingTime: 10,
      publishedAt: "2025-05-27",
      url: "https://medium.com/@hilalfauzan9/mock-objects-stubs-your-key-to-bulletproof-test-isolation-9137ec062371",
      newsletter: "Newsletter Software Testing Weekly #273",
      newsletterUrl: "https://softwaretestingweekly.com/issues/273",
    },
    {
      id: 3,
      title: "Mastering Database Management: A Complete Guide to Automatic Data Seeding and Migration",
      excerpt:
        "Learn how to effectively manage your database with automatic data seeding and migration techniques for better development workflow.",
      image: "/assets/database-management.png",
      categories: ["Database", "DevOps"],
      tags: ["Database", "Migration", "Seeding"],
      readingTime: 10,
      publishedAt: "2025-05-27",
      url: "https://medium.com/@hilalfauzan9/mastering-database-management-a-complete-guide-to-automatic-data-seeding-and-migration-59fdff63a0c3",
    },
    {
      id: 4,
      title: "Test-Driven Development: The Key to Building Reliable and Scalable Software",
      excerpt:
        "Discover how TDD methodology can help you build more reliable, maintainable, and scalable software applications.",
      image: "/assets/TDD.png",
      categories: ["Development", "Testing"],
      tags: ["Software Testing", "Unit Testing"],
      readingTime: 10,
      publishedAt: "2025-05-18",
      url: "https://medium.com/@hilalfauzan9/test-driven-development-the-key-to-building-reliable-and-scalable-software-f6f355901330",
      newsletter: "Newsletter Software Testing Weekly #272",
    newsletterUrl: "https://softwaretestingweekly.com/issues/272",
    },
    {
      id: 5,
      title: "From Duplication to Elegance: How SOLID Principles Transformed Our Authentication System",
      excerpt:
        "Learn how applying SOLID principles can transform messy, duplicated code into elegant, maintainable authentication systems.",
      image: "/assets/SOLID.png",
      categories: ["Best Practices", "Software Architecture"],
      tags: ["SOLID", "Code Quality", "Clean Code"],
      readingTime: 10,
      publishedAt: "2025-05-17",
      url: "https://medium.com/@hilalfauzan9/from-duplication-to-elegance-how-solid-principles-transformed-our-authentication-system-f4411cc4675f",
    },
    {
      id: 6,
      title: "OWASP Compliance and Beyond: Building Robust Security Through Secure Programming",
      excerpt:
        "Comprehensive guide to implementing OWASP security principles and building secure applications with robust programming practices.",
      image: "/assets/secure-programming.png",
      categories: ["Security", "Best Practices"],
      tags: ["OWASP", "Security", "Authentication", "Authorization"],
      readingTime: 12,
      publishedAt: "2025-04-03",
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
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {blog.newsletter && (
                    <a href={blog.newsletterUrl} target="_blank" rel="noopener noreferrer">
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-400/20 text-red-400 border-red-400/30">
                          <Award className="h-3 w-3 mr-1" />
                          International Newsletter
                        </Badge>
                      </div>
                    </a>
                  )}
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

                {/* Tags display */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="bg-purple-400/20 text-purple-400 text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {blog.tags.length > 3 && (
                    <Badge variant="secondary" className="bg-gray-400/20 text-gray-400 text-xs">
                      +{blog.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-between group hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10"
                  asChild
                >
                  <a href={blog.url} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center">
                      <MediumLogo className="h-4 w-4 mr-2" />
                      Read on Medium
                    </div>
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
          <Button className="cyber-button" asChild>
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}