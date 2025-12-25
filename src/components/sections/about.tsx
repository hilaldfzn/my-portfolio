"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "../section-heading"

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="About Me" subtitle="Get to know me better" />

        <div className="max-w-6xl mx-auto">
          {/* Bio Left + Education Right */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                I'm a passionate full-stack developer currently pursuing my Bachelor's degree in Computer Science
                at <span className="text-foreground font-semibold">Universitas Indonesia</span>. My journey in tech
                started with a fascination for how things work behind the scenes, which led me to explore both
                frontend and backend development.
              </p>

              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                I specialize in building modern web applications using cutting-edge technologies like React, Next.js,
                Django, and FastAPI. Beyond web development, I'm deeply interested in{" "}
                <span className="text-foreground font-semibold">AI/ML</span> and how it can be integrated into
                practical solutions to solve real-world problems.
              </p>
            </motion.div>

            {/* Right: Education Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img
                    src="/assets/UI.png"
                    alt="Universitas Indonesia"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Education
                  </h3>
                  <p className="text-xl font-heading font-bold text-foreground">
                    Computer Science
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    Universitas Indonesia
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    2022 - Present
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Relevant Coursework:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Software Engineering", "Web Design & Development", "Databases", "Data Structures & Algorithms", "Deep Learning", "Computer Vision", "Human Computer Interaction"].map((course, index) => (
                    <motion.span
                      key={course}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                      className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-foreground font-medium"
                    >
                      {course}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
