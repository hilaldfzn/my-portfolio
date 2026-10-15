"use client"

import type { ReactNode } from "react"
import { cn } from "../../../lib/utils"

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-[1.6rem] h-6 items-center justify-center rounded border border-border bg-secondary px-1.5 font-mono text-[11px] font-medium text-foreground shadow-[inset_0_-2px_0_hsl(var(--border))]",
        className,
      )}
    >
      {children}
    </kbd>
  )
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("section-label", className)}>{children}</p>
}

export function Chip({ children, active, className }: { children: ReactNode; active?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-xs",
        active ? "border-accent/60 bg-accent/10 text-accent" : "border-border text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  )
}

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 h-11 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background/40 px-5 h-11 font-mono text-sm text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  hud: "pointer-events-auto inline-flex items-center gap-2 rounded-md border border-border bg-card/95 px-3 h-10 font-mono text-xs text-foreground shadow-lg transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  link: "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
}

export function ExternalAnchor({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(buttonStyles.link, className)}
    >
      {children}
    </a>
  )
}
