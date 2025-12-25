"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Github, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  image: string
  demoUrl: string
  repoUrl: string
}

export function ProjectCard({ title, description, tags, image, demoUrl, repoUrl }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <div
        className="relative h-full overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient Border Effect on Hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-pink-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>

        <div className="relative h-full flex flex-col bg-card rounded-2xl">
          {/* Project Image */}
          <div className="relative overflow-hidden rounded-t-2xl h-56">
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-6">
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full shadow-lg"
                  asChild
                >
                  <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                  asChild
                >
                  <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Demo
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image */}
            <img
              src={image}
              alt={title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? "scale-110 blur-sm" : "scale-100"
              }`}
            />

            {/* Status Indicator */}
            <div className="absolute top-4 right-4 z-20">
              <motion.div
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border"
              >
                <span className={`relative flex h-2 w-2`}>
                  {isHovered && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isHovered ? 'bg-primary' : 'bg-muted-foreground'} transition-colors`}></span>
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {isHovered ? 'View' : 'Live'}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-grow flex flex-col">
            {/* Title */}
            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-border hover:border-primary/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Footer Actions - Desktop */}
            <div className="hidden sm:flex justify-end items-center gap-2 mt-auto pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Footer Actions - Mobile (Always Visible) */}
            <div className="flex sm:hidden justify-between items-center gap-2 mt-auto pt-4 border-t border-border">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" asChild>
                <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Code
                </Link>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-full" asChild>
                <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
                  Demo
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
