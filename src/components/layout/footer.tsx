"use client"

import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
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
    { name: "Experiences", href: "#experiences" },
    { name: "Projects", href: "#projects" },
    { name: "Awards", href: "#awards" },
    { name: "Articles", href: "#articles" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link href="#home" className="inline-block group">
                <h3 className="text-2xl font-display text-foreground group-hover:text-primary transition-colors">
                  Hilal.
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                AI & Software Engineer Enthusiast crafting intelligent, scalable digital
                solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="section-label">
                {"// "}navigation
              </h4>
              <nav className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Connect Section */}
            <div className="space-y-4">
              <h4 className="section-label">
                {"// "}connect
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="w-9 h-9 rounded-md border border-border hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
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
          <p className="text-xs text-muted-foreground font-mono text-center sm:text-left">
            &copy; {currentYear} Muhammad Hilal Darul Fauzan
          </p>
        </div>
      </div>
    </footer>
  )
}
