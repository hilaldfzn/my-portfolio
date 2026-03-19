"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Linkedin, Send, Github } from "lucide-react"
import { Button } from "../../components/ui/button"
import { SectionHeading } from "../section-heading"
import { useToast } from "../../hooks/use-toast"
import { useState } from "react"
import { sendEmail } from "../../app/actions"

export function ContactSection() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await sendEmail(formData)

      if (result.success) {
        toast({
          title: "Message sent!",
          description: "Thanks for reaching out. I'll get back to you soon.",
        })
        e.currentTarget.reset()
      } else {
        toast({
          title: "Failed to send message",
          description: result.error || "Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactLinks = [
    { icon: Mail, label: "hilalfauzan9@gmail.com", href: "mailto:hilalfauzan9@gmail.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/mhilaldfzn" },
    { icon: Github, label: "GitHub", href: "https://github.com/hilaldfzn" },
    { icon: MapPin, label: "Jakarta Pusat, Jakarta, Indonesia", href: null },
  ]

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      {/* Subtle gradient orb background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Get In Touch" subtitle="contact" />

        {/* Two-column layout */}
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Info + decorative SVG */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-body">
                I'm always open to new opportunities, collaborations, and interesting conversations.
                Whether you have a project in mind or just want to say hi, feel free to reach out.
              </p>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--status-green))] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--status-green))]" />
              </span>
              <p className="text-sm font-mono text-muted-foreground">
                Available for opportunities
              </p>
            </div>

            {/* Contact links */}
            <div className="space-y-3">
              {contactLinks.map((link) => {
                const content = (
                  <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground hover:text-primary transition-colors py-1">
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </span>
                )

                return link.href ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={link.label}>{content}</div>
                )
              })}
            </div>

            {/* Decorative connection SVG */}
            <div className="hidden lg:block pt-4">
              <svg
                viewBox="0 0 300 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-[280px] opacity-[0.08]"
              >
                {/* Network nodes */}
                <circle cx="30" cy="40" r="4" fill="hsl(var(--primary))" />
                <circle cx="90" cy="20" r="3" fill="hsl(var(--primary))" />
                <circle cx="150" cy="50" r="5" fill="hsl(var(--primary))" />
                <circle cx="210" cy="30" r="3" fill="hsl(var(--primary))" />
                <circle cx="270" cy="45" r="4" fill="hsl(var(--primary))" />
                <circle cx="60" cy="90" r="3" fill="hsl(var(--primary))" />
                <circle cx="130" cy="110" r="4" fill="hsl(var(--primary))" />
                <circle cx="200" cy="95" r="3" fill="hsl(var(--primary))" />
                <circle cx="250" cy="120" r="4" fill="hsl(var(--primary))" />
                <circle cx="100" cy="140" r="3" fill="hsl(var(--primary))" />
                <circle cx="180" cy="145" r="3" fill="hsl(var(--primary))" />
                {/* Connections */}
                <line x1="30" y1="40" x2="90" y2="20" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="90" y1="20" x2="150" y2="50" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="150" y1="50" x2="210" y2="30" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="210" y1="30" x2="270" y2="45" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="30" y1="40" x2="60" y2="90" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="90" y1="20" x2="130" y2="110" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="150" y1="50" x2="200" y2="95" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="210" y1="30" x2="250" y2="120" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="60" y1="90" x2="130" y2="110" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="130" y1="110" x2="200" y2="95" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="200" y1="95" x2="250" y2="120" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="60" y1="90" x2="100" y2="140" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="130" y1="110" x2="180" y2="145" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="150" y1="50" x2="130" y2="110" stroke="hsl(var(--primary))" strokeWidth="0.8" />
                <line x1="270" y1="45" x2="250" y2="120" stroke="hsl(var(--primary))" strokeWidth="0.8" />
              </svg>
            </div>
          </motion.div>

          {/* Right: Contact Form in card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="card-accent rounded-lg p-6 lg:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-mono text-muted-foreground">
                    name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="terminal-input w-full py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-mono text-muted-foreground">
                    email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="terminal-input w-full py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-mono text-muted-foreground">
                  subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  placeholder="What would you like to discuss?"
                  required
                  className="terminal-input w-full py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/40"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-mono text-muted-foreground">
                  message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project or just say hi..."
                  rows={4}
                  required
                  className="terminal-input w-full py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/40 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 px-8 text-sm font-mono transition-all duration-200 group w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
