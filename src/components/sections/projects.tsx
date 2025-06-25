"use client"

import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Github, Award } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { SectionHeading } from "../section-heading"
import { GlassmorphicCard } from "../glassmorphic-card"
import Link from "next/link"

export function ProjectsSection() {
  const projects = [
    {
      id: 1,
      title: "MAAMS",
      description:
        "AI-powered root cause analysis application utilizing DeepSeek R1 model for chat completions. Validates and confirms underlying causes of problems with advanced analysis algorithms and prompt systems.",
      image: "/assets/MAAMS.png",
      technologies: ["Python", "Django", "Next.js", "Tailwind CSS", "DeepSeek"],
      categories: ["Web Development", "AI/ML"],
      githubUrl: "https://github.com/orgs/Kelompok-5-PPL-A/repositories",
      liveDemo: "https://maams-ng.netlify.app",
      featured: true,
    },
    {
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
    },
  ]

  return (
    <section id="projects" className="py-32 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title="Latest Projects" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {projects.map((project, index) => (
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
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {project.award && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                        <Award className="h-3 w-3 mr-1" />
                        Award Winner
                      </Badge>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-5">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="bg-purple-400/20 text-purple-400">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Action buttons with organizational experience style */}
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-2xl transition-all duration-300"
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveDemo && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-2xl transition-all duration-300"
                      asChild
                    >
                      <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
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