// 3D-only enrichments for experiences. Every entry restates facts already in the
// matching highlights (src/content/experience.ts) or the CV; nothing here is new.

export interface ExperienceDetails {
  product?: string
  focus: string[]
  metrics: { value: string; label: string }[]
}

export const experienceDetails: Record<string, ExperienceDetails> = {
  "gdp-labs": {
    product: "GLChat, Beebot",
    focus: [
      "LLM guardrails",
      "Safety classification",
      "Multilingual (ID/EN)",
      "In-house GenAI SDK",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "OpenAI Responses API",
      "Evaluation datasets",
    ],
    metrics: [
      { value: "16", label: "content-safety categories" },
      { value: "~30%", label: "fewer false positives" },
      { value: "175", label: "bilingual evaluation cases" },
      { value: "0", label: "restarts to roll out pipeline config" },
    ],
  },
  bitcorp: {
    product: "TogetherApps",
    focus: [
      "Facial recognition",
      "Face embeddings",
      "Anti-spoofing",
      "GPS validation",
      "Approval workflows",
      "Real-time notifications",
      "Analytics dashboards",
    ],
    metrics: [
      { value: "95%+", label: "identity verification accuracy" },
      { value: "3 days → 4 hrs", label: "manual processing time" },
      { value: "60%", label: "team productivity improvement" },
    ],
  },
}
