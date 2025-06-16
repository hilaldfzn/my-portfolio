"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SectionHeading } from "../section-heading"
import { memo, useState, useCallback } from "react"

const TechIcon = memo(({ tech, index }: { tech: { name: string; logo: string }; index: number }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  return (
    <motion.div
      className="flex-shrink-0 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 21) * 0.05 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="flex flex-col items-center space-y-3 p-4 rounded-xl glass-effect border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25">
        <div className="relative w-12 h-12 flex-shrink-0">
          {!imageError ? (
            <Image
              src={tech.logo || "/placeholder.svg"}
              alt={tech.name}
              fill
              className={`object-contain group-hover:scale-110 transition-transform duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full rounded bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
              {tech.name.charAt(0)}
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-center whitespace-nowrap group-hover:text-cyan-400 transition-colors">
          {tech.name}
        </span>
      </div>
    </motion.div>
  )
})

TechIcon.displayName = "TechIcon"

export const SkillsSection = memo(() => {
  const technologies = [
    { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Django", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
    { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "Spring Boot", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    {
      name: "TypeScript",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    },
    { name: "Tailwind CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
    {
      name: "JavaScript",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    { name: "HTML5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "Vue.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    { name: "Flutter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    {
      name: "PostgreSQL",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    },
    { name: "PyTorch", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
    {
      name: "TensorFlow",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    },
    {
      name: "Google Cloud",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    },
    { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  ]

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionHeading title="Tech Stacks & Tools" />
        </motion.div>

        {/* Horizontal scrolling tech stack */}
        <div className="relative">
          <div className="flex space-x-8 animate-scroll-left">
            {[...technologies, ...technologies].map((tech, index) => (
              <TechIcon key={`${tech.name}-${index}`} tech={tech} index={index} />
            ))}
          </div>
        </div>

        {/* Second row with reverse animation */}
        <div className="relative mt-8">
          <div className="flex space-x-8 animate-scroll-right">
            {[...technologies.slice().reverse(), ...technologies.slice().reverse()].map((tech, index) => (
              <TechIcon key={`reverse-${tech.name}-${index}`} tech={tech} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

SkillsSection.displayName = "SkillsSection"