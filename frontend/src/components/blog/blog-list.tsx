"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Calendar, Clock, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState("")


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
      readingTime: 19,
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
      image:
        "/assets/secure-programming.png",
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
    {
      id: 7,
      title: "Preventing Bugs Before They Bite: SonarCloud for Proactive Code Quality",
      excerpt:
        "Learn how to use SonarCloud to maintain high code quality and prevent bugs before they reach production.",
      image: "/assets/QA.png",
      category: { name: "Quality Assurance", slug: "quality-assurance" },
      tags: [
        { name: "SonarCloud", slug: "sonarcloud" },
        { name: "Code Quality", slug: "code-quality" },
        { name: "Static Code Analysis", slug: "static-code-analysis" },
      ],
      readingTime: 10,
      publishedAt: "2025-03-06",
      slug: "sonarcloud-proactive-code-quality",
      url: "https://medium.com/@hilalfauzan9/preventing-bugs-before-they-bite-sonarcloud-for-proactive-code-quality-c7db5b5ccff4",
    },
    {
      id: 8,
      title: "Unlocking Scrum Team Synergy: Mastering Tools for Peak Collaborative Coding",
      excerpt:
        "Explore essential tools and practices for maximizing team collaboration and productivity in Scrum environments.",
      image: "/assets/teamwork-tools.png",
      category: { name: "Agile", slug: "agile" },
      tags: [
        { name: "Scrum", slug: "scrum" },
        { name: "Team Collaboration", slug: "team-collaboration" },
      ],
      readingTime: 9,
      publishedAt: "2025-03-04",
      slug: "scrum-team-synergy-collaborative-coding",
      url: "https://medium.com/@hilalfauzan9/unlocking-scrum-team-synergy-mastering-tools-for-peak-collaborative-coding-5504d572cbe3",
    },
    {
      id: 9,
      title: "Google Cloud Platform: Solusi Terbaik Layanan Cloud",
      excerpt:
        "Comprehensive overview of Google Cloud Platform services and why it's an excellent choice for cloud solutions.",
      image: "/assets/google-cloud.png",
      category: { name: "Cloud Computing", slug: "cloud-computing" },
      tags: [
        { name: "Google Cloud", slug: "google-cloud" },
        { name: "Cloud Computing", slug: "cloud-computing" },
        { name: "Infrastructure", slug: "infrastructure" },
      ],
      readingTime: 5,
      publishedAt: "2023-12-03",
      slug: "google-cloud-platform-solusi-cloud",
      url: "https://medium.com/compfest/google-cloud-platform-solusi-terbaik-layanan-cloud-a298a3aa53f1",
    },
    {
      id: 10,
      title: "Software Engineering Academy Camp 3: Implementation of Career-Related Skills",
      excerpt:
        "Insights from Software Engineering Academy focusing on practical career skills and professional development.",
      image: "/assets/academy-career.png",
      category: { name: "Career Development", slug: "career-development" },
      tags: [
        { name: "Career", slug: "career" },
        { name: "Software Engineering", slug: "software-engineering" },
        { name: "Professional Development", slug: "professional-development" },
      ],
      readingTime: 6,
      publishedAt: "2023-11-05",
      slug: "software-engineering-academy-career-skills",
      url: "https://medium.com/compfest/software-engineering-academy-camp-3-implementation-of-career-related-skills-d1bd1280b488",
    },
    {
      id: 11,
      title: "Grand Launching COMPFEST 15: Welcoming a Series of Insightful Events",
      excerpt:
        "Coverage of COMPFEST 15 grand launching event and the exciting series of technology and innovation events.",
      image: "/assets/compfest-15.png",
      category: { name: "Events", slug: "events" },
      tags: [
        { name: "COMPFEST", slug: "compfest" },
        { name: "Technology Events", slug: "technology-events" },
        { name: "Innovation", slug: "innovation" },
      ],
      readingTime: 5,
      publishedAt: "2023-05-23",
      slug: "compfest-15-grand-launching",
      url: "https://medium.com/compfest/grand-launching-compfest-15-welcoming-a-series-of-insightful-events-f452fcb48b56",
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
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button asChild>
                    <Link href={post.url} target="_blank" rel="noopener noreferrer">
                      Read on Medium
                    </Link>
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