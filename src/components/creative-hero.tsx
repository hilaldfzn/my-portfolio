"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"

interface Particle {
  x: number
  y: number
  size: number
  baseX: number
  baseY: number
  density: number
  color: string
  distance: number
  update(): void
  draw(): void
}

export function CreativeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number>()
  const particlesArrayRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const isVisibleRef = useRef(true)

  const throttle = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    let lastExecTime = 0
    return function (this: any, ...args: any[]) {
      const currentTime = Date.now()

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args)
        lastExecTime = currentTime
      } else {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(
          () => {
            func.apply(this, args)
            lastExecTime = Date.now()
          },
          delay - (currentTime - lastExecTime),
        )
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const devicePixelRatio = window.devicePixelRatio || 1

    const setCanvasDimensions = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()

    // Optimized mouse tracking
    const handleMouseMove = throttle((e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.targetX = e.clientX - rect.left
      mouseRef.current.targetY = e.clientY - rect.top
    }, 16) // ~60fps throttling

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting
      },
      { threshold: 0.1 },
    )

    observer.observe(canvas)

    class ParticleClass implements Particle {
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number
      color: string
      distance: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        this.size = Math.random() * 3 + 1.5 // Reduced size
        this.density = Math.random() * 20 + 5 // Reduced density
        this.distance = 0

        const hue = Math.random() * 60 + 180
        this.color = `hsl(${hue}, 70%, 60%)`
      }

      update() {
        const dx = mouseRef.current.x - this.x
        const dy = mouseRef.current.y - this.y
        this.distance = Math.sqrt(dx * dx + dy * dy)

        const maxDistance = 80 // Reduced interaction distance

        if (this.distance < maxDistance) {
          const forceDirectionX = dx / this.distance
          const forceDirectionY = dy / this.distance
          const force = (maxDistance - this.distance) / maxDistance

          const directionX = forceDirectionX * force * this.density * 0.5
          const directionY = forceDirectionY * force * this.density * 0.5

          this.x -= directionX
          this.y -= directionY
        } else {
          // Smooth return to base position
          this.x += (this.baseX - this.x) * 0.05
          this.y += (this.baseY - this.y) * 0.05
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      particlesArrayRef.current = []
      const canvasWidth = canvas.width / devicePixelRatio
      const canvasHeight = canvas.height / devicePixelRatio

      // Reduced grid size for better performance
      const gridSize = 40
      const numX = Math.floor(canvasWidth / gridSize)
      const numY = Math.floor(canvasHeight / gridSize)

      for (let y = 0; y < numY; y++) {
        for (let x = 0; x < numX; x++) {
          const posX = x * gridSize + gridSize / 2
          const posY = y * gridSize + gridSize / 2
          particlesArrayRef.current.push(new ParticleClass(posX, posY))
        }
      }
    }

    init()

    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (!isVisibleRef.current) {
        animationIdRef.current = requestAnimationFrame(animate)
        return
      }

      if (currentTime - lastTime < frameInterval) {
        animationIdRef.current = requestAnimationFrame(animate)
        return
      }

      lastTime = currentTime

      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Smooth mouse following
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08

      // Update and draw particles
      for (let i = 0; i < particlesArrayRef.current.length; i++) {
        particlesArrayRef.current[i].update()
        particlesArrayRef.current[i].draw()
      }

      // Optimized connection drawing
      ctx.strokeStyle = "rgba(0, 255, 255, 0.15)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particlesArrayRef.current.length; i++) {
        for (let j = i + 1; j < particlesArrayRef.current.length; j++) {
          const dx = particlesArrayRef.current[i].x - particlesArrayRef.current[j].x
          const dy = particlesArrayRef.current[i].y - particlesArrayRef.current[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 25) {
            // Reduced connection distance
            ctx.beginPath()
            ctx.moveTo(particlesArrayRef.current[i].x, particlesArrayRef.current[i].y)
            ctx.lineTo(particlesArrayRef.current[j].x, particlesArrayRef.current[j].y)
            ctx.stroke()
          }
        }
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animationIdRef.current = requestAnimationFrame(animate)

    const handleResize = throttle(() => {
      setCanvasDimensions()
      init()
    }, 250)

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      observer.disconnect()
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("resize", handleResize)
      }
      particlesArrayRef.current = []
    }
  }, [throttle])

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