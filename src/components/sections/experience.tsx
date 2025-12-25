"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, ExternalLink, Briefcase, GraduationCap, Users } from "lucide-react"
import { SectionHeading } from "../section-heading"

export function ExperienceSection() {
  const experiences = [
    {
      title: "Software Engineer Intern",
      company: "PT Bringin Inti Teknologi (bitcorp.)",
      period: "July 2025 - January 2026",
      location: "Jakarta, Indonesia",
      type: "INTERNSHIP",
      typeColor: "text-rose-600 dark:text-rose-400",
      icon: Briefcase,
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-400",
      description:
        "Contributing to the development of TogetherApps, an innovative workforce management solution that enhances employee productivity through advanced technology integration.",
      highlights: [
        "Designed and delivered end-to-end workforce management platform with mobile and web interfaces, enabling efficient employee tracking, and project management",
        "Developed a facial recognition attendance system with face embedding extraction, anti-spoofing detection, and GPS validation, impersonation in attendance and ensuring 95%+ identity verification accuracy to prevent fraudulent clock-ins",
        "Implemented automated approval systems for leave, overtime, and timesheets with real-time notification channels and analytics dashboards, decreasing manual processing time from 3 days to 4 hours and improving team productivity by 60%"
      ],
    },
    {
      title: "Teaching Assistant",
      company: "Universitas Indonesia",
      period: "August 2024 - October 2025",
      location: "Depok, Indonesia",
      type: "PART TIME",
      typeColor: "text-blue-600 dark:text-blue-400",
      icon: GraduationCap,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      description:
        "Teaching Assistant for multiple undergraduate courses including Calculus 2, Statistics & Probability, and Computer Vision, providing comprehensive academic support to students.",
      highlights: [
        "Tutored 250+ undergraduate students in Computer Vision, Statistics & Probability and Calculus 2 courses",
        "Graded homework assignments, quizzes, and coding projects with clear feedback across all three subjects",
        "Helped students connect theory to practical applications in mathematics and programming",
        "Helped in preparing course materials, including practice problems for exam preparation"
      ],
    },
    {
      title: "IT & Broadcast",
      company: "OKK UI 2024",
      period: "June - August 2024",
      location: "Depok, Jawa Barat",
      type: "ORGANIZATION",
      typeColor: "text-purple-600 dark:text-purple-400",
      icon: Users,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      description:
        "Contributed to the development of the OKK UI 2024 website's frontend, leveraging React for dynamic user interfaces and Tailwind CSS for efficient and responsive styling.",
      highlights: [
        "Designed engaging and user-friendly interfaces to enhance user experience",
        "Developed responsive frontend components and pages using React and Tailwind CSS for the official OKK UI website",
        "Contributed to the development of a website used by thousands of new students at Universitas Indonesia in 2024 for orientation and university-related information",
      ],
      liveDemo: "https://okk-ui-2024.up.railway.app",
    },
    {
      title: "Editorial Marketing",
      company: "COMPFEST 15",
      period: "April - November 2023",
      location: "Depok, Jawa Barat",
      type: "ORGANIZATION",
      typeColor: "text-emerald-600 dark:text-emerald-400",
      icon: Users,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      description:
        "Contributed to editorial marketing activities for COMPFEST 15, focusing on content creation, media relations, and publication management to enhance event visibility and engagement.",
      highlights: [
        "Provided captioning, proofreading, translating, and copywriting services for COMPFEST publications, resulting in thousands of insights across various social media platforms",
        "Created and published press releases and conducted speaker interviews for the Grand Launching of COMPFEST 15",
      ],
    },
  ]

  return (
    <section id="experience" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Experiences" subtitle="My professional and organizational journey" />

        {/* Desktop Timeline Layout */}
        <div className="hidden lg:block relative max-w-6xl mx-auto">
          {/* Center Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-border via-primary/20 to-border -translate-x-1/2" />

          <div className="space-y-16">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative grid grid-cols-2 gap-8 items-center ${!isLeft ? 'direction-rtl' : ''}`}
                >
                  {/* Content - Left or Right */}
                  <div className={isLeft ? 'pr-8' : 'pl-8 col-start-2'}>
                    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
                      {/* Type Label */}
                      <div className={`text-xs font-bold ${exp.typeColor} mb-3 tracking-wider`}>
                        {exp.type}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>

                      {/* Company */}
                      <p className="text-base font-semibold text-muted-foreground mb-3">
                        {exp.company}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{exp.location}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Highlights */}
                      <ul className="space-y-2 mb-4">
                        {exp.highlights.map((highlight: string, hIndex: number) => (
                          <li key={hIndex} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                            <span className="text-primary mt-1.5">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Live Demo Link */}
                      {exp.liveDemo && (
                        <a
                          href={exp.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          <span>View Project</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Timeline Icon - Center */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10">
                    <div className={`w-14 h-14 rounded-full ${exp.iconBg} border-4 border-background flex items-center justify-center shadow-lg`}>
                      <exp.icon className={`w-6 h-6 ${exp.iconColor}`} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile/Tablet Stacked */}
        <div className="lg:hidden max-w-3xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 transition-all group">
                {/* Type Label */}
                <div className={`text-xs font-bold ${exp.typeColor} mb-3 tracking-wider`}>
                  {exp.type}
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {exp.title}
                </h3>

                {/* Company */}
                <p className="text-base font-semibold text-muted-foreground mb-3">
                  {exp.company}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 mb-4">
                  {exp.highlights.map((highlight: string, hIndex: number) => (
                    <li key={hIndex} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <span className="text-primary mt-1.5">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Live Demo Link */}
                {exp.liveDemo && (
                  <a
                    href={exp.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>View Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
