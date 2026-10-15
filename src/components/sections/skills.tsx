"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SectionHeading } from "../shared/section-heading"
import { skillCategories } from "../../content/skills"
import Image from "next/image"

function SkillChip({ name, logo, mono, dimmed }: { name: string; logo: string; mono?: boolean; dimmed: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-lg transition-all duration-300 flex-shrink-0 ${
        dimmed
          ? "border-border/30 opacity-20"
          : "border-border bg-card/60 hover:border-primary/50 hover:shadow-[0_0_16px_hsl(var(--primary)/0.08)]"
      }`}
    >
      <Image src={logo} alt={name} width={20} height={20} className={`w-5 h-5 flex-shrink-0 ${mono ? "dark:invert" : ""}`} />
      <span className="text-sm font-mono text-foreground whitespace-nowrap">{name}</span>
    </div>
  )
}

function MarqueeRow({
  category,
  activeCategory,
  index,
}: {
  category: (typeof skillCategories)[number]
  activeCategory: string | null
  index: number
}) {
  const isDimmed = activeCategory !== null && activeCategory !== category.label

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Category label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-mono text-primary">{"// "}{category.label}</span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      {/* Skills row */}
      <div className="flex flex-wrap gap-3">
        {category.skills.map((skill) => (
          <SkillChip key={skill.name} name={skill.name} logo={skill.logo} mono={skill.mono} dimmed={isDimmed} />
        ))}
      </div>
    </motion.div>
  )
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categoryLabels = ["all", ...skillCategories.map((c) => c.label)]

  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Skills & Technologies" subtitle="skills" />

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
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
              {label}
            </button>
          ))}
        </div>

        {/* Skill rows */}
        <div className="space-y-8">
          {skillCategories.map((category, index) => (
            <MarqueeRow
              key={category.label}
              category={category}
              activeCategory={activeCategory}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
