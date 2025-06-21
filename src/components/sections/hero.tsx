"use client"

import { motion } from "framer-motion"
import { ArrowRight, Download } from "lucide-react"
import { Button } from "../../components/ui/button"
import { lazy, Suspense } from "react"
import { downloadCV } from "../../app/actions"
import { useToast } from "../../hooks/use-toast"

const HeroAnimation = lazy(() => import("../hero-animation").then((module) => ({ default: module.HeroAnimation })))

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
      const result = await downloadCV()
      if (result.success) {
        const link = document.createElement("a")
        link.href = result.url
        link.download = "Muhammad Hilal Darul Fauzan_CV.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "CV Downloaded!",
          description: "Thank you for your interest in my profile.",
        })
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 will-change-transform">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <span className="block">Hi, I am</span>
              <span className="gradient-text">Muhammad Hilal</span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-[600px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Full stack developer passionate about creating intelligent, scalable, and innovative digital solutions.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <Button onClick={scrollToContact} className="cyber-button group rounded-2xl">
                <span className="relative z-10 flex items-center">
                  Get In Touch <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                onClick={handleDownloadCV}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Suspense
              fallback={
                <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl animate-pulse" />
              }
            >
              <HeroAnimation />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  )
}