"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, Heart, Code, Cpu, Globe } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: "https://github.com/hilaldfzn", label: "GitHub", color: "cyan" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/muhammad-hilal-darul-fauzan-ba8971243/", label: "LinkedIn", color: "purple" },
    { icon: Mail, href: "mailto:hilalfauzan9@gmail.com", label: "Email", color: "pink" },
  ]

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case "cyan":
        return "text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 border-cyan-400/30"
      case "purple":
        return "text-purple-400 hover:text-purple-300 bg-purple-400/10 border-purple-400/30"
      case "pink":
        return "text-pink-400 hover:text-pink-300 bg-pink-400/10 border-pink-400/30"
      default:
        return "text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 border-cyan-400/30"
    }
  }

  return (
    <footer className="relative bg-background border-t border-white/10 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
        <div className="cyber-grid opacity-10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="text-2xl font-bold gradient-text">H</div>
                <div className="absolute inset-0 bg-cyan-400/20 blur-xl" />
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-md">
              Building the future of web development with cutting-edge technologies and innovative solutions.
              Transforming ideas into digital realities.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label, color }) => {
                const colorClasses = getColorClasses(color)
                return (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    className={`relative group cyber-button border ${colorClasses}`}
                    asChild
                  >
                    <Link href={href} target="_blank">
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-current/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                      <span className="sr-only">{label}</span>
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold flex items-center">
              <Cpu className="w-4 h-4 mr-2 text-purple-400" />
              Navigation
            </h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 transform duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-semibold flex items-center">
              <Mail className="w-4 h-4 mr-2 text-pink-400" />
              Connect
            </h4>
            <div className="space-y-3 text-muted-foreground">
              <p className="hover:text-cyan-400 transition-colors cursor-pointer">hilalfauzan9@gmail.com</p>
              <p className="hover:text-pink-400 transition-colors cursor-pointer">Jakarta Pusat, DKI Jakarta</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>© {currentYear} Muhammad Hilal Darul Fauzan.</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}