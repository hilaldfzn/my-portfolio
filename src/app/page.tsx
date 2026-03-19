import { Navbar } from "../components/layout/header"
import { HeroSection } from "../components/sections/hero"
import { ScrollProgress } from "../components/layout/scroll-progress"
import { CommandBar } from "../components/layout/command-bar"
import { Footer } from "../components/layout/footer"
import { ParallaxBackground } from "../components/sections/parallax-background"
import { lazy, Suspense } from "react"

const AboutSection = lazy(() =>
  import("../components/sections/about").then((module) => ({ default: module.AboutSection })),
)
const SkillsSection = lazy(() =>
  import("../components/sections/skills").then((module) => ({ default: module.SkillsSection })),
)
const ExperienceSection = lazy(() =>
  import("../components/sections/experiences").then((module) => ({ default: module.ExperienceSection })),
)
const AwardsSection = lazy(() =>
  import("../components/sections/awards").then((module) => ({ default: module.AwardsSection })),
)
const GitHubActivitySection = lazy(() =>
  import("../components/sections/github-activity").then((module) => ({ default: module.GitHubActivitySection })),
)
const ProjectsSection = lazy(() =>
  import("../components/sections/projects").then((module) => ({ default: module.ProjectsSection })),
)
const ArticleSection = lazy(() =>
  import("../components/sections/articles").then((module) => ({ default: module.ArticleSection })),
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pb-10">
      <ParallaxBackground />
      <ScrollProgress />
      <Navbar />

      <HeroSection />

      <div className="space-y-24 md:space-y-32 lg:space-y-40 relative z-10">
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
          <ArticleSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <GitHubActivitySection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </div>

      <Footer />
      <CommandBar />
    </div>
  )
}
