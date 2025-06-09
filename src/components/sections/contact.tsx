"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Mail, MapPin, Phone, Send, Zap, MessageCircle, Globe } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission with futuristic delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Message transmitted successfully! 🚀",
      description: "Your message has been sent through the quantum network. I'll respond within 24 hours.",
    })

    setIsSubmitting(false)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hilalfauzan9@gmail.com",
      href: "mailto:hilalfauzan9@gmail.com",
      color: "cyan",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Jakarta Pusat, DKI Jakarta",
      href: "#",
      color: "pink",
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case "cyan":
        return {
          icon: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
          text: "text-cyan-400",
          hover: "hover:text-cyan-300",
        }
      case "purple":
        return {
          icon: "text-purple-400 bg-purple-400/10 border-purple-400/30",
          text: "text-purple-400",
          hover: "hover:text-purple-300",
        }
      case "pink":
        return {
          icon: "text-pink-400 bg-pink-400/10 border-pink-400/30",
          text: "text-pink-400",
          hover: "hover:text-pink-300",
        }
      default:
        return {
          icon: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
          text: "text-cyan-400",
          hover: "hover:text-cyan-300",
        }
    }
  }

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="cyber-grid opacity-20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to collaborate on the next breakthrough? Let's connect through the quantum network.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 opacity-0 animate-[fadeInLeft_0.8s_ease-out_0.2s_forwards]">
            <div className="glass-effect p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <MessageCircle className="mr-3 h-6 w-6 text-cyan-400" />
                Let's Build the Future Together
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always excited to work on innovative projects that push the boundaries of technology. Whether you
                have a revolutionary idea or need expertise in cutting-edge development, let's create something
                extraordinary.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const colors = getColorClasses(item.color)
                  return (
                    <div key={index} className="group">
                      <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                        <div
                          className={`p-3 rounded-xl border ${colors.icon} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <item.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <a
                            href={item.href}
                            className={`${colors.text} ${colors.hover} transition-colors font-medium`}
                          >
                            {item.value}
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="opacity-0 animate-[fadeInRight_0.8s_ease-out_0.4s_forwards]">
            <Card className="glass-effect border border-white/10 hover:border-white/20 transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Zap className="mr-3 h-6 w-6 text-cyan-400" />
                  Send Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="glass-effect border-white/20 focus:border-cyan-400 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="glass-effect border-white/20 focus:border-cyan-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="glass-effect border-white/20 focus:border-cyan-400 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="glass-effect border-white/20 focus:border-cyan-400 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message Data
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="glass-effect border-white/20 focus:border-cyan-400 transition-colors resize-none"
                      placeholder="Describe your project, ideas, or how we can collaborate..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cyber-button bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 border-0 text-white shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}