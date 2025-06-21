"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Github, ExternalLink, Award } from "lucide-react"
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
    technologies: ["Django", "AI/ML", "DeepSeek", "Qwen", "Python"],
    categories: ["AI/ML", "Web Development"],
    githubUrl: "https://github.com/Kelompok-5-PPL-A/MAAMS-NG-BE",
    liveDemo: "https://maams-ng.netlify.app",
    featured: true,
  },
  {
    id: 2,
    title: "Natural Language Inference",
    description:
      "Deep learning model for predicting logical relationships between sentences using pre-trained DeBERTa V3 model. Built entirely from scratch with PyTorch for Indonesian and English datasets.",
    image: "/assets/NLI.png",
    technologies: ["Python", "PyTorch", "DeBERTa", "NLP"],
    categories: ["AI/ML"],
    githubUrl: "https://github.com/hilaldfzn/natural-language-inference",
    featured: true,
  },
  {
    id: 3,
    title: "Lembarpena Web App",
    description:
      "Award-winning literacy community web application connecting readers and authors. Features book purchasing, discussion forums, and wishlist functionality. Winner of The Best Web Application Award.",
    image: "/assets/LembarPena.png",
    technologies: ["Django", "Python", "HTML", "CSS", "JavaScript"],
    categories: ["Web Development"],
    githubUrl: "https://github.com/PBPC09/tugaskelompok1",
    liveDemo: "https://lembarpena.vercel.app",
    featured: true,
    award: "Best Web Application Award",
  },
  {
    id: 4,
    title: "Food Recipes",
    description:
      "Recipe search application with Knowledge Graph implementation covering Indonesian and international cuisines. Built using RDF graphs with OpenRefine and ontology with Protégé.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Knowledge Graph", "RDF", "OpenRefine", "Protégé", "Python"],
    categories: ["Data Science", "AI/ML"],
    githubUrl: "https://github.com/hilaldfzn/knowledge-graph-food-recipes",
    liveDemo: "https://food-recipe.up.railway.app",
    featured: true,
  },
  {
    id: 5,
    title: "HoomGroom Web App",
    description:
      "IKEA-inspired furniture e-commerce platform with catalog browsing, cart management, balance top-up, and shipping tracking. Built with Java Spring Boot backend and TypeScript frontend.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Java", "Spring Boot", "TypeScript", "React", "PostgreSQL"],
    categories: ["Web Development", "E-commerce"],
    githubUrl: "https://github.com/orgs/Adpro-C5/repositories",
    liveDemo: "s",
    featured: true,
  },
  {
    id: 6,
    title: "Mario Object Detection",
    description:
      "YOLO v11-based object detection system for accurately detecting Mario characters in video datasets. Addresses real-world challenges like lighting variability and complex backgrounds.",
    image: "/assets/mario.png",
    technologies: ["YOLO v11", "Computer Vision", "Python", "OpenCV", "PyTorch"],
    categories: ["AI/ML", "Computer Vision"],
    githubUrl: "https://github.com/hilaldfzn/mario-object-detection",
    featured: true,
  },
  {
    id: 7,
    title: "Marmut Music Web App",
    description:
      "Spotify-like streaming platform offering music and podcasts with premium subscriptions, playlists, charts, and royalty tracking for artists, songwriters, and labels.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Django", "Python", "PostgreSQL", "HTML", "CSS"],
    categories: ["Web Development", "Entertainment"],
    githubUrl: "https://github.com/basdat-d1/marmut",
    liveDemo: "s",
    featured: true,
  },
  {
    id: 8,
    title: "Health Admission Prediction",
    description:
      "Healthcare analytics project predicting patient outcomes and ICU stay duration. Includes classification, regression, and clustering models for medical decision-making support.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Python", "Scikit-learn", "Pandas", "Machine Learning", "Healthcare"],
    categories: ["AI/ML", "Healthcare"],
    githubUrl: "https://github.com/hilaldfzn/OkeGas-health-admission",
    featured: true,
  },
]

const categories = [
  "All",
  "AI/ML",
  "Web Development",
  "Data Science",
  "Computer Vision",
  "E-commerce",
  "Entertainment",
  "Healthcare",
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
                <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>

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