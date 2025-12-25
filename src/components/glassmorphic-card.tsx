import type React from "react"

interface GlassmorphicCardProps {
  children: React.ReactNode
}

export function GlassmorphicCard({ children }: GlassmorphicCardProps) {
  return (
    <div className="bg-zinc-900/40 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-zinc-200/20 dark:border-white/10">
      {children}
    </div>
  )
}