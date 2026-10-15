// Shared profile content used by the main portfolio and the playable 3D portfolio.
// Keep this the single place to edit identity, bio, and education details.

export interface RichTextSegment {
  text: string
  strong?: boolean
}

export const profile = {
  name: "Muhammad Hilal Darul Fauzan",
  shortName: "Hilal",
  headline: "AI Engineer · Software Engineer (Backend)",
  location: "Jakarta Pusat, Jakarta, Indonesia",
  email: "hilalfauzan9@gmail.com",
  photo: "/assets/me.png",
  resume: {
    href: "/assets/CV/CV_Muhammad Hilal Darul Fauzan.pdf",
    fileName: "CV_Muhammad Hilal Darul Fauzan.pdf",
  },
  links: {
    github: "https://github.com/hilaldfzn",
    linkedin: "https://linkedin.com/in/hilaldfzn",
    medium: "https://medium.com/@hilalfauzan9",
  },
}

export const bio: RichTextSegment[][] = [
  [
    { text: "I'm an AI & Software Engineer currently pursuing my Bachelor's degree in Computer Science at " },
    { text: "Universitas Indonesia", strong: true },
    {
      text: ". With internship experience in AI engineering and software development, I build end-to-end solutions from model development to production deployment.",
    },
  ],
  [
    {
      text: "I specialize in building AI-powered systems and modern web applications using technologies like React, Next.js, Django, FastAPI, and deep learning frameworks. I'm passionate about integrating ",
    },
    { text: "AI/ML", strong: true },
    { text: " into practical solutions to solve real-world problems." },
  ],
]

export const stats = [
  { key: "interning", value: "7+", label: "Months Interning" },
  { key: "tutored", value: "250+", label: "Students Tutored" },
  { key: "projects", value: "10+", label: "Projects Built" },
  { key: "articles", value: "11+", label: "Articles Written" },
] as const

export const education = {
  degree: "Computer Science",
  school: "Universitas Indonesia",
  period: "Aug 2022 - Aug 2026",
  gpa: "3.65/4.00",
  logo: "/assets/UI.png",
  coursework: [
    "Software Engineering",
    "AI & Data Science",
    "Knowledge Graph",
    "Computer Vision",
    "Deep Learning",
    "Web Design & Development",
    "Data Structures & Algorithms",
  ],
}
