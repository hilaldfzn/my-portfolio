import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Code, Palette, Zap, Rocket, Brain, Shield, GraduationCap, Building, Calendar, MapPin, Award } from "lucide-react"

export default function About() {
  const highlights = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code following best practices.",
      color: "cyan",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Creating intuitive and beautiful user interfaces with attention to detail.",
      color: "purple",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Optimizing applications for speed, accessibility, and user experience.",
      color: "pink",
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Embracing cutting-edge technologies and modern development practices.",
      color: "cyan",
    },
    {
      icon: Brain,
      title: "Problem Solving",
      description: "Analytical thinking and creative solutions for complex challenges.",
      color: "purple",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Implementing robust security measures and best practices.",
      color: "pink",
    },
  ]

  const education = [
    {
      degree: "Computer Science",
      institution: "Universitas Indonesia",
      period: "2021 - 2025",
      location: "Depok, Indonesia",
      description: "Specialized in Software Engineering and Data Science with focus on web development, machine learning, and database systems.",
      achievements: [
        "Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering",
        "Active in programming competitions and hackathons",
        "Member of Computer Science Student Association"
      ],
      color: "cyan"
    }
  ]

  const experience = [
    {
      title: "Frontend Developer",
      company: "OKK UI 2024",
      period: "June - August 2024",
      location: "Remote",
      type: "Part-time",
      description: "Developing web applications using modern technologies including Django, React, and Next.js for various clients.",
      achievements: [
        "Built 8+ full-stack web applications with modern frameworks",
        "Implemented AI-powered features using machine learning models",
        "Collaborated with cross-functional teams in agile environments",
        "Maintained 99% client satisfaction rate"
      ],
      technologies: ["Django", "React", "Next.js", "Python", "TypeScript"],
      color: "purple"
    },
    {
      title: "Editorial Marketing",
      company: "COMPFEST 15",
      period: "May 2023 - August 2023",
      location: "Jakarta, Indonesia",
      type: "Internship",
      description: "Contributed to large-scale event management systems and gained experience in team collaboration and project management.",
      achievements: [
        "Developed features for event registration system",
        "Optimized database queries improving performance by 40%",
        "Mentored junior developers in coding best practices",
        "Led a team of 5 developers in academy program"
      ],
      technologies: ["Django", "PostgreSQL", "JavaScript", "Bootstrap"],
      color: "pink"
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case "cyan":
        return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30"
      case "purple":
        return "text-purple-400 bg-purple-400/10 border-purple-400/30"
      case "pink":
        return "text-pink-400 bg-pink-400/10 border-pink-400/30"
      default:
        return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30"
    }
  }

  return (
    <section id="about" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I am passionate about uncovering actionable insights from data, building scalable software systems, and driving progress in industries through the integration of analytical thinking and technical expertise.
          </p>
        </div>

        {/* Personal Introduction */}
        <div className="mb-16 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
          <div className="glass-effect p-8 rounded-2xl border border-white/10 max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed mb-6">
              I specialize in creating modern, responsive web applications using cutting-edge technologies. My journey
              in web development started with a curiosity about how things work on the internet, and it has evolved
              into a passion for crafting digital experiences that make a difference.
            </p>
            <p className="text-lg leading-relaxed">
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects,
              or sharing knowledge with the developer community. I believe in continuous learning and staying
              up-to-date with the latest industry trends.
            </p>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-16 opacity-0 animate-[fadeInLeft_0.8s_ease-out_0.4s_forwards]">
          <h3 className="text-2xl font-bold mb-8 flex items-center">
            <GraduationCap className="mr-3 h-6 w-6 text-cyan-400" />
            Education
          </h3>
          <div className="space-y-6">
            {education.map((edu, index) => {
              const colors = getColorClasses(edu.color)
              return (
                <Card key={index} className="glass-effect border border-white/10 hover:border-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-2">{edu.degree}</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <Building className={`w-5 h-5 text-cyan-400`} />
                          <span className="text-lg font-medium text-cyan-400">{edu.institution}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {edu.period}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {edu.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">{edu.description}</p>
                    
                    <div className="space-y-2">
                      <h5 className="font-semibold flex items-center">
                        <Award className="w-4 h-4 mr-2 text-cyan-400" />
                        Key Highlights
                      </h5>
                      <ul className="space-y-2">
                        {edu.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-16 opacity-0 animate-[fadeInRight_0.8s_ease-out_0.6s_forwards]">
          <h3 className="text-2xl font-bold mb-8 flex items-center">
            <Building className="mr-3 h-6 w-6 text-purple-400" />
            Experience
          </h3>
          <div className="space-y-6">
            {experience.map((exp, index) => {
              const colors = getColorClasses(exp.color)
              return (
                <Card key={index} className="glass-effect border border-white/10 hover:border-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={`${exp.color === 'purple' ? 'bg-purple-400/10 text-purple-400 border-purple-400/30' : exp.color === 'pink' ? 'bg-pink-400/10 text-pink-400 border-pink-400/30' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30'} border`}>
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
                        <h4 className="text-xl font-semibold mb-2">{exp.title}</h4>
                        <div className="flex items-center space-x-2 mb-4">
                          <Building className={`w-5 h-5 ${exp.color === 'purple' ? 'text-purple-400' : exp.color === 'pink' ? 'text-pink-400' : 'text-cyan-400'}`} />
                          <span className={`text-lg font-medium ${exp.color === 'purple' ? 'text-purple-400' : exp.color === 'pink' ? 'text-pink-400' : 'text-cyan-400'}`}>{exp.company}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-3 flex items-center">
                          <Award className={`w-4 h-4 mr-2 ${exp.color === 'purple' ? 'text-purple-400' : exp.color === 'pink' ? 'text-pink-400' : 'text-cyan-400'}`} />
                          Key Achievements
                        </h5>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${exp.color === 'purple' ? 'bg-purple-400' : exp.color === 'pink' ? 'bg-pink-400' : 'bg-cyan-400'}`} />
                              <span className="text-muted-foreground leading-relaxed">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold mb-3">Technologies Used</h5>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <Badge
                              key={techIndex}
                              variant="outline"
                              className={`${exp.color === 'purple' ? 'bg-purple-400/10 text-purple-400 border-purple-400/30' : exp.color === 'pink' ? 'bg-pink-400/10 text-pink-400 border-pink-400/30' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30'} hover:scale-105 transition-transform`}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
          <h3 className="text-2xl font-bold mb-8 flex items-center">
            <Zap className="mr-3 h-6 w-6 text-pink-400" />
            Core Strengths
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <Card
                key={index}
                className="glass-effect border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl border ${getColorClasses(item.color)} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 text-foreground group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}