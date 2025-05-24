"use client"

import { Button } from "../ui/button"
import { Zap, Code, Cpu } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute opacity-20 ${
              i % 3 === 0 ? "text-cyan-400" : i % 3 === 1 ? "text-purple-500" : "text-pink-400"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          >
            {i % 4 === 0 ? (
              <Zap className={`w-6 h-6 ${i % 2 === 0 ? "float-animation" : "float-reverse"}`} />
            ) : i % 4 === 1 ? (
              <Code className={`w-8 h-8 ${i % 2 === 0 ? "float-animation" : "float-reverse"}`} />
            ) : i % 4 === 2 ? (
              <Cpu className={`w-7 h-7 ${i % 2 === 0 ? "float-animation" : "float-reverse"}`} />
            ) : (
              <div className={`w-4 h-4 bg-current rounded-full ${i % 2 === 0 ? "float-animation" : "float-reverse"}`} />
            )}
          </div>
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 cyber-grid opacity-30" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8">
          {/* Profile Image with futuristic frame */}

          {/* Main Content */}
          <div className="space-y-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Hi, I am{" "}
                <span className="gradient-text relative">
                  Hilal
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
                </span>
              </h1>
              <div className="relative">
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Full Stack Developer passionate about creating{" "}
                  <span className="text-cyan-400 font-semibold">intelligent</span>,{" "}
                  <span className="text-purple-400 font-semibold">scalable</span>, and{" "}
                  <span className="text-pink-400 font-semibold">innovative</span> digital solutions.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="cyber-button bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 border-0 text-white shadow-lg hover:shadow-cyan-500/25"
                asChild
              >
                <Link href="#contact">
                  Get In Touch
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="cyber-button border-purple-500/50 hover:border-purple-400"
                asChild
              >
                <Link href="/resume.pdf" target="_blank">
                  Download CV
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}