"use client"

import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Github, Award } from "lucide-react"
import { Button } from "../../components/ui/button"
import { SectionHeading } from "../shared/section-heading"
import { TiltCard } from "../shared/tilt-card"
import { projects } from "../../content/projects"
import Link from "next/link"
import Image from "next/image"

export function ProjectsSection() {
  const featured = projects.slice(0, 2)
  const compact = projects.slice(2, 6)

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Projects" subtitle="projects" />

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Featured row - 2 large cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <TiltCard className="h-full">
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors duration-200 h-full flex flex-col tilt-glow">
                    {/* Large image */}
                    <div className="relative overflow-hidden aspect-[16/10] bg-muted">
                      <Image
                        src={project.image}
                        alt={project.shortTitle ?? project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
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

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.categories.map((category) => (
                          <span key={category} className="text-xs font-mono text-muted-foreground">
                            {category}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-xl font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                        {project.shortTitle ?? project.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 font-body">
                        {project.summary}
                      </p>

                      <p className="text-xs font-mono text-muted-foreground/70 mb-4">
                        {project.technologies.join(" | ")}
                      </p>

                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200">
                            <Github className="w-3.5 h-3.5" /> Source Code
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200">
                            <ExternalLink className="w-3.5 h-3.5" /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Compact grid - 4 smaller cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {compact.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
                className="group"
              >
                <div className="card-accent rounded-lg p-4 h-full flex flex-col">
                  {/* Small thumbnail */}
                  <div className="relative overflow-hidden rounded-md aspect-video bg-muted mb-3">
                    <Image
                      src={project.image}
                      alt={project.shortTitle ?? project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {project.award && (
                      <div className="absolute top-2 left-2">
                        <a href={project.awardUrl} target="_blank" rel="noopener noreferrer">
                          <div className="px-1.5 py-0.5 rounded bg-[hsl(var(--syntax-yellow))] flex items-center gap-1">
                            <Award className="w-2.5 h-2.5 text-background" />
                            <span className="text-[10px] font-mono font-medium text-background">Award</span>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-muted-foreground mb-1">
                    {project.categories.join(" / ")}
                  </span>

                  <h3 className="text-sm font-display text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {project.shortTitle ?? project.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2 flex-1 font-body">
                    {project.summary}
                  </p>

                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">
                        <Github className="w-3 h-3" /> Source Code
                      </a>
                    )}
                    {project.liveDemo && (
                      <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono bg-primary hover:bg-primary/90 text-primary-foreground transition-all">
                        <ExternalLink className="w-3 h-3" /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Projects */}
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
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
