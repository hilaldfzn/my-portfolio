"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Github, ExternalLink, Award, Search, ArrowLeft } from "lucide-react"
import { Button } from "../../components/ui/button"
import { TiltCard } from "../../components/shared/tilt-card"
import { Navbar } from "../../components/layout/header"
import { Footer } from "../../components/layout/footer"
import { projects, projectCategories } from "../../content/projects"
import { projectDetails } from "../../content/project-details"

import Link from "next/link"
import Image from "next/image"

const allProjects = projects.map((project) => ({ ...project, description: projectDetails[project.slug].description }))
const categories = projectCategories

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || project.categories.includes(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">{"// "}projects</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-16">Projects</h2>

          <p className="text-base text-muted-foreground max-w-2xl font-body mb-10">
            Explore my complete portfolio of projects, from web applications to AI/ML solutions.
          </p>

          {/* Search and Filter */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  placeholder="Search projects..."
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
              {filteredProjects.length === allProjects.length
                ? `${filteredProjects.length} projects`
                : `${filteredProjects.length} of ${allProjects.length} projects`}
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <TiltCard className="h-full">
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors duration-200 h-full flex flex-col tilt-glow">
                    <div className="relative overflow-hidden aspect-video bg-muted">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                      {project.award && (
                        <div className="absolute top-3 left-3">
                          <a href={project.awardUrl} target="_blank" rel="noopener noreferrer">
                            <div className="px-2.5 py-1 rounded-md bg-[hsl(var(--syntax-yellow))] flex items-center gap-1.5">
                              <Award className="w-3 h-3 text-background" />
                              <span className="text-xs font-mono font-medium text-background">Award</span>
                            </div>
                          </a>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.categories.map((category) => (
                          <span key={category} className="text-[10px] font-mono text-muted-foreground">
                            {category}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-base font-display text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {project.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1 font-body">
                        {project.description}
                      </p>

                      <p className="text-xs font-mono text-muted-foreground/70 mb-4">
                        {project.technologies.join(" | ")}
                      </p>

                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200"
                          >
                            <Github className="w-3.5 h-3.5" />
                            Source Code
                          </a>
                        )}
                        {project.liveDemo && (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="max-w-md mx-auto">
                <p className="font-mono text-sm text-muted-foreground mb-2">No projects found</p>
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
