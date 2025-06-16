"use client"

import { motion } from "framer-motion"
import { useIntersectionObserver } from "../hooks/use-intersection-observer"
import type { ReactNode } from "react"

interface OptimizedSectionProps {
  id: string
  children: ReactNode
  className?: string
}

export function OptimizedSection({ id, children, className = "" }: OptimizedSectionProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px 0px -10% 0px",
    triggerOnce: true,
  })

  return (
    <motion.section
      ref={elementRef}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  )
}