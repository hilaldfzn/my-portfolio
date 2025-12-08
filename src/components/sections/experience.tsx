"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react"
import { SectionHeading } from "../section-heading"
import { GlassmorphicCard } from "../glassmorphic-card"
import { Button } from "../ui/button"

export function ExperienceSection() {
  const experience = [
    {
      title: "Software Engineer Intern",
      company: "PT Bringin Inti Teknologi (bitcorp.)",
      period: "Juli 2025 - Present",
      location: "Jakarta, Indonesia",
      type: "Internship",
      description:
        "Working as a Software Engineer Intern at PT Bringin Inti Teknologi, contributing to the development of TogetherApps, an innovative workforce management solution that enhances employee productivity through advanced technology integration.",
      highlights: [
        "Developed facial recognition attendance system with face embedding extraction, anti-spoofing detection, and GPS validation, eliminating proxy attendance and ensuring 95%+ identity verification accuracy to prevent fraudulent clock-ins",
        "Implemented automated approval systems for leave, overtime, and timesheets with real-time notification channels and analytics dashboards, decreasing manual processing time from 3 days to 4 hours and improving team productivity by 60%",
        "Designed and delivered end-to-end workforce management platform with mobile and web interfaces, enabling efficient employee tracking, and project management",
      ],
    },
    {
      title: "Teaching Assistant",
      company: "Universitas Indonesia",
      period: "August 2024 - Present",
      location: "Depok, Indonesia",
      type: "Part Time",
      description:
        "Teaching Assistant for multiple undergraduate courses including Calculus 2, Statistics & Probability, and Computer Vision, providing comprehensive academic support to students.",
      highlights: [
        "Tutored 250+ undergraduate students in Calculus 2, Statistics & Probability, and Computer Vision courses",
        "Graded homework assignments, quizzes, and coding projects with clear feedback across all three subjects",
        "Helped students connect theory to practical applications in mathematics and programming",
        "Helped in preparing course materials, including practice problems for exam preparation",
      ],
    },
    {
      title: "IT & Broadcast",
      company: "OKK UI",
      period: "June - August 2024",
      location: "Depok, Jawa Barat",
      type: "Organization",
      description:
        "Contributed to the development of the OKK UI 2024 website's frontend, leveraging React for dynamic user interfaces and Tailwind CSS for efficient and responsive styling. Focused on creating an engaging, user-friendly design that aligns with the project's goals and ensures a seamless browsing experience.",
      highlights: [
        "Developed responsive frontend components using React and Tailwind CSS",
        "Created engaging and user-friendly design interfaces",
        "Contributed to the development of a website used by thousands of new students at Universitas Indonesia in 2024 for orientation and university-related information",
      ],
      liveDemo: "https://okk-ui-2024.up.railway.app",
    },
    {
      title: "Editorial Marketing",
      company: "COMPFEST",
      period: "April - November 2023",
      location: "Depok, Jawa Barat",
      type: "Organization",
      description:
        "Contributed to editorial marketing activities for COMPFEST 15, focusing on content creation, media relations, and publication management to enhance the event's visibility and engagement across multiple platforms.",
      highlights: [
        "Created and published press releases for the Grand Launching of COMPFEST 15",
        "Conducted interviews with speakers at the Grand Launching event",
        "Provided captioning, proofreading, translating, and copywriting services",
        "Generated thousands of insights across various social media platforms",
      ],
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
                  <h5 className="font-semibold text-white mb-2">Key Highlights:</h5>
                  <ul className="space-y-1">
                    {exp.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="text-zinc-300 text-sm flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {exp.liveDemo && (
                  <div className="mt-4 pt-4 border-t border-zinc-700/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-2xl"
                      asChild
                    >
                      <a href={exp.liveDemo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  </div>
                )}
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}