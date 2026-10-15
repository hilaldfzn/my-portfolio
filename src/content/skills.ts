// Shared skills catalog (main portfolio skills section + 3D skill tokens), matching the CV.
// Logos come from Devicon; brands Devicon lacks use Simple Icons (single-color glyphs, so `mono`
// tells the UI to invert them in dark mode).

export interface Skill {
  name: string
  logo: string
  mono?: boolean
}

export interface SkillCategory {
  label: string
  skills: Skill[]
}

const devicon = (path: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`
const simpleIcon = (slug: string) => `https://cdn.jsdelivr.net/npm/simple-icons@16.30.0/icons/${slug}.svg`

export const skillCategories: SkillCategory[] = [
  {
    label: "languages",
    skills: [
      { name: "Python", logo: devicon("python/python-original.svg") },
      { name: "TypeScript", logo: devicon("typescript/typescript-original.svg") },
      { name: "Java", logo: devicon("java/java-original.svg") },
      { name: "Go", logo: devicon("go/go-original-wordmark.svg") },
    ],
  },
  {
    label: "ai/ml",
    skills: [
      { name: "PyTorch", logo: devicon("pytorch/pytorch-original.svg") },
      { name: "TensorFlow", logo: devicon("tensorflow/tensorflow-original.svg") },
      { name: "LangChain", logo: simpleIcon("langchain"), mono: true },
      { name: "LangGraph", logo: simpleIcon("langgraph"), mono: true },
      { name: "NeMo Guardrails", logo: simpleIcon("nvidia"), mono: true },
      { name: "n8n", logo: simpleIcon("n8n"), mono: true },
      { name: "OpenCV", logo: devicon("opencv/opencv-original.svg") },
      { name: "YOLO", logo: simpleIcon("ultralytics"), mono: true },
      { name: "Hugging Face Transformers", logo: simpleIcon("huggingface"), mono: true },
    ],
  },
  {
    label: "backend",
    skills: [
      { name: "FastAPI", logo: devicon("fastapi/fastapi-original.svg") },
      { name: "Django", logo: simpleIcon("django"), mono: true },
      { name: "NestJS", logo: devicon("nestjs/nestjs-original.svg") },
      { name: "Spring Boot", logo: devicon("spring/spring-original.svg") },
    ],
  },
  {
    label: "frontend & mobile",
    skills: [
      { name: "Next.js", logo: devicon("nextjs/nextjs-original.svg") },
      { name: "React.js", logo: devicon("react/react-original.svg") },
      { name: "Vue.js", logo: devicon("vuejs/vuejs-original.svg") },
      { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Flutter", logo: devicon("flutter/flutter-original.svg") },
    ],
  },
  {
    label: "databases",
    skills: [
      { name: "PostgreSQL", logo: devicon("postgresql/postgresql-original.svg") },
      { name: "MySQL", logo: devicon("mysql/mysql-original.svg") },
      { name: "MongoDB", logo: devicon("mongodb/mongodb-original.svg") },
    ],
  },
  {
    label: "cloud & tools",
    skills: [
      { name: "Docker", logo: devicon("docker/docker-original.svg") },
      { name: "Google Cloud", logo: devicon("googlecloud/googlecloud-original.svg") },
      { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
    ],
  },
]

export const allSkills = skillCategories.flatMap((category) =>
  category.skills.map((skill) => ({ ...skill, category: category.label })),
)
