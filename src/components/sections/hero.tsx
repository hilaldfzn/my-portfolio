"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { useRef } from "react"

export function HeroSection() {
  const { toast } = useToast()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const imageRotateY = useTransform(scrollYProgress, [0, 1], [0, 12])
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  const scrollToContact = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleDownloadCV = async () => {
    try {
      const cvUrl = "/assets/CV/CV_Muhammad Hilal Darul Fauzan.pdf"
      const link = document.createElement("a")
      link.href = cvUrl
      link.download = "CV_Muhammad Hilal Darul Fauzan.pdf"
      link.target = "_blank"
      link.rel = "noopener noreferrer"

      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        if (document.body.contains(link)) {
          link.remove()
        }
      }, 100)

      toast({
        title: "CV Downloaded!",
        description: "Thank you for your interest in my profile.",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "Please try again or contact me directly.",
        variant: "destructive",
      })
    }
  }

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* SVG Topology Mesh Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="w-full h-full opacity-[0.03]" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="3" className="fill-primary" />
          <circle cx="250" cy="80" r="2" className="fill-primary" />
          <circle cx="400" cy="150" r="3" className="fill-primary" />
          <circle cx="550" cy="90" r="2" className="fill-primary" />
          <circle cx="700" cy="130" r="3" className="fill-primary" />
          <circle cx="150" cy="250" r="2" className="fill-primary" />
          <circle cx="320" cy="300" r="3" className="fill-primary" />
          <circle cx="480" cy="280" r="2" className="fill-primary" />
          <circle cx="650" cy="320" r="3" className="fill-primary" />
          <circle cx="200" cy="450" r="2" className="fill-primary" />
          <circle cx="380" cy="480" r="3" className="fill-primary" />
          <circle cx="560" cy="440" r="2" className="fill-primary" />
          <circle cx="720" cy="500" r="3" className="fill-primary" />
          <line x1="100" y1="100" x2="250" y2="80" className="stroke-primary" strokeWidth="0.5" />
          <line x1="250" y1="80" x2="400" y2="150" className="stroke-primary" strokeWidth="0.5" />
          <line x1="400" y1="150" x2="550" y2="90" className="stroke-primary" strokeWidth="0.5" />
          <line x1="550" y1="90" x2="700" y2="130" className="stroke-primary" strokeWidth="0.5" />
          <line x1="100" y1="100" x2="150" y2="250" className="stroke-primary" strokeWidth="0.5" />
          <line x1="250" y1="80" x2="320" y2="300" className="stroke-primary" strokeWidth="0.5" />
          <line x1="400" y1="150" x2="480" y2="280" className="stroke-primary" strokeWidth="0.5" />
          <line x1="550" y1="90" x2="650" y2="320" className="stroke-primary" strokeWidth="0.5" />
          <line x1="150" y1="250" x2="320" y2="300" className="stroke-primary" strokeWidth="0.5" />
          <line x1="320" y1="300" x2="480" y2="280" className="stroke-primary" strokeWidth="0.5" />
          <line x1="480" y1="280" x2="650" y2="320" className="stroke-primary" strokeWidth="0.5" />
          <line x1="150" y1="250" x2="200" y2="450" className="stroke-primary" strokeWidth="0.5" />
          <line x1="320" y1="300" x2="380" y2="480" className="stroke-primary" strokeWidth="0.5" />
          <line x1="480" y1="280" x2="560" y2="440" className="stroke-primary" strokeWidth="0.5" />
          <line x1="650" y1="320" x2="720" y2="500" className="stroke-primary" strokeWidth="0.5" />
          <line x1="200" y1="450" x2="380" y2="480" className="stroke-primary" strokeWidth="0.5" />
          <line x1="380" y1="480" x2="560" y2="440" className="stroke-primary" strokeWidth="0.5" />
          <line x1="560" y1="440" x2="720" y2="500" className="stroke-primary" strokeWidth="0.5" />
          <line x1="700" y1="130" x2="650" y2="320" className="stroke-primary" strokeWidth="0.5" />
          <line x1="400" y1="150" x2="320" y2="300" className="stroke-primary" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto w-full text-center">
        {/* Profile Image with 3D parallax */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <div className="perspective-container">
            <motion.div
              style={{ rotateY: imageRotateY, scale: imageScale }}
              className="relative"
            >
              {/* Glow orb behind image */}
              <div className="absolute inset-0 w-36 h-36 rounded-full bg-primary/20 blur-2xl -z-10 m-auto" />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src="/assets/me.png"
                  alt="Muhammad Hilal Darul Fauzan"
                  className="w-32 h-32 rounded-full object-cover border-2 border-border shadow-xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Name + Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-3 mb-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display tracking-tight">
            <span className="text-foreground">Hi, I'm </span>
            <span className="text-primary">Hilal</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl font-mono text-muted-foreground font-normal">
            AI & Software Engineer Enthusiast
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto font-body mb-8"
        >
          I craft intelligent, scalable digital solutions with a passion for clean code and innovation.
          Currently pursuing Computer Science at{" "}
          <span className="text-foreground font-semibold">Universitas Indonesia</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <Button
            onClick={scrollToContact}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8 h-12 text-sm font-mono font-medium transition-all duration-300"
          >
            Get in touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            onClick={handleDownloadCV}
            variant="outline"
            size="lg"
            className="border border-border hover:border-primary/50 text-foreground rounded-md px-8 h-12 text-sm font-mono font-medium hover:bg-primary/5 transition-all duration-300 group"
          >
            <Download className="mr-2 h-4 w-4" />
            Resume
          </Button>
        </motion.div>

        {/* Social Links + Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex items-center justify-center gap-6"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <MapPin className="w-3.5 h-3.5" />
            <span>Jakarta Pusat, Jakarta, Indonesia</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex gap-3">
            <a
              href="https://github.com/hilaldfzn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-md border border-border hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://linkedin.com/in/hilaldfzn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-md border border-border hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="mailto:hilalfauzan9@gmail.com"
              className="w-9 h-9 rounded-md border border-border hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
              aria-label="Email"
            >
              <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
