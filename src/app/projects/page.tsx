"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Github, ExternalLink, Award, Link } from "lucide-react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { GlassmorphicCard } from "../../components/glassmorphic-card"

const allProjects = [
  {
    id: 1,
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
    awardUrl: "https://pbp-fasilkom-ui.github.io/ganjil-2024/awards#aplikasi-web-terbaik",
  },
  {
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    <div className="min-h-screen bg-background text-foreground pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">All Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my complete portfolio of projects, from web applications to AI/ML solutions.
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
                placeholder="Search projects..."
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
            {filteredProjects.length === allProjects.length
              ? `Showing all ${filteredProjects.length} projects`
              : `Found ${filteredProjects.length} of ${allProjects.length} projects`}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassmorphicCard>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {project.award && (
                    <a href={project.awardUrl} target="_blank" rel="noopener noreferrer">
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                          <Award className="h-3 w-3 mr-1" />
                          Award Winner
                        </Badge>
                      </div>
                    </a>
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

                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-2xl"
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
                        className="flex-1 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-2xl"
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

        {filteredProjects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
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
  )
}