"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Calendar, Clock, ArrowRight, Award } from "lucide-react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { GlassmorphicCard } from "../../components/glassmorphic-card"
import { Navbar } from "../../components/layout/header"
import { Footer } from "../../components/layout/footer"

// Medium logo component
const MediumLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

const allBlogPosts = [
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
  {
    id: 7,
    title: "Preventing Bugs Before They Bite: SonarCloud for Proactive Code Quality",
    excerpt: "Learn how to use SonarCloud to maintain high code quality and prevent bugs before they reach production.",
    image: "/assets/QA.png",
    categories: ["Quality Assurance", "DevOps"],
    tags: ["SonarCloud", "Code Quality", "Static Code Analysis"],
    readingTime: 10,
    publishedAt: "2025-03-06",
    url: "https://medium.com/@hilalfauzan9/preventing-bugs-before-they-bite-sonarcloud-for-proactive-code-quality-c7db5b5ccff4",
  },
  {
    id: 8,
    title: "Unlocking Scrum Team Synergy: Mastering Tools for Peak Collaborative Coding",
    excerpt:
      "Explore essential tools and practices for maximizing team collaboration and productivity in Scrum environments.",
    image: "/assets/teamwork-tools.png",
    categories: ["Agile", "Team Management"],
    tags: ["Scrum", "Team Collaboration", "Agile Methodology"],
    readingTime: 9,
    publishedAt: "2025-03-04",
    url: "https://medium.com/@hilalfauzan9/unlocking-scrum-team-synergy-mastering-tools-for-peak-collaborative-coding-5504d572cbe3",
  },
  {
    id: 9,
    title: "Google Cloud Platform: Solusi Terbaik Layanan Cloud",
    excerpt:
      "Comprehensive overview of Google Cloud Platform services and why it's an excellent choice for cloud solutions.",
    image: "/assets/google-cloud.png",
    categories: ["Cloud Computing", "Infrastructure"],
    tags: ["Google Cloud", "Cloud Computing", "Infrastructure"],
    readingTime: 5,
    publishedAt: "2023-12-03",
    url: "https://medium.com/compfest/google-cloud-platform-solusi-terbaik-layanan-cloud-a298a3aa53f1",
  },
  {
    id: 10,
    title: "Software Engineering Academy Camp 3: Implementation of Career-Related Skills",
    excerpt:
      "Insights from Software Engineering Academy focusing on practical career skills and professional development.",
    image: "/assets/academy-career.png",
    categories: ["Career Development", "Education"],
    tags: ["Career Development", "Software Engineering"],
    readingTime: 6,
    publishedAt: "2023-11-05",
    url: "https://medium.com/compfest/software-engineering-academy-camp-3-implementation-of-career-related-skills-d1bd1280b488",
  },
  {
    id: 11,
    title: "Grand Launching COMPFEST 15: Welcoming a Series of Insightful Events",
    excerpt:
      "Coverage of COMPFEST 15 grand launching event and the exciting series of technology and innovation events.",
    image: "/assets/compfest-15.png",
    categories: ["Events", "Technology"],
    tags: ["COMPFEST", "Technology Events", "Innovation"],
    readingTime: 5,
    publishedAt: "2023-05-23",
    url: "https://medium.com/compfest/grand-launching-compfest-15-welcoming-a-series-of-insightful-events-f452fcb48b56",
  },
]

const categories = [
  "All",
  "DevOps",
  "Testing",
  "Database",
  "Development",
  "Best Practices",
  "Security",
  "Quality Assurance",
  "Agile",
  "Cloud Computing",
  "Career Development",
  "Events",
  "Software Architecture",
  "Team Management",
  "Infrastructure",
  "Education",
  "Technology",
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = useMemo(() => {
    return allBlogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || post.categories.includes(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">All Blog Posts</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive deep into my thoughts on software development, best practices, and emerging technologies.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-white/10 focus:border-cyan-400 rounded-2xl"
              />
            </div>

            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-background/50 border-white/10 focus:border-cyan-400 rounded-2xl">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="focus:bg-cyan-400/10 focus:text-cyan-400">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filter indicator */}
          {selectedCategory !== "All" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-4"
            >
              <Badge
                className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 cursor-pointer hover:bg-cyan-400/30 transition-colors"
                onClick={() => setSelectedCategory("All")}
              >
                {selectedCategory} ✕
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Results count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <p className="text-muted-foreground">
            {filteredPosts.length === allBlogPosts.length
              ? `Showing all ${filteredPosts.length} posts`
              : `Found ${filteredPosts.length} of ${allBlogPosts.length} posts`}
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassmorphicCard>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {post.newsletter && (
                    <a href={post.newsletterUrl} target="_blank" rel="noopener noreferrer">
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
                    {new Date(post.publishedAt).toLocaleDateString("en-ID")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readingTime} min read
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="bg-purple-400/20 text-purple-400 text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="secondary" className="bg-gray-400/20 text-gray-400 text-xs">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-secondary hover:bg-primary/10 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300"
                >
                  <MediumLogo className="h-4 w-4" />
                  Read on Medium
                </a>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or category filter to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
                className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-2xl"
              >
                Clear filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    <Footer />
    </>
  )
}