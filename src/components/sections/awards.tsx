"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, GraduationCap } from "lucide-react"
import { SectionHeading } from "../section-heading"

export function AwardsSection() {
  const awards = [
    {
      id: 1,
      title: "RSA PTI Scholarship Awardee",
      year: "2025",
      description:
        "Recipient of the prestigious RSA PTI Scholarship, recognizing academic excellence and outstanding potential across all faculties at Universitas Indonesia.",
      icon: GraduationCap,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      category: "Scholarship",
      categoryColor: "text-primary",
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
      icon: Trophy,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      category: "International Competition",
      categoryColor: "text-primary",
    },
    {
      id: 3,
      title: "Primagama Mencari Juara",
      subtitle: "Provincial-level Jakarta",
      year: "2017",
      description:
        "Achieved 1st Place and Gold Medal in Mathematics at the provincial level, demonstrating exceptional mathematical prowess and problem-solving abilities.",
      achievements: ["1st Place and Gold Medalist in Mathematics"],
      icon: Medal,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      category: "Academic Competition",
      categoryColor: "text-primary",
    },
  ]

  return (
    <section id="awards" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Honors & Awards" 
          subtitle="Recognition of excellence and achievements" 
        />

        <div className="max-w-4xl mx-auto space-y-8 mt-16">
          {awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${award.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <award.icon className={`w-6 h-6 ${award.iconColor}`} />
                  </div>

                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {award.title}
                    </h3>

                    {/* Subtitle with spacing */}
                    {award.subtitle && (
                      <p className={`text-base font-medium mb-3 ${award.iconColor}`}>
                        {award.subtitle}
                      </p>
                    )}

                    {/* Category Badge and Year */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`text-xs font-bold ${award.categoryColor} tracking-wider`}>
                        {award.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {award.year}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {award.description}
                    </p>

                    {/* Achievements */}
                    {award.achievements && award.achievements.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold text-foreground mb-2">
                          Achievements:
                        </h5>
                        <ul className="space-y-2">
                          {award.achievements.map((achievement) => (
                            <li 
                              key={achievement} 
                              className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
                            >
                              <span className={`${award.iconColor} flex-shrink-0 mt-0.5`}>•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}