"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollSection, setScrollSection] = useState("home")
  const pathname = usePathname()

  // On sub-pages, derive active from pathname; on home, use scroll-tracked section
  const activeSection = pathname !== "/" ? pathname.replace("/", "") : scrollSection

  // Track navbar background on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track active section via IntersectionObserver (only on home page)
  useEffect(() => {
    if (pathname !== "/") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setScrollSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [pathname])

  const navItems = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "Experiences", href: "#experiences", id: "experiences" },
    { name: "Awards", href: "#awards", id: "awards" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Articles", href: "#articles", id: "articles" },
    { name: "Contact", href: "#contact", id: "contact" },
  ]

  const scrollToSection = (href: string) => {
    if (pathname !== "/") {
      window.location.href = "/" + href
      return
    }
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsOpen(false)
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
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
          <Link href="#home" className="group">
            <span className="text-xl font-display text-foreground group-hover:text-primary transition-colors duration-200">
              Hilal.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`nav-underline text-sm font-mono px-3 py-2 transition-colors duration-200 ${
                    isActive ? "text-primary active" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </button>
              )
            })}
            <div className="ml-2 pl-2 border-l border-border">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button & theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            <div className="px-2 pt-2 pb-3 space-y-1 border border-border rounded-lg mt-2 bg-card">
              {navItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`block px-3 py-2 text-sm font-mono transition-colors duration-200 w-full text-left rounded-md ${
                      isActive ? "text-primary bg-primary/5 border-l-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.name}
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
