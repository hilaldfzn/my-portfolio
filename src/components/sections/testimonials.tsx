"use client"

import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Star, Quote, User, Building, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useState } from "react"

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechFlow Solutions",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5,
      date: "2024-01-15",
      testimonial:
        "Hilal's expertise in full-stack development transformed our project completely. His attention to detail and ability to implement complex AI features while maintaining clean, scalable code is exceptional. The MAAMS project he delivered exceeded all our expectations.",
      project: "MAAMS - AI Root Cause Analysis",
      tags: ["AI/ML", "Django", "Problem Solving"],
      color: "cyan",
    },
    {
      id: 2,
      name: "Dr. Ahmad Rahman",
      role: "Research Supervisor",
      company: "University of Indonesia",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      rating: 5,
      date: "2024-02-20",
      testimonial:
        "Working with Hilal on the Natural Language Inference project was remarkable. His deep understanding of machine learning concepts and ability to implement complex models from scratch using PyTorch demonstrated exceptional technical skills and research capabilities.",
      project: "Natural Language Inference Research",
      tags: ["Research", "PyTorch", "NLP"],
      color: "purple",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      role: "Team Lead",
      company: "Digital Innovation Lab",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      rating: 5,
      date: "2023-11-10",
      testimonial:
        "Hilal's contribution to our Lembarpena project was outstanding. Not only did he deliver a feature-rich web application, but his code quality and collaborative approach made him a pleasure to work with. The project won the Best Web Application Award!",
      project: "Lembarpena - Literary Community Platform",
      tags: ["Web Development", "Team Collaboration", "Award Winner"],
      color: "pink",
    },
    {
      id: 4,
      name: "Kevin Tanaka",
      role: "Senior Developer",
      company: "CodeCraft Studios",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
      rating: 5,
      date: "2024-03-05",
      testimonial:
        "Hilal's knowledge of modern development practices is impressive. His implementation of SOLID principles and TDD methodology in our authentication system not only improved code quality but also made the entire codebase more maintainable and scalable.",
      project: "Authentication System Refactoring",
      tags: ["SOLID Principles", "TDD", "Code Quality"],
      color: "cyan",
    },
  ]

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = {
      cyan: {
        border: isActive ? "border-cyan-400" : "border-cyan-400/30",
        bg: isActive ? "bg-cyan-400/10" : "bg-transparent",
        text: "text-cyan-400",
        glow: isActive ? "shadow-cyan-400/25" : "",
      },
      purple: {
        border: isActive ? "border-purple-400" : "border-purple-400/30",
        bg: isActive ? "bg-purple-400/10" : "bg-transparent",
        text: "text-purple-400",
        glow: isActive ? "shadow-purple-400/25" : "",
      },
      pink: {
        border: isActive ? "border-pink-400" : "border-pink-400/30",
        bg: isActive ? "bg-pink-400/10" : "bg-transparent",
        text: "text-pink-400",
        glow: isActive ? "shadow-pink-400/25" : "",
      },
    }
    return baseClasses[color as keyof typeof baseClasses] || baseClasses.cyan
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <section id="testimonials" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What clients, colleagues, and collaborators say about working with me.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Testimonial Navigation */}
            <div className="lg:col-span-1 opacity-0 animate-[fadeInLeft_0.8s_ease-out_0.2s_forwards]">
              <div className="space-y-4 sticky top-24">
                {testimonials.map((testimonial, index) => {
                  const colors = getColorClasses(testimonial.color, activeTestimonial === index)
                  return (
                    <Card
                      key={index}
                      className={`glass-effect border ${colors.border} ${colors.bg} hover:shadow-lg ${colors.glow} transition-all duration-300 cursor-pointer`}
                      onClick={() => setActiveTestimonial(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                            <AvatarFallback>
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{testimonial.name}</h3>
                            <p className={`text-xs ${colors.text} font-medium`}>{testimonial.role}</p>
                            <p className="text-xs text-muted-foreground truncate">{testimonial.company}</p>
                            <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Testimonial Details */}
            <div className="lg:col-span-2 opacity-0 animate-[fadeInRight_0.8s_ease-out_0.4s_forwards]">
              <Card className="glass-effect border border-white/10 hover:border-white/20 transition-all duration-500">
                <CardContent className="p-8">
                  {testimonials.map((testimonial, index) => {
                    const colors = getColorClasses(testimonial.color, true)
                    return (
                      <div
                        key={index}
                        className={`${activeTestimonial === index ? "block" : "hidden"} space-y-6 fade-in-up`}
                      >
                        {/* Header */}
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                            <AvatarFallback className="text-lg">
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold">{testimonial.name}</h3>
                                <div className="flex items-center space-x-2 text-sm">
                                  <User className={`w-4 h-4 ${colors.text}`} />
                                  <span className={`font-semibold ${colors.text}`}>{testimonial.role}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Building className="w-4 h-4" />
                                  <span>{testimonial.company}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex mb-1">{renderStars(testimonial.rating)}</div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(testimonial.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Quote className={`w-4 h-4 mr-2 ${colors.text}`} />
                            Project: {testimonial.project}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {testimonial.tags.map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className={`${colors.text.replace("text-", "bg-")}/10 ${colors.text} border-current text-xs`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Testimonial Content */}
                        <div className="relative">
                          <Quote className={`w-8 h-8 ${colors.text} opacity-50 absolute -top-2 -left-2`} />
                          <blockquote className="text-lg leading-relaxed pl-6 italic">
                            "{testimonial.testimonial}"
                          </blockquote>
                        </div>

                        {/* Call to Action */}
                        <div className="border-t border-white/10 pt-6">
                          <p className="text-sm text-muted-foreground text-center">
                            Want to work together?{" "}
                            <a href="#contact" className={`${colors.text} hover:underline font-medium`}>
                              Let's discuss your project
                            </a>
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
          {[
            { number: "50+", label: "Projects Completed", color: "cyan" },
            { number: "25+", label: "Happy Clients", color: "purple" },
            { number: "5★", label: "Average Rating", color: "pink" },
            { number: "3+", label: "Years Experience", color: "cyan" },
          ].map((stat, index) => {
            const colors = getColorClasses(stat.color, true)
            return (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${colors.text} mb-2`}>{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}