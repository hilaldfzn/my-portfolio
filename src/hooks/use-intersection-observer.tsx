"use client"

import { useEffect, useRef, useState } from "react"

interface UseIntersectionObserverProps {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = "0px 0px -10% 0px",
  triggerOnce = true,
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        setIsIntersecting(isVisible)

        if (isVisible && !hasTriggered) {
          setHasTriggered(true)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    const handleForceAnimate = (event: CustomEvent) => {
      if (event.detail.section === element && !hasTriggered) {
        setIsIntersecting(true)
        setHasTriggered(true)
      }
    }

    window.addEventListener("forceAnimate", handleForceAnimate as EventListener)

    return () => {
      observer.disconnect()
      window.removeEventListener("forceAnimate", handleForceAnimate as EventListener)
    }
  }, [threshold, rootMargin, hasTriggered])

  const shouldAnimate = triggerOnce ? hasTriggered : isIntersecting

  return { elementRef, isIntersecting: shouldAnimate }
}