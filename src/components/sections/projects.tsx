"use client"

import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Github, Award, Star } from "lucide-react"
import { Button } from "../../components/ui/button"
import { SectionHeading } from "../section-heading"
import Link from "next/link"

export function ProjectsSection() {
  const projects = [
    {
      id: 1,
      title: "Sentiment Analysis: DC Universe Rebrand (Man of Steel vs. Superman 2025)",
      description:
        "Designed and executed a full-cycle research project to evaluate the shift in public sentiment regarding the DC Universe's creative direction. The study compared audience reception between Zack Snyder's Man of Steel (2013) and James Gunn's Superman (2025) using social media data.",
      image: "/assets/Superman.png",
      technologies: ["Python", "NLP", "Social Media Analytics", "Data Visualization"],
      categories: ["AI/ML"],
      githubUrl: "https://github.com/hilaldfzn/social-media-analytics",
      featured: true,
    },
    {
      id: 2,
      title: "MAAMS",
      description:
        "AI-powered root cause analysis application utilizing DeepSeek R1 model for chat completions. Validates and confirms underlying causes of problems with advanced analysis algorithms and prompt systems.",
      image: "/assets/MAAMS.png",
      technologies: ["Python", "Django", "Next.js", "Tailwind CSS", "DeepSeek"],
      categories: ["Web Development", "AI/ML"],
      liveDemo: "https://maams-ng.netlify.app",
      featured: true,
    },
    {
      id: 3,
      title: "Apap Medika",
      description:
        "Hospital management system using a 6-microservice architecture for all core hospital functions. I took full ownership of the end-to-end product design, creating the UI/UX and design system from the ground up. The system features complex business logic and robust security with JWT-based authentication, OAuth, and role-based access control for five distinct user types.",
      image: "/assets/apap-medika.png",
      technologies: ["Python", "Django", "Next.js", "Tailwind CSS", "PostgreSQL"],
      categories: ["Web Development", "Healthcare"],
      githubUrl: "https://github.com/orgs/ApapMedika/repositories",
      featured: false,
    },
    {
      id: 4,
      title: "Database Backup Utility",
      description:
        "Built a versatile Command-Line Interface (CLI) tool in Go to fully automate backup and restore operations for MySQL, PostgreSQL, MongoDB, and SQLite. It securely integrates with multi-cloud storage providers like AWS S3, GCS, and Azure, implementing compression, encryption, and custom retention policies. The tool features a modular architecture containerized with Docker, complete with Slack notifications and scheduled workflows for reliable, unattended operation.",
      image: "/assets/db-backup-utility.png",
      technologies: ["Go", "PostgreSQL", "MySQL", "MongoDB", "AWS", "Azure", "GCS"],
      categories: ["Back End Development", "DevOps"],
      githubUrl: "https://github.com/hilaldfzn/database-backup-utility",
      featured: false,
    },
    {
      id: 5,
      title: "CrawlKit API",
      description:
        "REST API for intelligent and ethical web scraping, featuring concurrent crawling and a real-time analytics dashboard. The system ensures responsible data collection by enforcing robots.txt compliance, automatic delays, and rate limiting. It uses BeautifulSoup for advanced HTML parsing and includes data quality monitoring reports to guarantee reliable data extraction.",
      image: "/assets/crawlkit-api.png",
      technologies: ["Python", "Fast API"],
      categories: ["Back End Development", "Web Scraping"],
      githubUrl: "https://github.com/hilaldfzn/crawlkit-api",
      featured: false,
    },
    {
      id: 6,
      title: "Natural Language Inference",
      description:
        "Deep learning model for predicting logical relationships between sentences using pre-trained DeBERTa V3 model. Built entirely from scratch with PyTorch for Indonesian and English datasets.",
      image: "/assets/NLI.png",
      technologies: ["Python", "PyTorch", "Transformers", "DeBERTa"],
      categories: ["AI/ML"],
      githubUrl: "https://github.com/hilaldfzn/natural-language-inference",
      featured: true,
    },
    {
      id: 7,
      title: "Lembarpena",
      description:
        "Award-winning literacy community web and mobile application connecting readers and authors. Features book purchasing, discussion forums, and wishlist functionality. Winner of The Best Web Application Award.",
      image: "/assets/lembar-pena.png",
      technologies: ["Python", "Django", "HTML", "CSS", "JavaScript"],
      categories: ["Web Development"],
      githubUrl: "https://github.com/PBPC09/tugaskelompok1",
      liveDemo: "https://lembarpena.vercel.app",
      featured: true,
      award: "Best Web Application Award",
      awardUrl: "https://pbp-fasilkom-ui.github.io/ganjil-2024/awards#aplikasi-web-terbaik",
    },
  ]

  return (
    <section id="projects" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Projects"
          subtitle="Showcasing my latest work and innovations"
        />

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.slice(0, 6).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                {/* Project Image */}
                <div className="relative overflow-hidden aspect-video bg-muted">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm border border-primary/20 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground" />
                        <span className="text-xs font-medium text-primary-foreground">Featured</span>
                      </div>
                    </div>
                  )}

                  {/* Award Badge */}
                  {project.award && (
                    <div className="absolute top-4 left-4">
                      <a
                        href={project.awardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm border border-amber-400/30 flex items-center gap-1.5 hover:bg-amber-500 transition-colors">
                          <Award className="w-3.5 h-3.5 text-amber-900" />
                          <span className="text-xs font-medium text-amber-900">Award Winner</span>
                        </div>
                      </a>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.categories.map((category) => (
                      <span
                        key={category}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4 flex-1">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-secondary hover:bg-primary/10 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300"
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
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
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}