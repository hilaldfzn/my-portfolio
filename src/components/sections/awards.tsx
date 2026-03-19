"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import { SectionHeading } from "../shared/section-heading"

export function AwardsSection() {
  const awards = [
    {
      id: 1,
      title: "RSA PTI Scholarship Awardee",
      year: "2025",
      description:
        "Recipient of the prestigious RSA PTI Scholarship, recognizing academic excellence and outstanding potential across all faculties at Universitas Indonesia.",
      category: "Scholarship",
    },
    {
      id: 2,
      title: "International Youth Innovation Summit #15",
      subtitle: "Chapter Malaysia, Singapore, Thailand",
      year: "2025",
      description:
        "Triple award winner at the International Youth Innovation Summit, demonstrating exceptional creativity, innovation, and presentation skills on an international platform.",
      achievements: [
        "The Most Creative Delegate",
        "2nd Best Video Project Innovation",
        "3rd Best Presentation",
      ],
      category: "International Competition",
    },
    {
      id: 3,
      title: "Primagama Mencari Juara",
      subtitle: "Provincial-level Jakarta",
      year: "2017",
      description:
        "Achieved 1st Place and Gold Medal in Mathematics at the provincial level, demonstrating exceptional mathematical prowess and problem-solving abilities.",
      achievements: ["1st Place and Gold Medalist in Mathematics"],
      category: "Academic Competition",
    },
  ]

  return (
    <section id="awards" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Honors & Awards" subtitle="awards" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group"
            >
              <div className="card-accent rounded-lg p-6 h-full flex flex-col hover:border-[hsl(var(--syntax-yellow))]/40 transition-all duration-300">
                {/* Trophy icon + year */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-[hsl(var(--syntax-yellow))]/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[hsl(var(--syntax-yellow))]" />
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">
                    {award.year}
                  </span>
                </div>

                {/* Category badge */}
                <span className="inline-block font-mono text-[10px] tracking-wider text-[hsl(var(--syntax-yellow))] mb-3 uppercase">
                  {award.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-display text-foreground group-hover:text-[hsl(var(--syntax-yellow))] transition-colors mb-1">
                  {award.title}
                </h3>

                {award.subtitle && (
                  <p className="text-sm font-body text-muted-foreground mb-3">
                    {award.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed font-body">
                  {award.description}
                </p>

                {/* Achievements */}
                {award.achievements && award.achievements.length > 0 && (
                  <ul className="space-y-1.5 mt-3 pt-3 border-t border-border">
                    {award.achievements.map((achievement) => (
                      <li
                        key={achievement}
                        className="flex items-start gap-2 text-sm text-muted-foreground font-body"
                      >
                        <span className="text-[hsl(var(--syntax-yellow))] mt-0.5 font-mono text-xs flex-shrink-0">{">"}</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
