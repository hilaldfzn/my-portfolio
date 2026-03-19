"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"

export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [supportsHover, setSupportsHover] = useState(false)
  const rafRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })

  const updateMousePosition = useCallback(() => {
    setMousePosition({ x: mouseRef.current.x, y: mouseRef.current.y })
  }, [])

  useEffect(() => {
    const checkSupportsHover = () => {
      setSupportsHover(window.matchMedia("(hover: hover)").matches)
    }

    checkSupportsHover()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setIsVisible(true)

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(updateMousePosition)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }

    if (supportsHover) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
      document.body.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove)
        document.body.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [updateMousePosition, supportsHover])

  if (typeof window === "undefined" || !supportsHover) {
    return null
  }

  return (
    <motion.div
      className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-50"
      animate={{
        x: mousePosition.x - 4,
        y: mousePosition.y - 4,
        opacity: isVisible ? 0.6 : 0,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 400, mass: 0.3 }}
      style={{ willChange: "transform, opacity" }}
    />
  )
}
