"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Github, ExternalLink, Award, Search, ArrowLeft } from "lucide-react"
import { Button } from "../../components/ui/button"
import { TiltCard } from "../../components/tilt-card"
import { Navbar } from "../../components/layout/header"
import { Footer } from "../../components/layout/footer"
import { SectionHeading } from "../../components/section-heading"
import Link from "next/link"

const allProjects = [
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
  {
    id: 8,
    title: "Mario Object Detection",
    description:
      "YOLO v11-based object detection system for accurately detecting Mario characters in video datasets. Addresses real-world challenges like lighting variability and complex backgrounds.",
    image: "/assets/mario.png",
    technologies: ["Python", "YOLO v11", "OpenCV", "Roboflow"],
    categories: ["Computer Vision", "AI/ML"],
    githubUrl: "https://github.com/hilaldfzn/mario-object-detection",
    featured: true,
  },
  {
    id: 9,
    title: "Health Admission Prediction",
    description:
      "Healthcare analytics project predicting patient outcomes and ICU stay duration. Includes classification, regression, and clustering models for medical decision-making support.",
    image: "/assets/health-admission.png",
    technologies: ["Python", "Scikit-learn", "Pandas", "Healthcare"],
    categories: ["Data Science", "Healthcare"],
    githubUrl: "https://github.com/hilaldfzn/OkeGas-health-admission",
    featured: true,
  },
  {
    id: 10,
    title: "Marmut Music",
    description:
      "Spotify-like streaming platform offering music and podcasts with premium subscriptions, playlists, charts, and royalty tracking for artists, songwriters, and labels.",
    image: "/assets/marmut.png",
    technologies: ["Python", "Django", "Tailwind CSS", "PostgreSQL"],
    categories: ["Web Development", "Entertainment"],
    githubUrl: "https://github.com/basdat-d1/marmut",
    liveDemo: "https://marmut-music.vercel.app",
    featured: true,
  },
  {
    id: 11,
    title: "HoomGroom",
    description:
      "IKEA-inspired furniture e-commerce platform with catalog browsing, cart management, balance top-up, and shipping tracking. Built with Spring Boot and Next.js + Tailwind CSS.",
    image: "/assets/maintenance.png",
    technologies: ["Java", "Spring Boot", "Next.js", "PostgreSQL"],
    categories: ["Web Development", "E-commerce"],
    githubUrl: "https://github.com/orgs/Adpro-C5/repositories",
    liveDemo: "https://hoomgroom.vercel.app",
    featured: true,
  },
]

const categories = [
  "All",
  "AI/ML",
  "Back End Development",
  "Computer Vision",
  "Data Science",
  "DevOps",
  "E-commerce",
  "Entertainment",
  "Healthcare",
  "Web Development",
]

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
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <SectionHeading title="All Projects" subtitle="projects" />

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
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        loading="lazy"
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
