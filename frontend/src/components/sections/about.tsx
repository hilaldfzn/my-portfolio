import { Card, CardContent } from "../ui/card"
import { Code, Palette, Zap, Rocket, Brain, Shield } from "lucide-react"

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
            I'm a passionate full-stack developer with over 5 years of experience building web applications.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 opacity-0 animate-[fadeInLeft_0.8s_ease-out_0.2s_forwards]">
            <div className="glass-effect p-8 rounded-2xl border border-white/10">
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

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0 animate-[fadeInRight_0.8s_ease-out_0.4s_forwards]">
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