"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar, MapPin } from "lucide-react"
import { SectionHeading } from "../section-heading"
import { GlassmorphicCard } from "../glassmorphic-card"

export function AboutSection() {
  const education = [
    {
      degree: "Bachelor of Computer Science",
      institution: "University of Technology",
      location: "Jakarta, Indonesia",
      period: "2018 - 2022",
      type: "Bachelor's Degree",
      description:
        "Specialized in Software Engineering and Web Development with focus on modern programming languages and frameworks.",
      achievements: [
        "Graduated Magna Cum Laude with GPA 3.8/4.0",
        "Led final year project on AI-powered web applications",
        "Active member of Computer Science Student Association",
      ],
    },
    {
      degree: "Full Stack Web Development Bootcamp",
      institution: "Tech Academy",
      location: "Jakarta, Indonesia",
      period: "2022",
      type: "Certification",
      description:
        "Intensive 6-month program covering modern web technologies including React, Node.js, and cloud deployment.",
      achievements: [
        "Completed 500+ hours of hands-on coding projects",
        "Built 5 full-stack applications from scratch",
        "Received 'Outstanding Student' award for project excellence",
      ],
    },
  ]

  return (
    <section id="about" className="py-32 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title="About Me" subtitle="Get to know me better" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mt-16">
          {/* Photo */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl opacity-70"></div>
              <div className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800">
                <img src="/placeholder.svg?height=600&width=600" alt="Hilal" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-white">Available for work</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* My Story */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassmorphicCard>
              <h3 className="text-2xl font-bold mb-4 gradient-text">My Story</h3>
              <p className="text-lg text-zinc-300 mb-4">
                I'm a passionate Full Stack Developer with a strong foundation in modern web technologies. I love
                creating digital solutions that make a real impact and solve complex problems.
              </p>
              <p className="text-lg text-zinc-300 mb-4">
                My journey in tech started with curiosity about how websites work, and it has evolved into a deep
                passion for building scalable, user-friendly applications that enhance people's lives.
              </p>
              <p className="text-lg text-zinc-300">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects,
                and staying up-to-date with the latest industry trends.
              </p>
            </GlassmorphicCard>
          </motion.div>
        </div>

        {/* Education Section */}
        <div className="mt-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="h-8 w-8 text-cyan-400" />
              <h3 className="text-3xl font-bold gradient-text">Education</h3>
            </div>
          </motion.div>

          <div className="space-y-8">
            {education.map((edu, index) => (
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
                        <GraduationCap className="h-5 w-5 text-cyan-400" />
                        <h4 className="text-xl font-bold text-white">{edu.degree}</h4>
                      </div>
                      <p className="font-medium text-cyan-400">{edu.institution}</p>
                      <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {edu.period}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {edu.location}
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-300">{edu.type}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-zinc-300 mb-4">{edu.description}</p>

                  <div>
                    <h5 className="font-semibold text-white mb-2">Key Achievements:</h5>
                    <ul className="space-y-1">
                      {edu.achievements.map((achievement, achIndex) => (
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
      </div>
    </section>
  )
}