"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { SectionHeading } from "../shared/section-heading"
import { experiences } from "../../content/experience"

export function ExperienceSection() {
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
