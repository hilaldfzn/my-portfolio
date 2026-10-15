"use client"

import { Fragment, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Award, Check, Download, ExternalLink, Github, Linkedin, Mail, MapPin, PenTool } from "lucide-react"
import { bio, education, profile, stats } from "../../../content/profile"
import { experiences, getExperience } from "../../../content/experience"
import { experienceDetails } from "../../../content/experience-details"
import { projects } from "../../../content/projects"
import { projectDetails } from "../../../content/project-details"
import { awards } from "../../../content/achievements"
import { skillCategories } from "../../../content/skills"
import { DISTRICT_BY_ID, GALLERY_SLUGS, TOKENS, TOKEN_COLORS, type PanelRef } from "../world-config"
import { useWorldStore } from "../store"
import { Chip, ExternalAnchor, Label, buttonStyles } from "./primitives"

export interface PanelHeader {
  label: string
  title: string
  subtitle?: string
}

export function panelHeader(panel: PanelRef): PanelHeader {
  switch (panel.type) {
    case "about":
      return { label: "~/home", title: "About me", subtitle: profile.headline }
    case "experience": {
      const experience = getExperience(panel.id)
      const district = panel.id === "gdp-labs" ? DISTRICT_BY_ID.lab : DISTRICT_BY_ID.workshop
      return { label: district.path, title: experience.company, subtitle: `${experience.title} · ${experience.type.toLowerCase()}` }
    }
    case "project": {
      const project = projects.find((p) => p.slug === panel.slug)!
      return { label: "projects/", title: project.title, subtitle: project.categories.join(" / ") }
    }
    case "projects":
      return { label: "projects/", title: "Project index", subtitle: `${projects.length} projects` }
    case "skills":
      return { label: "skills/", title: "Skills & technologies", subtitle: "languages · frameworks · databases · tools" }
    case "awards":
      return { label: "awards/", title: "Honors & awards", subtitle: `${awards.length} recognitions` }
    case "contact":
      return { label: "contact/", title: "Get in touch", subtitle: "Resume, email, and profiles" }
    case "writing":
      return { label: "~/home/notes", title: "Writing", subtitle: "Articles on Medium" }
    case "exit":
      return { label: "portal", title: "Back to the main portfolio?" }
  }
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <p className="font-mono text-xs text-muted-foreground">{`// ${title}`}</p>
      {children}
    </section>
  )
}

function Bullets({ items, color = "text-primary" }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
          <span className={`mt-0.5 flex-shrink-0 font-mono text-xs ${color}`}>{">"}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function ProfileLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      <a href={profile.resume.href} download={profile.resume.fileName} className={buttonStyles.link}>
        <Download className="h-3.5 w-3.5" /> Resume (PDF)
      </a>
      <ExternalAnchor href={profile.links.github}>
        <Github className="h-3.5 w-3.5" /> GitHub
      </ExternalAnchor>
      <ExternalAnchor href={profile.links.linkedin}>
        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
      </ExternalAnchor>
      <ExternalAnchor href={`mailto:${profile.email}`}>
        <Mail className="h-3.5 w-3.5" /> Email
      </ExternalAnchor>
    </div>
  )
}

function AboutPanel() {
  const background = experiences.filter((e) => !["gdp-labs", "bitcorp"].includes(e.id))
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {bio.map((paragraph, index) => (
          <p key={index} className="text-[15px] leading-relaxed text-muted-foreground">
            {paragraph.map((segment, i) =>
              segment.strong ? (
                <span key={i} className="font-semibold text-foreground">
                  {segment.text}
                </span>
              ) : (
                <Fragment key={i}>{segment.text}</Fragment>
              ),
            )}
          </p>
        ))}
        <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {profile.location}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.key} className="card-accent rounded-lg p-3">
            <p className="font-display text-2xl text-foreground">{stat.value}</p>
            <p className="font-mono text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <Section title="education">
        <div className="card-accent rounded-lg p-4">
          <p className="font-display text-xl text-foreground">{education.degree}</p>
          <p className="text-sm text-muted-foreground">{education.school}</p>
          <p className="font-mono text-xs text-primary">
            {education.period} · CGPA {education.gpa}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {education.coursework.map((course) => (
              <Chip key={course}>{course}</Chip>
            ))}
          </div>
        </div>
      </Section>
      <Section title="career direction">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Focused on AI engineering with a backend foundation: LLM safety and guardrails at GDP Labs, and backend
          systems, facial recognition and workflow automation at bitcorp. Visit the <span className="text-foreground">lab/</span> and{" "}
          <span className="text-foreground">workshop/</span> districts for the details.
        </p>
      </Section>
      <Section title="background">
        <ol className="space-y-4 border-l border-border pl-4">
          {background.map((item) => (
            <li key={item.id} className="space-y-1">
              <p className="font-mono text-[11px] text-muted-foreground">
                {item.period} · {item.type.toLowerCase()}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {item.title}, {item.company}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              {item.liveDemo && (
                <ExternalAnchor href={item.liveDemo} className="mt-1">
                  <ExternalLink className="h-3.5 w-3.5" /> View project
                </ExternalAnchor>
              )}
            </li>
          ))}
        </ol>
      </Section>
      <ProfileLinks />
    </div>
  )
}

function ExperiencePanel({ id }: { id: "gdp-labs" | "bitcorp" }) {
  const experience = getExperience(id)
  const details = experienceDetails[id]
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <p className="font-mono text-xs text-muted-foreground">
          {experience.period} · {experience.location}
        </p>
        {details.product && <p className="font-mono text-xs text-primary">products: {details.product}</p>}
        <p className="text-[15px] leading-relaxed text-muted-foreground">{experience.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {details.metrics.map((metric) => (
          <div key={metric.label} className="card-accent rounded-lg p-3">
            <p className="font-display text-2xl leading-tight text-foreground">{metric.value}</p>
            <p className="font-mono text-[11px] text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>
      <Section title="what I did">
        <Bullets items={experience.highlights} />
      </Section>
      <Section title="focus areas">
        <div className="flex flex-wrap gap-1.5">
          {details.focus.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </div>
      </Section>
      <Link href="/#experiences" className={buttonStyles.link}>
        <ExternalLink className="h-3.5 w-3.5" /> Full timeline on the main portfolio
      </Link>
    </div>
  )
}

function ProjectLinks({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.githubUrl && (
        <ExternalAnchor href={project.githubUrl}>
          <Github className="h-3.5 w-3.5" /> Source code
        </ExternalAnchor>
      )}
      {project.liveDemo && (
        <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className={`${buttonStyles.link} border-primary/60 text-primary`}>
          <ExternalLink className="h-3.5 w-3.5" /> Live demo
        </a>
      )}
      {project.award && project.awardUrl && (
        <ExternalAnchor href={project.awardUrl}>
          <Award className="h-3.5 w-3.5" /> {project.award}
        </ExternalAnchor>
      )}
    </div>
  )
}

function ProjectPanel({ slug }: { slug: string }) {
  const openPanel = useWorldStore((state) => state.openPanel)
  const project = projects.find((p) => p.slug === slug)!
  const details = projectDetails[slug]
  const order = [...GALLERY_SLUGS, ...projects.map((p) => p.slug).filter((s) => !GALLERY_SLUGS.includes(s))]
  const index = order.indexOf(slug)
  const previous = order[(index - 1 + order.length) % order.length]
  const next = order[(index + 1) % order.length]
  return (
    <div className="space-y-7">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/3d/textures/projects/${slug}.jpg`}
        alt={`${project.title} screenshot`}
        className="aspect-[16/10] w-full rounded-md border border-border object-cover"
      />
      <Section title="overview">
        <p className="text-[15px] leading-relaxed text-muted-foreground">{details.description}</p>
      </Section>
      <Section title="highlights">
        <Bullets items={details.highlights} color="text-[hsl(var(--status-green))]" />
      </Section>
      <Section title="stack">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
      </Section>
      <ProjectLinks project={project} />
      <div className="flex items-center justify-between border-t border-border pt-4">
        <button type="button" className={buttonStyles.link} onClick={() => openPanel({ type: "project", slug: previous })}>
          <ArrowLeft className="h-3.5 w-3.5" /> Previous
        </button>
        <button type="button" className={buttonStyles.link} onClick={() => openPanel({ type: "projects" })}>
          All projects
        </button>
        <button type="button" className={buttonStyles.link} onClick={() => openPanel({ type: "project", slug: next })}>
          Next <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function ProjectsIndexPanel() {
  const openPanel = useWorldStore((state) => state.openPanel)
  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <article key={project.slug} className="card-accent space-y-2 rounded-lg p-4">
          <p className="font-mono text-[11px] text-muted-foreground">{project.categories.join(" / ")}</p>
          <h3 className="font-display text-lg leading-snug text-foreground">{project.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" className={`${buttonStyles.link} text-foreground`} onClick={() => openPanel({ type: "project", slug: project.slug })}>
              Details <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <ProjectLinks project={project} />
          </div>
        </article>
      ))}
    </div>
  )
}

function SkillsPanel() {
  const collected = useWorldStore((state) => state.tokens)
  return (
    <div className="space-y-7">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Each skill is also a token hidden along the island&apos;s paths.{" "}
        <span className="font-mono text-foreground">
          {collected.length}/{TOKENS.length}
        </span>{" "}
        collected so far.
      </p>
      {skillCategories.map((category) => (
        <Section key={category.label} title={category.label}>
          <div className="flex flex-wrap gap-1.5">
            {category.skills.map((skill) => {
              const has = collected.includes(skill.name)
              return (
                <Chip key={skill.name} active={has}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: TOKEN_COLORS[category.label] }} />
                  {skill.name}
                  {has && <Check className="h-3 w-3" aria-label="collected" />}
                </Chip>
              )
            })}
          </div>
        </Section>
      ))}
    </div>
  )
}

function AwardsPanel() {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        {awards.map((award) => (
          <article key={award.id} className="card-accent space-y-2 rounded-lg p-4">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="uppercase tracking-wider text-[hsl(var(--syntax-yellow))]">{award.category}</span>
              <span className="text-muted-foreground">{award.year}</span>
            </div>
            <h3 className="font-display text-lg leading-snug text-foreground">{award.title}</h3>
            {award.subtitle && <p className="text-sm text-muted-foreground">{award.subtitle}</p>}
            <p className="text-sm leading-relaxed text-muted-foreground">{award.description}</p>
            {award.achievements && <Bullets items={award.achievements} color="text-[hsl(var(--syntax-yellow))]" />}
          </article>
        ))}
      </div>
    </div>
  )
}

function ContactPanel() {
  return (
    <div className="space-y-7">
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        I&apos;m always open to new opportunities, collaborations, and interesting conversations.
      </p>
      <p className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-green))]" /> Available for opportunities
      </p>
      <div className="grid gap-2">
        <a href={profile.resume.href} download={profile.resume.fileName} className={`${buttonStyles.primary} w-full`}>
          <Download className="h-4 w-4" /> Download resume (PDF)
        </a>
        <a href={`mailto:${profile.email}`} className={`${buttonStyles.outline} w-full`}>
          <Mail className="h-4 w-4" /> {profile.email}
        </a>
        <div className="grid grid-cols-2 gap-2">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={buttonStyles.outline}>
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={buttonStyles.outline}>
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        </div>
      </div>
      <Section title="more">
        <div className="flex flex-wrap gap-2">
          <Link href="/#contact" className={buttonStyles.link}>
            <Mail className="h-3.5 w-3.5" /> Contact form
          </Link>
          <ExternalAnchor href={profile.links.medium}>
            <PenTool className="h-3.5 w-3.5" /> Medium
          </ExternalAnchor>
          <Link href="/" className={buttonStyles.link}>
            <ArrowLeft className="h-3.5 w-3.5" /> Main portfolio
          </Link>
        </div>
        <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {profile.location}
        </p>
      </Section>
    </div>
  )
}

function WritingPanel() {
  const articles = stats.find((s) => s.key === "articles")
  return (
    <div className="space-y-6">
      <div className="card-accent rounded-lg p-4">
        <p className="font-display text-3xl text-foreground">{articles?.value}</p>
        <p className="font-mono text-xs text-muted-foreground">{articles?.label}</p>
      </div>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        I write about deployment, testing, databases, clean architecture, and secure programming. The full list with
        summaries lives on the main portfolio.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/articles" className={buttonStyles.link}>
          <ArrowRight className="h-3.5 w-3.5" /> All articles
        </Link>
        <ExternalAnchor href={profile.links.medium}>
          <PenTool className="h-3.5 w-3.5" /> Medium profile
        </ExternalAnchor>
      </div>
    </div>
  )
}

function ExitPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-5">
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        The main portfolio has the same content as a classic, scrollable page. Your island progress stays saved in this
        browser.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className={buttonStyles.primary}>
          <ArrowLeft className="h-4 w-4" /> Back to main portfolio
        </Link>
        <button type="button" className={buttonStyles.outline} onClick={onClose}>
          Stay on the island
        </button>
      </div>
    </div>
  )
}

export function PanelBody({ panel, onClose }: { panel: PanelRef; onClose: () => void }) {
  switch (panel.type) {
    case "about":
      return <AboutPanel />
    case "experience":
      return <ExperiencePanel id={panel.id} />
    case "project":
      return <ProjectPanel slug={panel.slug} />
    case "projects":
      return <ProjectsIndexPanel />
    case "skills":
      return <SkillsPanel />
    case "awards":
      return <AwardsPanel />
    case "contact":
      return <ContactPanel />
    case "writing":
      return <WritingPanel />
    case "exit":
      return <ExitPanel onClose={onClose} />
  }
}

export { Label }
