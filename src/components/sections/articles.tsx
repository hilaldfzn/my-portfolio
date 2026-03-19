"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Award, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { SectionHeading } from "../section-heading"
import { TiltCard } from "../tilt-card"
import Link from "next/link"

export function ArticleSection() {
  const articlePosts = [
    {
      id: 1,
      title: "The Evolution of Deployment: From Manual Chaos to Automated Mastery with Docker & Cloud Run",
      excerpt:
        "Explore how modern deployment practices with Docker and Cloud Run have revolutionized the way we deploy applications.",
      readingTime: 20,
      publishedAt: "2025-05-27",
      url: "https://medium.com/@hilalfauzan9/the-evolution-of-deployment-from-manual-chaos-to-automated-mastery-with-docker-cloud-run-d546565dc021",
      image: "/assets/deployment-evolution.png",
    },
    {
      id: 2,
      title: "Mock Objects & Stubs: Your Key to Bulletproof Test Isolation",
      excerpt:
        "Discover how to use mock objects and stubs to create isolated, reliable, and maintainable tests for your applications.",
      readingTime: 10,
      publishedAt: "2025-05-27",
      url: "https://medium.com/@hilalfauzan9/mock-objects-stubs-your-key-to-bulletproof-test-isolation-9137ec062371",
      image: "/assets/mock-testing.png",
      newsletter: "Software Testing Weekly #273",
      newsletterUrl: "https://softwaretestingweekly.com/issues/273",
    },
    {
      id: 3,
      title: "Mastering Database Management: A Complete Guide to Automatic Data Seeding and Migration",
      excerpt:
        "Learn how to effectively manage your database with automatic data seeding and migration techniques for better development workflow.",
      readingTime: 10,
      publishedAt: "2025-05-27",
      url: "https://medium.com/@hilalfauzan9/mastering-database-management-a-complete-guide-to-automatic-data-seeding-and-migration-59fdff63a0c3",
      image: "/assets/database-management.png",
    },
    {
      id: 4,
      title: "Test-Driven Development: The Key to Building Reliable and Scalable Software",
      excerpt:
        "Discover how TDD methodology can help you build more reliable, maintainable, and scalable software applications.",
      readingTime: 10,
      publishedAt: "2025-05-18",
      url: "https://medium.com/@hilalfauzan9/test-driven-development-the-key-to-building-reliable-and-scalable-software-f6f355901330",
      image: "/assets/TDD.png",
      newsletter: "Software Testing Weekly #272",
      newsletterUrl: "https://softwaretestingweekly.com/issues/272",
    },
    {
      id: 5,
      title: "From Duplication to Elegance: How SOLID Principles Transformed Our Authentication System",
      excerpt:
        "Learn how applying SOLID principles can transform messy, duplicated code into elegant, maintainable authentication systems.",
      readingTime: 10,
      publishedAt: "2025-05-17",
      url: "https://medium.com/@hilalfauzan9/from-duplication-to-elegance-how-solid-principles-transformed-our-authentication-system-f4411cc4675f",
      image: "/assets/SOLID.png",
    },
    {
      id: 6,
      title: "OWASP Compliance and Beyond: Building Robust Security Through Secure Programming",
      excerpt:
        "Comprehensive guide to implementing OWASP security principles and building secure applications with robust programming practices.",
      readingTime: 12,
      publishedAt: "2025-04-03",
      url: "https://medium.com/@hilalfauzan9/owasp-compliance-and-beyond-building-a-robust-security-through-secure-programming-aba4060f0280",
      image: "/assets/secure-programming.png",
    },
  ]

  const featured = articlePosts[0]
  const listPosts = articlePosts.slice(1, 6)

  return (
    <section id="articles" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Articles" subtitle="articles" />

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Featured article - large card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group"
          >
            <TiltCard>
              <a href={featured.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors duration-200 tilt-glow">
                  <div className="grid grid-cols-1 md:grid-cols-[2fr,3fr]">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-video md:aspect-auto bg-muted">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left md:hidden" />
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-xs text-primary">FEATURED</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground/60 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {featured.readingTime} min
                        </span>
                      </div>

                      <h3 className="text-xl lg:text-2xl font-display text-foreground group-hover:text-primary transition-colors mb-3">
                        {featured.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4">
                        {featured.excerpt}
                      </p>

                      <span className="inline-flex items-center gap-1.5 text-sm font-mono text-primary">
                        Read article
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </TiltCard>
          </motion.div>

          {/* Editorial list */}
          <div className="space-y-0">
            {listPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-baseline gap-4 md:gap-6 py-4 border-b border-border hover:border-primary/30 transition-colors"
                >
                  {/* Date */}
                  <time
                    dateTime={post.publishedAt}
                    className="font-mono text-xs text-muted-foreground flex-shrink-0 w-20 hidden sm:block"
                  >
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric",
                    })}
                  </time>

                  {/* Title */}
                  <h3 className="text-sm md:text-base font-display text-foreground group-hover:text-primary transition-colors flex-1 line-clamp-1">
                    {post.title}
                  </h3>

                  {/* Newsletter badge */}
                  {post.newsletter && (
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(post.newsletterUrl, "_blank")
                      }}
                      className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-[10px] font-mono text-primary flex-shrink-0 hover:bg-primary/20 transition-colors"
                    >
                      <Award className="w-2.5 h-2.5" />
                      International Newsletter
                    </button>
                  )}

                  {/* Reading time */}
                  <span className="font-mono text-xs text-muted-foreground/60 flex-shrink-0">
                    {post.readingTime} min
                  </span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Posts */}
        <motion.div
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-md px-8 h-11 text-sm font-mono border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <Link href="/articles">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
