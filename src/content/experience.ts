// Shared work experience content (main portfolio timeline + 3D world locations).
// 3D-only enrichments live in experience-details.ts.

export interface Experience {
  id: string
  title: string
  company: string
  period: string
  location: string
  type: string
  highlights: string[]
  liveDemo?: string
}

export const experiences: Experience[] = [
  {
    id: "gdp-labs",
    title: "AI Engineer",
    company: "GDP Labs",
    period: "Mar 2026 - Present",
    location: "Jakarta Selatan, Jakarta, Indonesia",
    type: "INTERNSHIP",
    highlights: [
      "Led GLChat's guardrail migration to the in-house GenAI SDK, replacing rule-based phrase matching with LLM-based classification across 16 content-safety categories with configurable enforcement modes and topic controls, improving multilingual (Indonesian/English) accuracy and reducing false positives by ~30%",
      "Extended the SDK and its integration with conversation-history-aware decisions, additional safety categories, and admin-configurable controls including a provider-agnostic model and a conservative fail-safe mode, plus per-preset caching for lower latency",
      "Shipped runtime configuration for External Pipeline Services, a FastAPI service exposing Beebot's chat pipelines as OpenAI Responses API-compatible endpoints, letting admins update pipeline config through validated APIs that persist to PostgreSQL and propagate across replicas via Redis with zero service restart",
      "Conducted guardrail research explorations across KB and KG grounding, streaming-output validation, factual grounding, and built a 175-case bilingual evaluation dataset labeled by harm category, severity, and evasion technique",
    ],
  },
  {
    id: "bitcorp",
    title: "Software Engineer",
    company: "PT Bringin Inti Teknologi (bitcorp.)",
    period: "Jul 2025 - Jan 2026",
    location: "Jakarta Pusat, Jakarta, Indonesia",
    type: "INTERNSHIP",
    highlights: [
      "Designed and delivered end-to-end workforce management platform with mobile and web interfaces, enabling efficient employee tracking, and project management",
      "Developed a facial recognition attendance system with face embedding extraction, anti-spoofing detection, and GPS validation, impersonation in attendance and ensuring 95%+ identity verification accuracy to prevent fraudulent clock-ins",
      "Implemented automated approval systems for leave, overtime, and timesheets with real-time notification channels and analytics dashboards, decreasing manual processing time from 3 days to 4 hours and improving team productivity by 60%",
    ],
  },
  {
    id: "ui-teaching-assistant",
    title: "Teaching Assistant",
    company: "Universitas Indonesia",
    period: "Aug 2024 - Oct 2025",
    location: "Depok, Jawa Barat, Indonesia",
    type: "PART TIME",
    highlights: [
      "Tutored 250+ undergraduate students in Computer Vision, Statistics & Probability and Calculus 2 courses",
      "Graded homework assignments, quizzes, and coding projects with clear feedback across all three subjects",
      "Helped students connect theory to practical applications in mathematics and programming",
      "Helped in preparing course materials, including practice problems for exam preparation",
    ],
  },
  {
    id: "okk-ui-2024",
    title: "IT & Broadcast",
    company: "OKK UI 2024",
    period: "Jun - Aug 2024",
    location: "Depok, Jawa Barat, Indonesia",
    type: "ORGANIZATION",
    highlights: [
      "Designed engaging and user-friendly interfaces to enhance user experience",
      "Developed responsive frontend components and pages using React and Tailwind CSS for the official OKK UI website",
      "Contributed to the development of a website used by thousands of new students at Universitas Indonesia in 2024 for orientation and university-related information",
    ],
    liveDemo: "https://okk-ui-2024.up.railway.app",
  },
  {
    id: "compfest-15",
    title: "Editorial Marketing",
    company: "COMPFEST 15",
    period: "Apr - Nov 2023",
    location: "Depok, Jawa Barat, Indonesia",
    type: "ORGANIZATION",
    highlights: [
      "Provided captioning, proofreading, translating, and copywriting services for COMPFEST publications, resulting in thousands of insights across various social media platforms",
      "Created and published press releases and conducted speaker interviews for the Grand Launching of COMPFEST 15",
    ],
  },
]

export function getExperience(id: string) {
  const experience = experiences.find((item) => item.id === id)
  if (!experience) throw new Error(`Unknown experience: ${id}`)
  return experience
}
