import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/ui/theme-provider"
import { Toaster } from "../components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Portfolio | Muhammad Hilal Darul Fauzan",
  description:
    "Full Stack Developer passionate about creating intelligent, scalable, and innovative digital solutions. Specializing in AI/ML, web development, and modern technologies.",
  keywords: "Full Stack Developer, AI/ML, Web Development, React, Next.js, Python, Django, Portfolio",
  authors: [{ name: "Muhammad Hilal Darul Fauzan" }],
  creator: "Muhammad Hilal Darul Fauzan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hilaldfzn.vercel.app",
    title: "Muhammad Hilal | Full Stack Developer",
    description:
      "Full Stack Developer passionate about creating intelligent, scalable, and innovative digital solutions.",
    siteName: "Muhammad Hilal Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hilal | Full Stack Developer",
    description:
      "Full Stack Developer passionate about creating intelligent, scalable, and innovative digital solutions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/me.png" as="image" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}