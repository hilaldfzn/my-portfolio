"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "../shared/section-heading"
import { GitHubContributions } from "./github-contributions"

export function GitHubActivitySection() {
  return (
    <section id="github" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="GitHub Activity" subtitle="github-activity" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <GitHubContributions />
        </motion.div>
      </div>
    </section>
  )
}
