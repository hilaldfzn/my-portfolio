"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Award, Clock, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "../../components/ui/button"
import { TiltCard } from "../../components/shared/tilt-card"
import { Navbar } from "../../components/layout/header"
import { Footer } from "../../components/layout/footer"
import { articles, articleCategories } from "../../content/articles"

import Link from "next/link"
import Image from "next/image"

// Medium logo component
const MediumLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

const allArticlePosts = articles
const categories = articleCategories

export default function ArticlePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = useMemo(() => {
    return allArticlePosts.filter((post) => {
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
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">{"// "}articles</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-16">Articles</h2>

          <p className="text-base text-muted-foreground max-w-2xl font-body mb-10">
            Dive deep into my thoughts on software development, best practices, and emerging technologies.
          </p>

          {/* Search and Filter */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  placeholder="Search article posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="terminal-input w-full pl-10 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 border ${
                    selectedCategory === category
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="text-sm font-mono text-muted-foreground">
              {filteredPosts.length === allArticlePosts.length
                ? `${filteredPosts.length} posts`
                : `${filteredPosts.length} of ${allArticlePosts.length} posts`}
            </p>
          </div>

          {/* Article Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <TiltCard className="h-full">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors duration-200 h-full flex flex-col tilt-glow">
                      <div className="relative overflow-hidden aspect-video bg-muted">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                        {post.newsletter && (
                          <div className="absolute top-3 left-3">
                            <div className="px-2.5 py-1 rounded-md bg-primary/90 flex items-center gap-1.5">
                              <Award className="w-3 h-3 text-primary-foreground" />
                              <span className="text-xs font-mono font-medium text-primary-foreground">International Newsletter</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <time
                            dateTime={post.publishedAt}
                            className="font-mono text-xs text-muted-foreground"
                          >
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                          <span className="font-mono text-xs text-muted-foreground/60 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readingTime} min
                          </span>
                        </div>

                        <h3 className="text-base font-display text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-sm text-muted-foreground leading-relaxed font-body line-clamp-2 flex-1 mb-4">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 border border-border rounded text-[10px] font-mono text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-primary">
                          <MediumLogo className="w-3.5 h-3.5" />
                          Read on Medium
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </a>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="max-w-md mx-auto">
                <p className="font-mono text-sm text-muted-foreground mb-2">No posts found</p>
                <p className="text-sm text-muted-foreground mb-6 font-body">
                  Try adjusting your search terms or category filter.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                  }}
                  className="rounded-md px-6 text-sm font-mono border-border hover:border-primary/50 hover:text-primary"
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
