"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { SectionHeading } from "../section-heading"

export function ExperienceSection() {
  const experiences = [
    {
      title: "AI Engineer",
      company: "GDP Labs",
      period: "Mar 2026 - Present",
      location: "Jakarta Selatan, Jakarta, Indonesia",
      type: "INTERNSHIP",
      description:
        "Contributing to the development of AI safety and guardrail systems, focusing on LLM-based content moderation and safety configuration architecture.",
      highlights: [
        "Redesigned the SDK's guardrail detection from rule-based phrase matching to LLM-based classification with structured safety verdicts across 16 content safety categories, improving multilingual accuracy and reducing false positives",
        "Built a pluggable safety configuration architecture with YAML-driven defaults, category filtering, and allowlist/denylist topic modes, integrated into NVIDIA NeMo Guardrails via custom Colang flows and a LangChain adapter",
      ],
    },
    {
      title: "Software Engineer",
      company: "PT Bringin Inti Teknologi (bitcorp.)",
      period: "Jul 2025 - Jan 2026",
      location: "Jakarta Pusat, Jakarta, Indonesia",
      type: "INTERNSHIP",
      description:
        "Contributing to the development of TogetherApps, an innovative workforce management solution that enhances employee productivity through advanced technology integration.",
      highlights: [
        "Designed and delivered end-to-end workforce management platform with mobile and web interfaces, enabling efficient employee tracking, and project management",
        "Developed a facial recognition attendance system with face embedding extraction, anti-spoofing detection, and GPS validation, impersonation in attendance and ensuring 95%+ identity verification accuracy to prevent fraudulent clock-ins",
        "Implemented automated approval systems for leave, overtime, and timesheets with real-time notification channels and analytics dashboards, decreasing manual processing time from 3 days to 4 hours and improving team productivity by 60%",
      ],
    },
    {
      title: "Teaching Assistant",
      company: "Universitas Indonesia",
      period: "Feb - Oct 2025",
      location: "Depok, Jawa Barat, Indonesia",
      type: "PART TIME",
      description:
        "Teaching Assistant for multiple undergraduate courses including Calculus 2, Statistics & Probability, and Computer Vision, providing comprehensive academic support to students.",
      highlights: [
        "Tutored 250+ undergraduate students in Computer Vision, Statistics & Probability and Calculus 2 courses",
        "Graded homework assignments, quizzes, and coding projects with clear feedback across all three subjects",
        "Helped students connect theory to practical applications in mathematics and programming",
        "Helped in preparing course materials, including practice problems for exam preparation",
      ],
    },
    {
      title: "IT & Broadcast",
      company: "OKK UI 2024",
      period: "Jun - Aug 2024",
      location: "Depok, Jawa Barat, Indonesia",
      type: "ORGANIZATION",
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
      period: "Apr - Nov 2023",
      location: "Depok, Jawa Barat, Indonesia",
      type: "ORGANIZATION",
      description:
        "Contributed to editorial marketing activities for COMPFEST 15, focusing on content creation, media relations, and publication management to enhance event visibility and engagement.",
      highlights: [
        "Provided captioning, proofreading, translating, and copywriting services for COMPFEST publications, resulting in thousands of insights across various social media platforms",
        "Created and published press releases and conducted speaker interviews for the Grand Launching of COMPFEST 15",
      ],
    },
  ]

  return (
    <section id="experiences" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Experiences" subtitle="experiences" />

        {/* Timeline layout */}
        <div className="relative max-w-5xl mx-auto">
          {/* Center timeline line - desktop only */}
          <div className="hidden lg:block timeline-line left-1/2 -translate-x-px top-0" />
          {/* Left timeline line - mobile/tablet */}
          <div className="lg:hidden timeline-line left-5 top-0" />

          <div className="space-y-12 lg:space-y-16">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative"
                >
                  {/* Desktop: alternating layout */}
                  <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 items-start">
                    {/* Left side */}
                    {isLeft ? (
                      <>
                        <div className="text-right pr-12">
                          <TimelineCard exp={exp} align="right" />
                        </div>
                        <div />
                      </>
                    ) : (
                      <>
                        <div />
                        <div className="pl-12">
                          <TimelineCard exp={exp} align="left" />
                        </div>
                      </>
                    )}

                    {/* Center dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-6">
                      <div className="timeline-dot" />
                    </div>

                    {/* Connector line */}
                    <div
                      className={`timeline-connector ${
                        isLeft ? "right-1/2 mr-[6px]" : "left-1/2 ml-[6px]"
                      }`}
                    />
                  </div>

                  {/* Mobile/Tablet: single column with left line */}
                  <div className="lg:hidden flex gap-6">
                    {/* Dot on the line */}
                    <div className="flex-shrink-0 relative">
                      <div className="timeline-dot mt-6" />
                    </div>

                    {/* Card */}
                    <div className="flex-1 pb-2">
                      <TimelineCard exp={exp} align="left" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineCard({
  exp,
  align,
}: {
  exp: {
    title: string
    company: string
    period: string
    location: string
    type: string
    description: string
    highlights: string[]
    liveDemo?: string
  }
  align: "left" | "right"
}) {
  return (
    <div className={`card-accent rounded-lg p-6 ${align === "right" ? "text-left" : ""}`}>
      {/* Period & Type badge */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="font-mono text-sm text-muted-foreground">
          {exp.period}
        </span>
        <span className={`font-mono text-xs tracking-wider px-2 py-0.5 rounded ${
          exp.type === "INTERNSHIP"
            ? "text-primary bg-primary/10"
            : "text-muted-foreground bg-muted"
        }`}>
          {exp.type}
        </span>
      </div>

      <h3 className="text-lg font-display text-foreground mb-1 group-hover:text-primary transition-colors">
        {exp.title}
      </h3>

      <p className="text-sm font-body text-muted-foreground mb-1">
        {exp.company}
      </p>
      <p className="text-xs font-mono text-muted-foreground/70 mb-4">
        {exp.location}
      </p>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed font-body">
        {exp.description}
      </p>

      <ul className="space-y-2 mb-4">
        {exp.highlights.map((highlight: string, hIndex: number) => (
          <li key={hIndex} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed font-body">
            <span className="text-primary mt-1 font-mono text-xs flex-shrink-0">{">"}</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {exp.liveDemo && (
        <a
          href={exp.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:text-primary/80 transition-colors"
        >
          <span>View Project</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  )
}
