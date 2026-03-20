"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "../shared/section-heading"
import { Code, Users, FolderGit2, PenTool } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  const stats = [
    { icon: Code, value: "7+", label: "Months Interning", color: "text-primary" },
    { icon: Users, value: "250+", label: "Students Tutored", color: "text-[hsl(var(--status-green))]" },
    { icon: FolderGit2, value: "10+", label: "Projects Built", color: "text-[hsl(var(--syntax-yellow))]" },
    { icon: PenTool, value: "11+", label: "Articles Written", color: "text-accent" },
  ]

  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="About Me" subtitle="about" />

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Bento Grid: Bio + Education */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bio Card - spans 2 cols */}
            <div className="perspective-container lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, rotateX: 4, y: 20 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card-accent rounded-lg p-6 lg:p-8 h-full"
              >
                <p className="text-sm font-mono text-muted-foreground mb-4">
                  {"// "}who i am
                </p>
                <div className="space-y-4">
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-body">
                    I'm an AI & Software Engineer currently pursuing my Bachelor's degree in Computer Science
                    at <span className="text-foreground font-semibold">Universitas Indonesia</span>. With internship
                    experience in AI engineering and software development, I build end-to-end solutions from model
                    development to production deployment.
                  </p>

                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-body">
                    I specialize in building AI-powered systems and modern web applications using technologies like
                    React, Next.js, Django, FastAPI, and deep learning frameworks. I'm passionate about integrating{" "}
                    <span className="text-foreground font-semibold">AI/ML</span> into practical solutions
                    to solve real-world problems.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Education Card - 1 col */}
            <div className="perspective-container">
              <motion.div
                initial={{ opacity: 0, rotateX: 4, y: 20 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card-accent rounded-lg p-6 h-full"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-md flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/assets/UI.png"
                      alt="Universitas Indonesia"
                      width={56}
                      height={56}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
                      Education
                    </p>
                    <p className="text-xl font-display text-foreground">
                      Computer Science
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      Universitas Indonesia
                    </p>
                    <p className="text-sm text-primary font-mono font-medium">
                      2022 - Present
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-mono text-muted-foreground">
                    {"// "}relevant coursework
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Deep Learning", "Computer Vision", "Knowledge Graph", "Software Engineering", "Web Development", "Databases", "Data Structures and Algorithms", "Human-Computer Interaction"].map((course) => (
                      <span
                        key={course}
                        className="px-2.5 py-1 border border-border rounded-md text-xs text-foreground font-mono"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                className="card-accent rounded-lg p-5 text-center"
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-display text-foreground mb-1">{stat.value}</p>
                <p className="text-xs font-mono text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
