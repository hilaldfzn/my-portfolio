"use client"

import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Github, Award } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { SectionHeading } from "../section-heading"
import { GlassmorphicCard } from "../glassmorphic-card"

export function ProjectsSection() {
  const projects = [
    {
      id: 1,
      title: "MAAMS",
      description:
        "AI-powered root cause analysis application utilizing DeepSeek R1 model for chat completions. Validates and confirms underlying causes of problems with advanced analysis algorithms and prompt systems.",
      image: "/assets/MAAMS.png",
      technologies: ["Django", "Next.js", "AI/ML", "DeepSeek", "Python"],
      githubUrl: "https://github.com/orgs/Kelompok-5-PPL-A/repositories",
      liveDemo: "https://maams-ng.netlify.app",
      featured: true,
    },
    {
      id: 2,
      title: "Natural Language Inference",
      description:
        "Deep learning model for predicting logical relationships between sentences using pre-trained DeBERTa V3 model. Built entirely from scratch with PyTorch for Indonesian and English datasets.",
      image: "/assets/NLI.png",
      technologies: ["PyTorch", "DeBERTa", "Deep Learning", "Python", "NLP"],
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
        <SectionHeading title="Projects" />

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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 flex gap-2">
                      {project.githubUrl && (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {project.liveDemo && (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
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

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="bg-cyan-400/20 text-cyan-400">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <Button variant="ghost" className="w-full justify-between group">
                  View Details
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
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
          <Button className="cyber-button">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}