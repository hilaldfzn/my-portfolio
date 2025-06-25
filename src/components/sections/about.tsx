"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar, MapPin } from "lucide-react"
import { SectionHeading } from "../section-heading"
import { GlassmorphicCard } from "../glassmorphic-card"

export function AboutSection() {
  const education = [
    {
      degree: "Computer Science",
      institution: "Universitas Indonesia",
      location: "Depok, Jawa Barat",
      period: "2022 - Present",
      type: "Bachelor's Degree",
      description:
        "Specialized in software engineering and web development with focus on modern programming languages and frameworks.",
      highlights: [
        "Joined several organizations and became a teaching assistant",
        "Created multiple web applications, data science, and AI/ML projects",
        "Acquired strong skills in software development, problem-solving, and teamwork",
      ],
    },
    {
      degree: "Mathematics and Natural Sciences",
      institution: "SMA Negeri 1 Jakarta",
      location: "Jakarta Pusat",
      period: "2019 - 2022",
      type: "Senior High School",
      description:
        "Focused on mathematics and natural sciences with strong foundation in analytical thinking and problem-solving skills.",
      highlights: [
        "Participated in the National Science Olympiad in Astronomy at the provincial-level (Jakarta) and ranked in 6th place",
        "Became a top 10 outstanding student in the school",
        "Developed strong analytical and scientific research skills",
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
        <SectionHeading title="About Me" />

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
                <img src="/assets/me.png" alt="Hilal" className="w-full h-full object-cover" />
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

          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassmorphicCard>
              <h3 className="text-2xl font-bold mb-4 gradient-text">Get to Know Me</h3>
              <p className="text-lg text-zinc-300 mb-4">
                I'm an undergraduate Computer Science student at Universitas Indonesia with a strong passion for building meaningful and impactful technology. 
                I’m especially interested in software engineering, web development, and data science, and I enjoy exploring how these areas intersect to solve real-world problems.
              </p>
              <p className="text-lg text-zinc-300 mb-4">
                I love working on projects that challenge me to learn new tools and think critically, whether it's developing intuitive web applications, designing efficient software systems, or analyzing data to uncover insights. 
                I have hands-on experience with several programming languages and frameworks, and I’m always excited to grow and collaborate in a team environment.
              </p>
              <p className="text-lg text-zinc-300">
                Currently, I’m looking for opportunities to apply and expand my skills through internships, projects, or research collaborations. 
                I’m a fast learner, a team player, and always eager to explore new challenges in tech.
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
                    <h5 className="font-semibold text-white mb-2">Key Highlights:</h5>
                    <ul className="space-y-1">
                      {edu.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="text-zinc-300 text-sm flex items-start gap-2">
                          <span className="text-cyan-400">•</span>
                          {highlight}
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