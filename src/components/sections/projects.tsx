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
      liveDemo: "https://food-recipe.up.railway.app/",
      githubUrl: "https://github.com/hilaldfzn/knowledge-graph-food-recipes",
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
                <p className="text-muted-foreground mb-4">{project.description}</p>

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