// Shared project card data (home page, /projects page, 3D gallery).
// Long-form text lives in project-details.ts so the home page bundle stays small.

export interface Project {
  id: number
  slug: string
  title: string
  shortTitle?: string
  summary: string
  image: string
  technologies: string[]
  categories: string[]
  githubUrl?: string
  liveDemo?: string
  featured: boolean
  award?: string
  awardUrl?: string
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "dc-sentiment-analysis",
    title: "Sentiment Analysis: DC Universe Rebrand (Man of Steel vs. Superman 2025)",
    shortTitle: "Sentiment Analysis: DC Universe Rebrand",
    summary:
      "Full-cycle research project evaluating public sentiment on the DC Universe's creative direction. Compared audience reception between Man of Steel (2013) and Superman (2025) using social media data.",
    image: "/assets/Superman.png",
    technologies: ["Python", "NLP", "Social Media Analytics", "Data Visualization"],
    categories: ["AI/ML"],
    githubUrl: "https://github.com/hilaldfzn/social-media-analytics",
    featured: true,
  },
  {
    id: 2,
    slug: "maams",
    title: "MAAMS",
    summary:
      "AI-powered root cause analysis application utilizing DeepSeek R1 model for chat completions. Validates and confirms underlying causes of problems with advanced analysis algorithms.",
    image: "/assets/MAAMS.jpg",
    technologies: ["Python", "Django", "Next.js", "Tailwind CSS", "DeepSeek"],
    categories: ["Web Development", "AI/ML"],
    liveDemo: "https://maams-ng.netlify.app",
    featured: true,
  },
  {
    id: 3,
    slug: "apap-medika",
    title: "Apap Medika",
    summary:
      "Hospital management system using a 6-microservice architecture. Full ownership of end-to-end product design with JWT authentication, OAuth, and role-based access control for five user types.",
    image: "/assets/apap-medika.jpg",
    technologies: ["Python", "Django", "Next.js", "Tailwind CSS", "PostgreSQL"],
    categories: ["Web Development", "Healthcare"],
    githubUrl: "https://github.com/orgs/ApapMedika/repositories",
    featured: false,
  },
  {
    id: 4,
    slug: "database-backup-utility",
    title: "Database Backup Utility",
    summary:
      "CLI tool in Go automating backup and restore for MySQL, PostgreSQL, MongoDB, and SQLite. Integrates with AWS S3, GCS, and Azure with compression, encryption, and retention policies.",
    image: "/assets/db-backup-utility.png",
    technologies: ["Go", "PostgreSQL", "MySQL", "MongoDB", "AWS", "Azure", "GCS"],
    categories: ["Back End Development", "DevOps"],
    githubUrl: "https://github.com/hilaldfzn/database-backup-utility",
    featured: false,
  },
  {
    id: 5,
    slug: "crawlkit-api",
    title: "CrawlKit API",
    summary:
      "REST API for intelligent web scraping with concurrent crawling and real-time analytics. Enforces robots.txt compliance, automatic delays, and rate limiting for ethical data collection.",
    image: "/assets/crawlkit-api.png",
    technologies: ["Python", "FastAPI"],
    categories: ["Back End Development", "Web Scraping"],
    githubUrl: "https://github.com/hilaldfzn/crawlkit-api",
    featured: false,
  },
  {
    id: 6,
    slug: "natural-language-inference",
    title: "Natural Language Inference",
    summary:
      "Deep learning model for predicting logical relationships between sentences using pre-trained DeBERTa V3. Built from scratch with PyTorch for Indonesian and English datasets.",
    image: "/assets/NLI.png",
    technologies: ["Python", "PyTorch", "Transformers", "DeBERTa"],
    categories: ["AI/ML"],
    githubUrl: "https://github.com/hilaldfzn/natural-language-inference",
    featured: true,
  },
  {
    id: 7,
    slug: "lembarpena",
    title: "Lembarpena",
    summary:
      "Award-winning literacy community web and mobile application connecting readers and authors. Features book purchasing, discussion forums, and wishlist functionality.",
    image: "/assets/lembar-pena.jpg",
    technologies: ["Python", "Django", "HTML", "CSS", "JavaScript"],
    categories: ["Web Development"],
    githubUrl: "https://github.com/PBPC09/tugaskelompok1",
    liveDemo: "https://lembarpena.vercel.app",
    featured: true,
    award: "Best Web Application Award",
    awardUrl: "https://pbp-fasilkom-ui.github.io/ganjil-2024/awards#aplikasi-web-terbaik",
  },
  {
    id: 8,
    slug: "mario-object-detection",
    title: "Mario Object Detection",
    summary:
      "YOLO v11-based object detection system for accurately detecting Mario characters in video datasets. Addresses real-world challenges like lighting variability and complex backgrounds.",
    image: "/assets/mario.png",
    technologies: ["Python", "YOLO v11", "OpenCV", "Roboflow"],
    categories: ["Computer Vision", "AI/ML"],
    githubUrl: "https://github.com/hilaldfzn/mario-object-detection",
    featured: true,
  },
  {
    id: 9,
    slug: "health-admission-prediction",
    title: "Health Admission Prediction",
    summary:
      "Healthcare analytics project predicting patient outcomes and ICU stay duration. Includes classification, regression, and clustering models for medical decision-making support.",
    image: "/assets/health-admission.png",
    technologies: ["Python", "Scikit-learn", "Pandas", "Healthcare"],
    categories: ["Data Science", "Healthcare"],
    githubUrl: "https://github.com/hilaldfzn/OkeGas-health-admission",
    featured: true,
  },
  {
    id: 10,
    slug: "marmut-music",
    title: "Marmut Music",
    summary:
      "Spotify-like streaming platform offering music and podcasts with premium subscriptions, playlists, charts, and royalty tracking for artists, songwriters, and labels.",
    image: "/assets/marmut.jpg",
    technologies: ["Python", "Django", "Tailwind CSS", "PostgreSQL"],
    categories: ["Web Development", "Entertainment"],
    githubUrl: "https://github.com/basdat-d1/marmut",
    liveDemo: "https://marmut-music.vercel.app",
    featured: true,
  },
  {
    id: 11,
    slug: "hoomgroom",
    title: "HoomGroom",
    summary:
      "IKEA-inspired furniture e-commerce platform with catalog browsing, cart management, balance top-up, and shipping tracking. Built with Spring Boot and Next.js + Tailwind CSS.",
    image: "/assets/maintenance.png",
    technologies: ["Java", "Spring Boot", "Next.js", "PostgreSQL"],
    categories: ["Web Development", "E-commerce"],
    githubUrl: "https://github.com/orgs/Adpro-C5/repositories",
    liveDemo: "https://hoomgroom.vercel.app",
    featured: true,
  },
]

export const projectCategories = [
  "All",
  "AI/ML",
  "Back End Development",
  "Computer Vision",
  "Data Science",
  "DevOps",
  "E-commerce",
  "Entertainment",
  "Healthcare",
  "Web Development",
]

export function getProject(slug: string) {
  const project = projects.find((item) => item.slug === slug)
  if (!project) throw new Error(`Unknown project: ${slug}`)
  return project
}
