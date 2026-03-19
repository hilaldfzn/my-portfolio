"use client"

import { motion, useScroll, useTransform } from "framer-motion"

export function ParallaxBackground() {
  const { scrollYProgress } = useScroll()

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500])
  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.06, 0.04, 0.05, 0.03])
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [0.04, 0.06, 0.03])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Large coral gradient orb - top right */}
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-primary blur-[150px]"
      />

      {/* Accent gradient orb - bottom left */}
      <motion.div
        style={{ y: y2, opacity: opacity2 }}
        className="absolute top-[50%] -left-64 w-[500px] h-[500px] rounded-full bg-accent blur-[130px]"
      />

      {/* Subtle SVG mesh overlay */}
      <motion.svg
        style={{ y: y1 }}
        className="absolute inset-0 w-full h-[200%] opacity-[0.015]"
        viewBox="0 0 1200 2400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <pattern id="mesh" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="60" cy="60" r="1.5" fill="hsl(var(--primary))" />
          <line x1="0" y1="60" x2="120" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.3" />
          <line x1="60" y1="0" x2="60" y2="120" stroke="hsl(var(--primary))" strokeWidth="0.3" />
        </pattern>
        <rect width="1200" height="2400" fill="url(#mesh)" />
      </motion.svg>
    </div>
  )
}
