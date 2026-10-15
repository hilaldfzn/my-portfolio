// Shared honors and awards (main portfolio awards section + 3D Hall of Achievements).

export interface AwardItem {
  id: number
  title: string
  subtitle?: string
  year: string
  description: string
  achievements?: string[]
  category: string
}

export const awards: AwardItem[] = [
  {
    id: 1,
    title: "RSA PTI Scholarship Awardee",
    year: "2025",
    description:
      "Recipient of the prestigious RSA PTI Scholarship, recognizing academic excellence and outstanding potential across all faculties at Universitas Indonesia.",
    category: "Scholarship",
  },
  {
    id: 2,
    title: "International Youth Innovation Summit #15",
    subtitle: "Chapter Malaysia, Singapore, Thailand",
    year: "2025",
    description:
      "Triple award winner at the International Youth Innovation Summit, demonstrating exceptional creativity, innovation, and presentation skills on an international platform.",
    achievements: ["The Most Creative Delegate", "2nd Best Video Project Innovation", "3rd Best Presentation"],
    category: "International Competition",
  },
  {
    id: 3,
    title: "Primagama Mencari Juara",
    subtitle: "Provincial-level Jakarta",
    year: "2017",
    description:
      "Achieved 1st Place and Gold Medal in Mathematics at the provincial level, demonstrating exceptional mathematical prowess and problem-solving abilities.",
    achievements: ["1st Place and Gold Medalist in Mathematics"],
    category: "Academic Competition",
  },
]
