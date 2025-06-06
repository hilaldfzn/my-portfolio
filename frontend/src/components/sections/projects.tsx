"use client"

import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { ExternalLink, Github, Eye, Heart, Star, Award, Brain, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const projects = [
    {
      id: 1,
      title: "MAAMS",
      description:
        "AI-powered root cause analysis application utilizing DeepSeek R1 model for chat completions. Validates and confirms underlying causes of problems with advanced analysis algorithms and prompt systems.",
      image:
        "/assets/MAAMS.png",
      technologies: ["Django", "AI/ML", "DeepSeek", "Qwen", "Python"],
      githubUrl: "https://github.com/Kelompok-5-PPL-A/MAAMS-NG-BE",
      githubUrlFE: "https://github.com/Kelompok-5-PPL-A/MAAMS-NG-FE",
      featured: true,
      category: "AI/ML",
      stats: { views: 2847, likes: 156, stars: 89 },
      color: "cyan",
      icon: Brain,
    },
    {
      id: 2,
      title: "Natural Language Inference",
      description:
        "Deep learning model for predicting logical relationships between sentences using pre-trained DeBERTa V3 and XLM RoBERTa models. Built entirely from scratch with PyTorch for Indonesian and English datasets.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["PyTorch", "DeBERTa", "XLM RoBERTa", "Python", "NLP"],
      githubUrl: "https://github.com/hilaldfzn/natural-language-inference",
      featured: true,
      category: "AI/ML",
      stats: { views: 1923, likes: 134, stars: 67 },
      color: "purple",
      icon: Brain,
    },
    {
      id: 3,
      title: "Lembarpena Web App",
      description:
        "Award-winning literacy community web application connecting readers and authors. Features book purchasing, discussion forums, and wishlist functionality. Winner of The Best Web Application Award.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Django", "Python", "HTML", "CSS", "JavaScript"],
      githubUrl: "https://github.com/PBPC09/tugaskelompok1",
      featured: true,
      category: "Web Development",
      award: "Best Web Application Award",
      stats: { views: 3156, likes: 201, stars: 112 },
      color: "pink",
      icon: Award,
    },
    {
      id: 4,
      title: "Food Recipes Knowledge Graph",
      description:
        "Recipe search application with Knowledge Graph implementation covering Indonesian and international cuisines. Built using RDF graphs with OpenRefine and ontology with Protégé.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Knowledge Graph", "RDF", "OpenRefine", "Protégé", "Python"],
      liveUrl: "https://food-recipe.up.railway.app/",
      githubUrl: "https://github.com/hilaldfzn/knowledge-graph-food-recipes",
      featured: false,
      category: "Data Science",
      stats: { views: 1745, likes: 98, stars: 45 },
      color: "cyan",
      icon: Globe,
    },
    {
      id: 5,
      title: "HoomGroom Web App",
      description:
        "IKEA-inspired furniture e-commerce platform with catalog browsing, cart management, balance top-up, and shipping tracking. Built with Java Spring Boot backend and TypeScript frontend.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Java", "Spring Boot", "TypeScript", "React", "PostgreSQL"],
      githubUrl: "https://github.com/orgs/Adpro-C5/repositories",
      featured: false,
      category: "Web Development",
      stats: { views: 2234, likes: 167, stars: 78 },
      color: "purple",
      icon: Globe,
    },
    {
      id: 6,
      title: "Mario Object Detection",
      description:
        "YOLO v11-based object detection system for accurately detecting Mario characters in video datasets. Addresses real-world challenges like lighting variability and complex backgrounds.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["YOLO v11", "Computer Vision", "Python", "OpenCV", "PyTorch"],
      githubUrl: "https://github.com/hilaldfzn/mario-object-detection",
      featured: false,
      category: "AI/ML",
      stats: { views: 1567, likes: 89, stars: 34 },
      color: "pink",
      icon: Brain,
    },
    {
      id: 7,
      title: "Marmut Music Web App",
      description:
        "Spotify-like streaming platform offering music and podcasts with premium subscriptions, playlists, charts, and royalty tracking for artists, songwriters, and labels.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Django", "Python", "PostgreSQL", "HTML", "CSS"],
      githubUrl: "https://github.com/basdat-d1/marmut",
      featured: false,
      category: "Web Development",
      stats: { views: 1890, likes: 145, stars: 62 },
      color: "cyan",
      icon: Globe,
    },
    {
      id: 8,
      title: "Health Admission Prediction",
      description:
        "Healthcare analytics project predicting patient outcomes and ICU stay duration. Includes classification, regression, and clustering models for medical decision-making support.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Python", "Scikit-learn", "Pandas", "Machine Learning", "Healthcare"],
      githubUrl: "https://github.com/hilaldfzn/OkeGas-health-admission",
      featured: false,
      category: "AI/ML",
      stats: { views: 1234, likes: 76, stars: 28 },
      color: "purple",
      icon: Brain,
    },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case "cyan":
        return {
          border: "border-cyan-400/30 hover:border-cyan-400",
          glow: "hover:shadow-cyan-400/25",
          badge: "bg-cyan-400/10 text-cyan-400 border-cyan-400/30",
          button: "border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/10",
        }
      case "purple":
        return {
          border: "border-purple-400/30 hover:border-purple-400",
          glow: "hover:shadow-purple-400/25",
          badge: "bg-purple-400/10 text-purple-400 border-purple-400/30",
          button: "border-purple-400/50 hover:border-purple-400 hover:bg-purple-400/10",
        }
      case "pink":
        return {
          border: "border-pink-400/30 hover:border-pink-400",
          glow: "hover:shadow-pink-400/25",
          badge: "bg-pink-400/10 text-pink-400 border-pink-400/30",
          button: "border-pink-400/50 hover:border-pink-400 hover:bg-pink-400/10",
        }
      default:
        return {
          border: "border-cyan-400/30 hover:border-cyan-400",
          glow: "hover:shadow-cyan-400/25",
          badge: "bg-cyan-400/10 text-cyan-400 border-cyan-400/30",
          button: "border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/10",
        }
    }
  }

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="cyber-grid opacity-10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recent innovative applications showcasing web development, AI/ML, and data science expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project, index) => {
            const colors = getColorClasses(project.color)
            const isHovered = hoveredProject === project.id
            const IconComponent = project.icon

            return (
              <Card
                key={project.id}
                className={`glass-effect border ${colors.border} hover:shadow-2xl ${colors.glow} transition-all duration-500 group overflow-hidden relative opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] stagger-${(index % 3) + 1}`}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Featured/Award badge */}
                <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
                  {project.featured && (
                    <Badge className={`${colors.badge} border animate-pulse`}>
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {project.award && (
                    <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/30 border">
                      <Award className="w-3 h-3 mr-1" />
                      Award
                    </Badge>
                  )}
                </div>

                {/* Category badge */}
                <div className="absolute top-4 right-4 z-20">
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    <IconComponent className="w-3 h-3 mr-1" />
                    {project.category}
                  </Badge>
                </div>

                {/* Project image with overlay */}
                <div className="relative overflow-hidden h-48">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
                  />

                  {/* Holographic overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${project.color}-400/20 via-transparent to-${project.color}-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Stats overlay */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <div className="flex items-center space-x-1 text-xs text-white bg-black/50 rounded-full px-2 py-1">
                      <Eye className="w-3 h-3" />
                      <span>{project.stats.views}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-white bg-black/50 rounded-full px-2 py-1">
                      <Heart className="w-3 h-3" />
                      <span>{project.stats.likes}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed text-sm">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="outline"
                        className={`${colors.badge} border text-xs hover:scale-105 transition-transform cursor-default`}
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        +{project.technologies.length - 4} more
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex gap-2">
                  {project.liveUrl && (
                    <Button variant="outline" size="sm" className={`cyber-button ${colors.button} flex-1`} asChild>
                      <Link href={project.liveUrl} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className={`cyber-button ${colors.button} flex-1`} asChild>
                    <Link href={project.githubUrl} target="_blank">
                      <Github className="h-4 w-4 mr-2" />
                      {project.githubUrlFE ? "Backend" : "Code"}
                    </Link>
                  </Button>
                  {project.githubUrlFE && (
                    <Button variant="outline" size="sm" className={`cyber-button ${colors.button} flex-1`} asChild>
                      <Link href={project.githubUrlFE} target="_blank">
                        <Github className="h-4 w-4 mr-2" />
                        Frontend
                      </Link>
                    </Button>
                  )}
                </CardFooter>

                {/* Scan line effect on hover */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-${project.color}-400 to-transparent animate-pulse`}
                    />
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* View all projects button */}
        <div className="text-center mt-12 fade-in-up">
          <Button
            size="lg"
            className="cyber-button bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 border-0 text-white shadow-lg hover:shadow-cyan-500/25"
            asChild
          >
            <Link href="https://github.com/hilaldfzn" target="_blank">
              View All Projects on GitHub
              <Github className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}