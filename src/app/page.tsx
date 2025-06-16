import { Navbar } from "../components/layout/header"
import { HeroSection } from "../components/sections/hero"
import { MouseFollower } from "../components/mouse-follower"
import { ScrollProgress } from "../components/scroll-progress"
import { Footer } from "../components/layout/footer"
import { lazy, Suspense } from "react"

const AboutSection = lazy(() =>
  import("../components/sections/about").then((module) => ({ default: module.AboutSection })),
)
const SkillsSection = lazy(() =>
  import("../components/sections/skills").then((module) => ({ default: module.SkillsSection })),
)
const ExperienceSection = lazy(() =>
  import("../components/sections/experience").then((module) => ({ default: module.ExperienceSection })),
)
const ProjectsSection = lazy(() =>
  import("../components/sections/projects").then((module) => ({ default: module.ProjectsSection })),
)
const BlogSection = lazy(() => import("../components/sections/blog").then((module) => ({ default: module.BlogSection })))
const TestimonialsSection = lazy(() =>
  import("../components/sections/testimonials").then((module) => ({ default: module.TestimonialsSection })),
)
const ContactSection = lazy(() =>
  import("../components/sections/contact").then((module) => ({ default: module.ContactSection })),
)

const SectionLoader = () => (
  <div className="py-32 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden dark">
      <MouseFollower />
      <ScrollProgress />
      <Navbar />

      <HeroSection />

      <Suspense fallback={<SectionLoader />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <SkillsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ExperienceSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <BlogSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>

      <Footer />
    </div>
  )
}