"use client"

import { motion } from "framer-motion"
import { ArrowRight, Award, Calendar, Clock, BookOpen } from "lucide-react"
import { Button } from "../../components/ui/button"
import { SectionHeading } from "../section-heading"
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
    <section id="blog" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Latest Articles" subtitle="Thoughts on development and technology" />

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.slice(0, 6).map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <article className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                {/* Featured Image */}
                <div className="relative overflow-hidden aspect-[16/9] bg-muted">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />

                  {/* Newsletter Badge */}
                  {blog.newsletter && (
                    <div className="absolute top-4 left-4">
                      <a
                        href={blog.newsletterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="px-3 py-1.5 rounded-full bg-rose-500/90 backdrop-blur-sm border border-rose-400/30 flex items-center gap-1.5 hover:bg-rose-500 transition-colors">
                          <Award className="w-3.5 h-3.5 text-white" />
                          <span className="text-xs font-medium text-white">International Newsletter</span>
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <time dateTime={blog.publishedAt}>
                        {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{blog.readingTime} min read</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.categories.map((category) => (
                      <span
                        key={category}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg lg:text-xl font-heading font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Read More Link */}
                  <a
                    href={blog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-secondary hover:bg-primary/10 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300"
                  >
                    <MediumLogo className="w-4 h-4" />
                    Read on Medium
                  </a>
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* View All Posts Button */}
        <motion.div
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Button
            asChild
            size="lg"
            className="bg-secondary hover:bg-primary/10 text-foreground hover:text-primary border-2 border-border hover:border-primary/50 rounded-full px-8 h-12 text-base font-medium transition-all duration-300 group"
          >
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}