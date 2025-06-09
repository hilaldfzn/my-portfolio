import Header from "../components/layout/header"
import Hero from "../components/sections/hero"
import About from "../components/sections/about"
import Skills from "../components/sections/skills"
import Projects from "../components/sections/projects"
import Blog from "../components/sections/blog"
import Testimonials from "../components/sections/testimonials"
import Contact from "../components/sections/contact"
import Footer from "../components/layout/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Blog />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}