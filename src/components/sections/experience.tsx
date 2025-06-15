"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, MapPin } from "lucide-react"
import { SectionHeading } from "../section-heading"
import { GlassmorphicCard } from "../glassmorphic-card"

export function ExperienceSection() {
  const experience = [
    {
      title: "Frontend Developer",
      company: "OKK UI 2024",
      period: "June - August 2024",
      location: "Remote",
      type: "Part-time",
      description:
        "Developing web applications using modern technologies including Django, React, and Next.js for various clients.",
      achievements: [
        "Built 8+ full-stack web applications with modern frameworks",
        "Implemented AI-powered features using machine learning models",
        "Collaborated with cross-functional teams in agile environments",
        "Maintained 99% client satisfaction rate",
      ],
      technologies: ["Django", "React", "Next.js", "Python", "TypeScript"],
      color: "purple",
    },
    {
      title: "Editorial Marketing",
      company: "COMPFEST 15",
      period: "May 2023 - August 2023",
      location: "Jakarta, Indonesia",
      type: "Internship",
      description:
        "Contributed to large-scale event management systems and gained experience in team collaboration and project management.",
      achievements: [
        "Developed features for event registration system",
        "Optimized database queries improving performance by 40%",
        "Mentored junior developers in coding best practices",
        "Led a team of 5 developers in academy program",
      ],
      technologies: ["Django", "PostgreSQL", "JavaScript", "Bootstrap"],
      color: "pink",
    },
  ]

  return (
    <section id="experience" className="py-32 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Work & Organizational Experiences"
          subtitle="My professional journey and contributions"
        />

        <div className="space-y-8 mt-16">
          {experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="h-5 w-5 text-cyan-400" />
                      <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                    </div>
                    <p className="font-medium text-cyan-400">{exp.company}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {exp.period}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {exp.location}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-300">{exp.type}</span>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 mb-4">{exp.description}</p>

                <div>
                  <h5 className="font-semibold text-white mb-2">Key Achievements:</h5>
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="text-zinc-300 text-sm flex items-start gap-2">
                        <span className="mt-1 text-cyan-400">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}