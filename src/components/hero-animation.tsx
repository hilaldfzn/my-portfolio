"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  update(): void
  draw(): void
}

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number>()
  const particlesArrayRef = useRef<Particle[]>([])

  const setCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const devicePixelRatio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * devicePixelRatio
    canvas.height = rect.height * devicePixelRatio

    ctx.scale(devicePixelRatio, devicePixelRatio)

    return { ctx, devicePixelRatio, rect }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const result = setCanvasDimensions()
    if (!result) return

    const { ctx, devicePixelRatio } = result

    class ParticleClass implements Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number

      constructor() {
        if (!canvas) {
          this.x = 0
          this.y = 0
        } else {
          this.x = (Math.random() * canvas.width) / devicePixelRatio
          this.y = (Math.random() * canvas.height) / devicePixelRatio
        }
        this.size = Math.random() * 3 + 1 // Reduced size range
        this.speedX = (Math.random() - 0.5) * 1.5 // Reduced speed
        this.speedY = (Math.random() - 0.5) * 1.5
        this.alpha = Math.random() * 0.5 + 0.3

        const hue = Math.random() * 60 + 200
        this.color = `hsla(${hue}, 70%, 60%, ${this.alpha})`
      }

      update() {
        if (!canvas) return

        this.x += this.speedX
        this.y += this.speedY

        const canvasWidth = canvas.width / devicePixelRatio
        const canvasHeight = canvas.height / devicePixelRatio

        if (this.x > canvasWidth || this.x < 0) this.speedX = -this.speedX
        if (this.y > canvasHeight || this.y < 0) this.speedY = -this.speedY
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Reduced particle count for better performance
    const particleCount = 25
    particlesArrayRef.current = []

    for (let i = 0; i < particleCount; i++) {
      particlesArrayRef.current.push(new ParticleClass())
    }

    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime < frameInterval) {
        animationIdRef.current = requestAnimationFrame(animate)
        return
      }

      lastTime = currentTime

      // Add null checks for canvas and ctx
      if (!canvas || !ctx) {
        animationIdRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Optimized connection drawing with distance limit
      const maxDistance = 80
      ctx.strokeStyle = "rgba(120, 180, 255, 0.1)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particlesArrayRef.current.length; i++) {
        const particleA = particlesArrayRef.current[i]
        particleA.update()
        particleA.draw()

        // Only check connections with nearby particles
        for (let j = i + 1; j < particlesArrayRef.current.length; j++) {
          const particleB = particlesArrayRef.current[j]
          const dx = particleA.x - particleB.x
          const dy = particleA.y - particleB.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(particleA.x, particleA.y)
            ctx.lineTo(particleB.x, particleB.y)
            ctx.stroke()
          }
        }
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animationIdRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      if (!canvas || typeof window === "undefined") return

      setCanvasDimensions()
      // Reinitialize particles on resize
      particlesArrayRef.current = []
      for (let i = 0; i < particleCount; i++) {
        particlesArrayRef.current.push(new ParticleClass())
      }
    }

    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize)
      }
      particlesArrayRef.current = []
    }
  }, [setCanvasDimensions])

  return (
    <motion.div
      className="w-full h-[400px] md:h-[500px] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
    </motion.div>
  )
}