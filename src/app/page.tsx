import { Navbar } from "../components/layout/header"
import { HeroSection } from "../components/sections/hero"
import { AboutSection } from "../components/sections/about"
import { SkillsSection } from "../components/sections/skills"
import { ExperienceSection } from "../components/sections/experience"
import { ProjectsSection } from "../components/sections/projects"
import { BlogSection } from "../components/sections/blog"
import { TestimonialsSection } from "../components/sections/testimonials"
import { ContactSection } from "../components/sections/contact"
import { Footer } from "../components/layout/footer"
import { MouseFollower } from "../components/mouse-follower"
import { ScrollProgress } from "../components/scroll-progress"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden dark">
      <MouseFollower />
      <ScrollProgress />
      <Navbar />

      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <BlogSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}