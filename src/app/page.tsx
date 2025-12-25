import { Navbar } from "../components/layout/header"
import { HeroSection } from "../components/sections/hero"
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
const AwardsSection = lazy(() =>
  import("../components/sections/awards").then((module) => ({ default: module.AwardsSection })),
)
const BlogSection = lazy(() =>
  import("../components/sections/blog").then((module) => ({ default: module.BlogSection })),
)
const ContactSection = lazy(() =>
  import("../components/sections/contact").then((module) => ({ default: module.ContactSection })),
)

const SectionLoader = () => (
  <div className="py-32 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
)

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Navbar />

      <HeroSection />

      <div className="space-y-24 md:space-y-32 lg:space-y-40">
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
          <AwardsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <BlogSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </div>

      <Footer />
    </div>
  )
}