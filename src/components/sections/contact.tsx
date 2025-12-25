"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Linkedin, Send, Github } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
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

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "hilalfauzan9@gmail.com",
      href: "mailto:hilalfauzan9@gmail.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Muhammad Hilal Darul Fauzan",
      href: "https://linkedin.com/in/mhilaldfzn",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@hilaldfzn",
      href: "https://github.com/hilaldfzn",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Jakarta, Indonesia",
      href: null,
    },
  ]

  return (
    <section id="contact" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Get In Touch" subtitle="Let's create something amazing together" />

          {/* Two Column Layout: Contact Cards Left, Form Right */}
          <div className="grid lg:grid-cols-[1fr,1.3fr] gap-8 lg:gap-12">
            {/* Left: Contact Information + Status */}
            <div className="flex flex-col space-y-6">
              {/* Contact Information Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Contact Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred way to reach out
                  </p>
                </div>

                {/* Contact Cards - Stacked Vertically */}
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={method.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    >
                      {method.href ? (
                        <a
                          href={method.href}
                          target={method.href.startsWith("http") ? "_blank" : undefined}
                          rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-4 bg-card/50 backdrop-blur-sm border-2 border-border rounded-2xl p-5 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                            <method.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                              {method.label}
                            </div>
                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {method.value}
                            </div>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-sm border-2 border-border rounded-2xl p-5">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                            <method.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                              {method.label}
                            </div>
                            <div className="text-sm font-medium text-foreground">
                              {method.value}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Current Status Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gradient-to-br from-card to-card/50 border-2 border-border rounded-2xl p-6"
              >
                <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                  Current Status
                </h3>
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Available for internship and full-time opportunities
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-card to-card/50 border-2 border-border rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur-sm"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Send Me a Message
                </h3>
                <p className="text-sm text-muted-foreground">
                  I'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-foreground">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="h-12 rounded-xl border-2 border-border bg-background/50 focus:border-primary focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="h-12 rounded-xl border-2 border-border bg-background/50 focus:border-primary focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-semibold text-foreground">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What would you like to discuss?"
                    required
                    className="h-12 rounded-xl border-2 border-border bg-background/50 focus:border-primary focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-foreground">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project, ideas, or just say hi..."
                    rows={4}
                    required
                    className="rounded-xl border-2 border-border bg-background/50 focus:border-primary focus:ring-primary/20 resize-none transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-rotate-12" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}