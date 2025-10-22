"use client"

import { motion } from "framer-motion"
import { ArrowRight, Download, ChevronDown } from "lucide-react"
import { Button } from "../../components/ui/button"
import { lazy, Suspense } from "react"
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
      const cvUrl = "/assets/CV/CV_Muhammad Hilal Darul Fauzan.pdf"
      
      try {
        const response = await fetch(cvUrl, { method: 'HEAD' })
        if (!response.ok) {
          throw new Error(`File not found (${response.status})`)
        }
      } catch (fetchError) {
        console.warn("HEAD request failed, trying direct download:", fetchError)
      }

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        const newWindow = window.open(cvUrl, '_blank')
        if (newWindow) {
          toast({
            title: "CV Opened!",
            description: "CV opened in new tab. You can download it from there.",
          })
          return
        }
      }

      const link = document.createElement("a")
      link.href = cvUrl
      link.download = "CV_Muhammad Hilal Darul Fauzan.pdf"
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link)
        }
      }, 100)

      toast({
        title: "CV Downloaded!",
        description: "Thank you for your interest in my profile.",
      })

    } catch (error) {
      console.error("Download error:", error)
      
      try {
        window.open("/assets/CV/CV_Muhammad Hilal Darul Fauzan.pdf", '_blank', 'noopener,noreferrer')
        toast({
          title: "CV Opened!",
          description: "CV opened in new tab. Please download it manually if needed.",
        })
      } catch (fallbackError) {
        let errorMessage = "Unable to download CV automatically."
        
        if (error instanceof Error) {
          if (error.message.includes("File not found") || error.message.includes("404")) {
            errorMessage = "CV file not found. Please contact me directly for the latest version."
          } else if (error.message.includes("network") || error.message.includes("fetch")) {
            errorMessage = "Network error. Please check your connection and try again."
          }
        }

        toast({
          title: "Download Failed",
          description: errorMessage + " You can contact me directly for the CV.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <section id="home" className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 will-change-transform">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center justify-center">
        <div className="relative w-full max-w-screen-2xl mx-auto">
          {/* Left Animation */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <Suspense
              fallback={
                <div className="w-full h-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl animate-pulse" />
              }
            >
              <HeroAnimation />
            </Suspense>
          </motion.div>

          {/* Right Animation */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <Suspense
              fallback={
                <div className="w-full h-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl animate-pulse" />
              }
            >
              <HeroAnimation />
            </Suspense>
          </motion.div>

          {/* Center Content */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4 lg:px-32"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
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
              className="text-xl text-muted-foreground max-w-[600px] mx-auto mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Full stack developer passionate about creating intelligent, scalable, and innovative digital solutions.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 pt-8 justify-center"
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

          {/* Floating Code Snippets - Left and Right Alignment Only */}
          
          {/* Left Side - Snippet 1 */}
          <motion.div
            className="absolute left-4 top-16 hidden xl:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          >
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-4 font-mono text-sm shadow-lg transform rotate-[-3deg]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-blue-400">export async function <span className="text-green-400">POST(request) {"{"}</span></div>
              <div className="text-zinc-400 ml-4">return Response.json()</div>
              <div className="text-green-400">{"}"}</div>
            </div>
          </motion.div>

          {/* Left Side - Snippet 2 */}
          <motion.div
            className="absolute left-4 bottom-16 hidden xl:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
          >
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-4 font-mono text-sm shadow-lg transform rotate-[4deg]">
              <div className="text-purple-400">def <span className="text-cyan-400">create_solution():</span></div>
              <div className="text-zinc-400 ml-4">return "innovative"</div>
            </div>
          </motion.div>

          {/* Right Side - Snippet 3 */}
          <motion.div
            className="absolute right-4 top-16 hidden xl:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 2.4, ease: "easeOut" }}
          >
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-4 font-mono text-sm shadow-lg transform rotate-[2deg]">
              <div className="text-green-400">$ git add .</div>
              <div className="text-yellow-400">$ git commit -m <span className="text-blue-400">"feat: new feature"</span></div>
              <div className="text-purple-400">$ git push origin main</div>
            </div>
          </motion.div>

          {/* Right Side - Snippet 4 */}
          <motion.div
            className="absolute right-4 bottom-16 hidden xl:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 3.0, ease: "easeOut" }}
          >
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-4 font-mono text-sm shadow-lg transform rotate-[-5deg]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-green-400">const <span className="text-blue-400">developer</span> <span className="text-yellow-400">= "Hilal"</span></div>
            </div>
          </motion.div>

          {/* Decorative Connecting Lines */}
          <motion.div
            className="absolute left-72 top-1/3 w-20 h-px bg-gradient-to-r from-cyan-500/40 to-transparent hidden xl:block"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 3, ease: "easeOut" }}
          />
          
          <motion.div
            className="absolute right-72 bottom-1/3 w-20 h-px bg-gradient-to-l from-purple-500/40 to-transparent hidden xl:block"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 3.2, ease: "easeOut" }}
          />

          {/* Scroll Indicator - Hidden on Mobile */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
          >
            <span className="text-sm text-zinc-500">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-2 border border-zinc-700/50 rounded-full"
            >
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}