"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { SectionHeading } from "../section-heading"
import { GlassmorphicCard } from "../glassmorphic-card"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Muhammad Rafli Mahesa",
      role: "Teaching Assistant of Advanced Programming",
      company: "Faculty of Computer Science, Universitas Indonesia",
      image: "/assets/testimonials/rafli.jpeg",
      content:
        "Hilal is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are outstanding.",
    },
    {
      name: "I Made Surya Anahata Putra",
      role: "Vice Director of Mobile Development",
      company: "RISTEK Fasilkom UI",
      image: "/assets/testimonials/surya.jpeg",
      content:
        "Working with Hilal has been a pleasure. He brings innovative solutions to complex problems and is always willing to help team members.",
    },
    {
      name: "Emily Rodriguez",
      role: "UI/UX Designer",
      company: "Creative Agency",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "Hilal's ability to translate design concepts into functional, beautiful interfaces is remarkable. He's a true professional.",
    },
    {
      name: "David Thompson",
      role: "CTO",
      company: "Startup Hub",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "Hilal's technical expertise and leadership skills make him an invaluable team member. He consistently exceeds expectations.",
    },
    {
      name: "Lisa Wang",
      role: "Project Manager",
      company: "Global Tech",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "Hilal is reliable, communicative, and delivers projects on time. His code quality is excellent and well-documented.",
    },
    {
      name: "Alex Kumar",
      role: "Full Stack Developer",
      company: "Innovation Labs",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "Hilal is a mentor and friend. His knowledge sharing and collaborative approach make him a great colleague to work with.",
    },
  ]

  return (
    <section id="testimonials" className="py-32 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title="What People Say" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard>
                <div className="relative">
                  <Quote className="absolute top-0 right-0 h-8 w-8 text-cyan-400/30 translate-x-2 -translate-y-2" />

                  <p className="text-muted-foreground mb-6 relative z-10">"{testimonial.content}"</p>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-cyan-400/30 p-0.5">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}