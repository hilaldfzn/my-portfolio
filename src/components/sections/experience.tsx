"use client"

import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Building, Calendar, MapPin, TrendingUp } from "lucide-react"
import { useState } from "react"

export default function Experience() {
  const [activeExperience, setActiveExperience] = useState(0)

  const experiences = [
    {
      title: "Senior Full Stack Developer",
      company: "CyberTech Solutions Inc.",
      location: "Neo Tokyo, Virtual",
      period: "2022 - Present",
      type: "Full-time",
      description:
        "Leading development of next-generation web applications using quantum computing principles and neural networks. Architected scalable microservices handling 10M+ requests daily with 99.99% uptime.",
      achievements: [
        "Increased system performance by 300% using quantum algorithms",
        "Led team of 8 developers in agile environment",
        "Implemented AI-driven code optimization reducing bugs by 85%",
        "Pioneered blockchain integration for secure data transactions",
      ],
      technologies: ["React", "Node.js", "Quantum.js", "AI/ML", "Blockchain"],
      color: "cyan",
    },
    {
      title: "Frontend Architect",
      company: "Neural Digital Agency",
      location: "Metaverse City",
      period: "2020 - 2022",
      type: "Full-time",
      description:
        "Architected immersive web experiences using AR/VR technologies and neural interfaces. Collaborated with AI systems to create adaptive user interfaces that learn from user behavior.",
      achievements: [
        "Developed AR-powered e-commerce platform with 40% conversion increase",
        "Created neural UI framework adopted by 50+ companies",
        "Optimized rendering performance for VR environments",
        "Mentored 12 junior developers in advanced frontend techniques",
      ],
      technologies: ["Vue.js", "WebXR", "Three.js", "Neural Networks", "WebGL"],
      color: "purple",
    },
    {
      title: "Quantum Web Developer",
      company: "StartUp Nexus",
      location: "Silicon Valley 2.0",
      period: "2019 - 2020",
      type: "Full-time",
      description:
        "Pioneered quantum web development practices and contributed to open-source quantum computing libraries. Built responsive applications with quantum-enhanced security protocols.",
      achievements: [
        "Developed first quantum-encrypted web application",
        "Contributed to 15+ open-source quantum libraries",
        "Reduced load times by 60% using quantum optimization",
        "Established quantum development best practices",
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "Quantum Computing", "Cryptography"],
      color: "pink",
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

  return (
    <section id="experience" className="py-20 relative">
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
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey through the evolution of technology and innovation.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Timeline Navigation */}
            <div className="lg:col-span-1 opacity-0 animate-[fadeInLeft_0.8s_ease-out_0.2s_forwards]">
              <div className="space-y-4 sticky top-24">
                {experiences.map((exp, index) => {
                  const colors = getColorClasses(exp.color, activeExperience === index)
                  return (
                    <Card
                      key={index}
                      className={`glass-effect border ${colors.border} ${colors.bg} hover:shadow-lg ${colors.glow} transition-all duration-300 cursor-pointer`}
                      onClick={() => setActiveExperience(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${colors.text.replace("text-", "bg-")} mt-2 flex-shrink-0`}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{exp.title}</h3>
                            <p className={`text-sm ${colors.text} font-medium`}>{exp.company}</p>
                            <p className="text-xs text-muted-foreground">{exp.period}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Experience Details */}
            <div className="lg:col-span-2 opacity-0 animate-[fadeInRight_0.8s_ease-out_0.4s_forwards]">
              <Card className="glass-effect border border-white/10 hover:border-white/20 transition-all duration-500">
                <CardContent className="p-8">
                  {experiences.map((exp, index) => {
                    const colors = getColorClasses(exp.color, true)
                    return (
                      <div
                        key={index}
                        className={`${activeExperience === index ? "block" : "hidden"} space-y-6 fade-in-up`}
                      >
                        {/* Header */}
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              className={`${colors.text.replace("text-", "bg-")}/10 ${colors.text} border-current`}
                            >
                              {exp.type}
                            </Badge>
                            <Badge variant="outline" className="border-white/20">
                              <Calendar className="w-3 h-3 mr-1" />
                              {exp.period}
                            </Badge>
                            <Badge variant="outline" className="border-white/20">
                              <MapPin className="w-3 h-3 mr-1" />
                              {exp.location}
                            </Badge>
                          </div>

                          <div>
                            <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
                            <div className="flex items-center space-x-2 mb-4">
                              <Building className={`w-5 h-5 ${colors.text}`} />
                              <span className={`text-lg font-semibold ${colors.text}`}>{exp.company}</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                          </div>
                        </div>

                        {/* Achievements */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4 flex items-center">
                            <TrendingUp className={`w-5 h-5 mr-2 ${colors.text}`} />
                            Key Achievements
                          </h4>
                          <ul className="space-y-3">
                            {exp.achievements.map((achievement, achievementIndex) => (
                              <li key={achievementIndex} className="flex items-start space-x-3">
                                <div
                                  className={`w-2 h-2 rounded-full ${colors.text.replace("text-", "bg-")} mt-2 flex-shrink-0`}
                                />
                                <span className="text-muted-foreground leading-relaxed">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Technologies Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="outline"
                                className={`${colors.text.replace("text-", "bg-")}/10 ${colors.text} border-current hover:scale-105 transition-transform`}
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}