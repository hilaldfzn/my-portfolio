"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "../../components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Blog", href: "#blog" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      // Trigger animations for all sections between current and target
      const allSections = document.querySelectorAll("section[id]")
      const targetIndex = Array.from(allSections).findIndex((section) => `#${section.id}` === href)
      const currentSection = Array.from(allSections).find((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })
      const currentIndex = currentSection ? Array.from(allSections).indexOf(currentSection) : 0

      // Trigger animations for skipped sections
      const start = Math.min(currentIndex, targetIndex)
      const end = Math.max(currentIndex, targetIndex)

      for (let i = start; i <= end; i++) {
        const section = allSections[i]
        if (section) {
          // Trigger intersection observer manually for skipped sections
          const event = new CustomEvent("forceAnimate", { detail: { section } })
          window.dispatchEvent(event)
        }
      }

      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsOpen(false)
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? "py-2" : "py-0"}`}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="#home" className="flex items-center">
            <div
              className={`rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-white text-xl transition-all duration-300 ${
                scrolled ? "w-12 h-12" : "w-10 h-10"
              }`}
            >
              H
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-cyan-400 transition-colors duration-200 font-medium px-3 py-2 rounded-2xl hover:bg-white/5"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-cyan-400 rounded-2xl"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 glass-effect rounded-2xl mt-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block px-3 py-2 text-foreground hover:text-cyan-400 transition-colors duration-200 font-medium w-full text-left rounded-2xl hover:bg-white/5"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}