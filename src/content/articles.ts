// Shared article list (home articles section, /articles page, and the 3D Article Library).

export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  image: string
  categories: string[]
  tags: string[]
  readingTime: number
  publishedAt: string
  url: string
  newsletter?: string
  newsletterUrl?: string
}

export const articles: Article[] = [
  {
    id: 1,
    slug: "deployment-evolution",
    title: "The Evolution of Deployment: From Manual Chaos to Automated Mastery with Docker & Cloud Run",
    excerpt:
      "Explore how modern deployment practices with Docker and Cloud Run have revolutionized the way we deploy applications.",
    image: "/assets/deployment-evolution.png",
    categories: ["DevOps", "Cloud Computing"],
    tags: ["Docker", "Cloud Run", "Deployment", "DevOps"],
    readingTime: 20,
    publishedAt: "2025-05-27",
    url: "https://medium.com/@hilalfauzan9/the-evolution-of-deployment-from-manual-chaos-to-automated-mastery-with-docker-cloud-run-d546565dc021",
  },
  {
    id: 2,
    slug: "mock-objects-stubs",
    title: "Mock Objects & Stubs: Your Key to Bulletproof Test Isolation",
    excerpt:
      "Discover how to use mock objects and stubs to create isolated, reliable, and maintainable tests for your applications.",
    image: "/assets/mock-testing.png",
    categories: ["Testing", "Best Practices"],
    tags: ["Testing", "Mock Objects", "Test Isolation"],
    readingTime: 10,
    publishedAt: "2025-05-27",
    url: "https://medium.com/@hilalfauzan9/mock-objects-stubs-your-key-to-bulletproof-test-isolation-9137ec062371",
    newsletter: "Software Testing Weekly #273",
    newsletterUrl: "https://softwaretestingweekly.com/issues/273",
  },
  {
    id: 3,
    slug: "database-seeding-migration",
    title: "Mastering Database Management: A Complete Guide to Automatic Data Seeding and Migration",
    excerpt:
      "Learn how to effectively manage your database with automatic data seeding and migration techniques for better development workflow.",
    image: "/assets/database-management.png",
    categories: ["Database", "DevOps"],
    tags: ["Database", "Migration", "Seeding"],
    readingTime: 10,
    publishedAt: "2025-05-27",
    url: "https://medium.com/@hilalfauzan9/mastering-database-management-a-complete-guide-to-automatic-data-seeding-and-migration-59fdff63a0c3",
  },
  {
    id: 4,
    slug: "test-driven-development",
    title: "Test-Driven Development: The Key to Building Reliable and Scalable Software",
    excerpt:
      "Discover how TDD methodology can help you build more reliable, maintainable, and scalable software applications.",
    image: "/assets/TDD.png",
    categories: ["Development", "Testing"],
    tags: ["Software Testing", "Unit Testing"],
    readingTime: 10,
    publishedAt: "2025-05-18",
    url: "https://medium.com/@hilalfauzan9/test-driven-development-the-key-to-building-reliable-and-scalable-software-f6f355901330",
    newsletter: "Software Testing Weekly #272",
    newsletterUrl: "https://softwaretestingweekly.com/issues/272",
  },
  {
    id: 5,
    slug: "solid-principles",
    title: "From Duplication to Elegance: How SOLID Principles Transformed Our Authentication System",
    excerpt:
      "Learn how applying SOLID principles can transform messy, duplicated code into elegant, maintainable authentication systems.",
    image: "/assets/SOLID.png",
    categories: ["Best Practices", "Software Architecture"],
    tags: ["SOLID", "Code Quality", "Clean Code"],
    readingTime: 10,
    publishedAt: "2025-05-17",
    url: "https://medium.com/@hilalfauzan9/from-duplication-to-elegance-how-solid-principles-transformed-our-authentication-system-f4411cc4675f",
  },
  {
    id: 6,
    slug: "owasp-secure-programming",
    title: "OWASP Compliance and Beyond: Building Robust Security Through Secure Programming",
    excerpt:
      "Comprehensive guide to implementing OWASP security principles and building secure applications with robust programming practices.",
    image: "/assets/secure-programming.png",
    categories: ["Security", "Best Practices"],
    tags: ["OWASP", "Security", "Authentication", "Authorization"],
    readingTime: 12,
    publishedAt: "2025-04-03",
    url: "https://medium.com/@hilalfauzan9/owasp-compliance-and-beyond-building-a-robust-security-through-secure-programming-aba4060f0280",
  },
  {
    id: 7,
    slug: "sonarcloud-code-quality",
    title: "Preventing Bugs Before They Bite: SonarCloud for Proactive Code Quality",
    excerpt: "Learn how to use SonarCloud to maintain high code quality and prevent bugs before they reach production.",
    image: "/assets/QA.png",
    categories: ["Quality Assurance", "DevOps"],
    tags: ["SonarCloud", "Code Quality", "Static Code Analysis"],
    readingTime: 10,
    publishedAt: "2025-03-06",
    url: "https://medium.com/@hilalfauzan9/preventing-bugs-before-they-bite-sonarcloud-for-proactive-code-quality-c7db5b5ccff4",
  },
  {
    id: 8,
    slug: "scrum-team-tools",
    title: "Unlocking Scrum Team Synergy: Mastering Tools for Peak Collaborative Coding",
    excerpt:
      "Explore essential tools and practices for maximizing team collaboration and productivity in Scrum environments.",
    image: "/assets/teamwork-tools.png",
    categories: ["Agile", "Team Management"],
    tags: ["Scrum", "Team Collaboration", "Agile Methodology"],
    readingTime: 9,
    publishedAt: "2025-03-04",
    url: "https://medium.com/@hilalfauzan9/unlocking-scrum-team-synergy-mastering-tools-for-peak-collaborative-coding-5504d572cbe3",
  },
  {
    id: 9,
    slug: "google-cloud-platform",
    title: "Google Cloud Platform: Solusi Terbaik Layanan Cloud",
    excerpt:
      "Comprehensive overview of Google Cloud Platform services and why it's an excellent choice for cloud solutions.",
    image: "/assets/google-cloud.png",
    categories: ["Cloud Computing", "Infrastructure"],
    tags: ["Google Cloud", "Cloud Computing", "Infrastructure"],
    readingTime: 5,
    publishedAt: "2023-12-03",
    url: "https://medium.com/compfest/google-cloud-platform-solusi-terbaik-layanan-cloud-a298a3aa53f1",
  },
  {
    id: 10,
    slug: "seacamp-career-skills",
    title: "Software Engineering Academy Camp 3: Implementation of Career-Related Skills",
    excerpt:
      "Insights from Software Engineering Academy focusing on practical career skills and professional development.",
    image: "/assets/academy-career.png",
    categories: ["Career Development", "Education"],
    tags: ["Career Development", "Software Engineering"],
    readingTime: 6,
    publishedAt: "2023-11-05",
    url: "https://medium.com/compfest/software-engineering-academy-camp-3-implementation-of-career-related-skills-d1bd1280b488",
  },
  {
    id: 11,
    slug: "compfest-15-grand-launching",
    title: "Grand Launching COMPFEST 15: Welcoming a Series of Insightful Events",
    excerpt:
      "Coverage of COMPFEST 15 grand launching event and the exciting series of technology and innovation events.",
    image: "/assets/compfest-15.png",
    categories: ["Events", "Technology"],
    tags: ["COMPFEST", "Technology Events", "Innovation"],
    readingTime: 5,
    publishedAt: "2023-05-23",
    url: "https://medium.com/compfest/grand-launching-compfest-15-welcoming-a-series-of-insightful-events-f452fcb48b56",
  },
]

export const articleCategories = [
  "All",
  "DevOps",
  "Testing",
  "Database",
  "Development",
  "Best Practices",
  "Security",
  "Quality Assurance",
  "Agile",
  "Cloud Computing",
  "Career Development",
  "Events",
  "Software Architecture",
  "Team Management",
  "Infrastructure",
  "Education",
  "Technology",
]

export function formatArticleDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
