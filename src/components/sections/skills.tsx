"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionHeading } from "../section-heading"

const skillCategories = [
  {
    label: "languages",
    skills: [
      { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "Go", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg" },
      { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "Dart", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
    ],
  },
  {
    label: "frameworks",
    skills: [
      { name: "Django", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" },
      { name: "Flask", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
      { name: "FastAPI", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
      { name: "Spring Boot", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
      { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Vue.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
      { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Flutter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
      { name: "PyTorch", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
      { name: "TensorFlow", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
    ],
  },
  {
    label: "databases",
    skills: [
      { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    ],
  },
  {
    label: "devops & tools",
    skills: [
      { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
      { name: "Google Cloud", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
      { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    ],
  },
]

// Orbit order from innermost to outermost:
// 1. databases (3 skills)
// 2. devops & tools (5 skills)
// 3. languages (6 skills)
// 4. frameworks (12 skills)
const orbitOrder = [
  { categoryLabel: "databases", rx: 12, ry: 14 },
  { categoryLabel: "devops & tools", rx: 23, ry: 25 },
  { categoryLabel: "languages", rx: 34, ry: 36 },
  { categoryLabel: "frameworks", rx: 46, ry: 47 },
]

// Square container + square viewBox = CSS % positions map 1:1 to SVG coordinates
function getOrbitPositions(count: number, rx: number, ry: number) {
  const positions: { x: number; y: number }[] = []
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2
    positions.push({
      x: 50 + rx * Math.cos(angle),
      y: 50 + ry * Math.sin(angle),
    })
  }
  return positions
}

const floatSpeeds = [3.5, 4.2, 3.8, 4.5, 3.2, 4.8, 3.6, 4.1, 3.9, 4.4, 3.3, 4.7]
const floatAmounts = [6, 5, 7, 5, 6, 4, 6, 5, 7, 5, 6, 4]

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categoryLabels = ["all", ...skillCategories.map((c) => c.label)]

  const categoryMap = Object.fromEntries(
    skillCategories.map((c) => [c.label, c.skills])
  )

  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Skills & Technologies" subtitle="skills" />

        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-3xl mx-auto">
          {categoryLabels.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveCategory(label === "all" ? null : label)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 border ${
                (label === "all" && activeCategory === null) || activeCategory === label
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {"// "}{label}
            </button>
          ))}
        </div>

        {/* 4-orbit layout - desktop (square container so SVG and CSS % align 1:1) */}
        <div className="hidden md:block max-w-3xl mx-auto">
          <div className="relative w-full aspect-square">
            {/* Orbit ring lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              {orbitOrder.map((orbit, i) => (
                <ellipse
                  key={i}
                  cx="50"
                  cy="50"
                  rx={orbit.rx}
                  ry={orbit.ry}
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="0.2"
                  strokeDasharray="1.2 1"
                  opacity="0.15"
                />
              ))}
            </svg>

            {/* Skills on their orbits */}
            <AnimatePresence>
              {orbitOrder.map((orbit, orbitIndex) => {
                const skills = categoryMap[orbit.categoryLabel] || []
                const positions = getOrbitPositions(skills.length, orbit.rx, orbit.ry)

                return skills.map((skill, skillIndex) => {
                  const pos = positions[skillIndex]
                  const isActive = activeCategory === null || activeCategory === orbit.categoryLabel
                  const globalIndex = orbitIndex * 12 + skillIndex
                  const speed = floatSpeeds[globalIndex % floatSpeeds.length]
                  const amount = floatAmounts[globalIndex % floatAmounts.length]

                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: isActive ? 1 : 0.15, scale: isActive ? 1 : 0.8 }}
                      viewport={{ once: true }}
                      animate={{
                        opacity: isActive ? 1 : 0.15,
                        scale: isActive ? 1 : 0.8,
                        y: isActive ? [0, -amount, 0] : 0,
                      }}
                      transition={isActive ? {
                        y: { duration: speed, repeat: Infinity, ease: "easeInOut", delay: globalIndex * 0.05 },
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.3 },
                      } : {
                        duration: 0.3,
                      }}
                      whileHover={isActive ? { scale: 1.25, zIndex: 10 } : {}}
                      className="absolute flex flex-col items-center gap-1 cursor-default group"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "border-border bg-card/80 group-hover:border-primary group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                          : "border-border/50 bg-card/30"
                      }`}>
                        <img
                          src={skill.logo}
                          alt={skill.name}
                          className="w-6 h-6"
                          loading="lazy"
                        />
                      </div>
                      <span className={`text-[9px] font-mono whitespace-nowrap transition-colors duration-300 ${
                        isActive
                          ? "text-muted-foreground group-hover:text-primary"
                          : "text-muted-foreground/30"
                      }`}>
                        {skill.name}
                      </span>
                    </motion.div>
                  )
                })
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile fallback - scrolling grid */}
        <div className="md:hidden max-w-lg mx-auto">
          <div className="grid grid-cols-3 gap-3">
            {skillCategories.flatMap((cat) =>
              cat.skills.map((skill) => ({ ...skill, category: cat.label }))
            ).map((skill, index) => {
              const isActive = activeCategory === null || activeCategory === skill.category

              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className={`flex items-center gap-2 px-2.5 py-2 border rounded-md transition-all duration-200 ${
                    isActive
                      ? "border-border hover:border-primary/50"
                      : "border-border/30 opacity-20"
                  }`}
                >
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="w-5 h-5 flex-shrink-0"
                    loading="lazy"
                  />
                  <span className="text-xs font-mono text-foreground truncate">
                    {skill.name}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
