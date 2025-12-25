"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, ArrowUp, Heart } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/hilaldfzn",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/mhilaldfzn",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: "mailto:hilalfauzan9@gmail.com",
      icon: Mail,
    },
  ]

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Awards", href: "#awards" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link href="#home" className="inline-block group">
                <h3 className="text-2xl font-heading font-bold gradient-text">
                  Muhammad Hilal Darul Fauzan
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Full Stack Developer & AI Enthusiast crafting intelligent, scalable digital
                solutions with passion for innovation.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-heading font-semibold text-foreground uppercase tracking-wider">
                Quick Links
              </h4>
              <nav className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Connect Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-heading font-semibold text-foreground uppercase tracking-wider">
                Connect
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="w-10 h-10 rounded-full bg-secondary hover:bg-primary/10 border border-border hover:border-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {currentYear} Muhammad Hilal Darul Fauzan
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}