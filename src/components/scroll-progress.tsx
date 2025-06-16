"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return
    setIsVisible(window.scrollY > 100)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    return () => window.removeEventListener("scroll", throttledHandleScroll)
  }, [handleScroll])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 origin-left z-50"
      style={{
        scaleX,
        opacity: isVisible ? 1 : 0,
        willChange: "transform, opacity",
      }}
      transition={{ opacity: { duration: 0.3 } }}
    />
  )
}