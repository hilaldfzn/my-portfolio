"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, Code2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { ThemeToggle } from "../theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Detect active section
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100 // Offset for header
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id)
        }
      })
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "Experiences", href: "#experience", id: "experience" },
    { name: "Awards", href: "#awards", id: "awards" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Blogs", href: "#blog", id: "blog" },
    { name: "Contact", href: "#contact", id: "contact" },
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
          globalThis.dispatchEvent(event)
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
          <Link href="#home" className="flex items-center gap-2 group">
            <div
              className={`rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center transition-all duration-300 ${
                scrolled ? "w-10 h-10" : "w-9 h-9"
              }`}
            >
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold gradient-text hidden sm:block">
              Hilal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`relative text-foreground hover:text-primary transition-colors duration-200 font-medium px-3 py-2 rounded-2xl hover:bg-primary/5 ${
                    isActive ? "text-primary" : ""
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                </button>
              )
            })}
            <ThemeToggle />
          </div>

          {/* Mobile menu button & theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary rounded-2xl"
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
              {navItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`relative block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium w-full text-left rounded-2xl hover:bg-primary/5 ${
                      isActive ? "text-primary bg-primary/5" : ""
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"
                        layoutId="activeIndicatorMobile"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}