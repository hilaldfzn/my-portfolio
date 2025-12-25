"use client"

import { motion } from "framer-motion"
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useToast } from "../../hooks/use-toast"

export function HeroSection() {
  const { toast } = useToast()

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
    <section id="home" className="relative min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 lg:space-y-10"
          >
            {/* Main Heading with gradient */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold tracking-tight">
                  <span className="text-foreground">Hi, I'm </span>
                  <span className="gradient-text">Hilal</span>
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-muted-foreground">
                  Full Stack Developer & AI Enthusiast
                </p>
              </div>

              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                I craft intelligent, scalable digital solutions with a passion for clean code and innovation.
                Currently pursuing Computer Science at{" "}
                <span className="text-foreground font-semibold">Universitas Indonesia</span>.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Let's Talk
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                onClick={handleDownloadCV}
                variant="outline"
                size="lg"
                className="border-2 border-border hover:border-primary/50 text-foreground hover:text-foreground rounded-full px-8 h-14 text-base font-semibold hover:bg-primary/10 transition-all duration-300 group"
              >
                <Download className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                Resume
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex gap-3">
                <a
                  href="https://github.com/hilaldfzn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-card/50 border border-border hover:border-primary/50 hover:bg-card flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a
                  href="https://linkedin.com/in/hilaldfzn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-card/50 border border-border hover:border-primary/50 hover:bg-card flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a
                  href="mailto:hilalfauzan9@gmail.com"
                  className="w-9 h-9 rounded-full bg-card/50 border border-border hover:border-primary/50 hover:bg-card flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Profile Image with Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="relative hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Decorative background shape */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/20 dark:from-primary/20 dark:via-accent/15 dark:to-primary/15 rounded-3xl rotate-6 opacity-60" />

              {/* Profile Image Container */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-4 border-background shadow-2xl">
                <img
                  src="/assets/me.png"
                  alt="Muhammad Hilal Darul Fauzan"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative accent elements */}
              <div className="absolute -bottom-4 -right-4 text-6xl opacity-70 text-primary">
                ✦
              </div>
              <div className="absolute -top-4 -left-4 text-5xl opacity-60 text-accent">
                ✧
              </div>
              <div className="absolute top-1/4 -right-6 text-4xl opacity-50 text-primary">
                ◆
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
