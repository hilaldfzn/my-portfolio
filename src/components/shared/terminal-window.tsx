"use client"

import type React from "react"
import { motion } from "framer-motion"

interface TerminalCommand {
  prompt: string
  command: string
  output: React.ReactNode
}

interface TerminalWindowProps {
  title: string
  commands: TerminalCommand[]
  className?: string
}

export function TerminalWindow({ title, commands, className }: TerminalWindowProps) {
  return (
    <div className={`rounded-lg overflow-hidden border border-border bg-card shadow-lg ${className || ""}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="flex-1 text-center font-mono text-xs text-muted-foreground/60">
          {title}
        </span>
      </div>

      {/* Terminal body */}
      <div className="bg-background p-5 space-y-4 font-mono text-sm">
        {commands.map((cmd, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.15 }}
          >
            {/* Command line */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[hsl(var(--status-green))]">{cmd.prompt}</span>
              <span className="text-foreground/90">{cmd.command}</span>
              <span className="cursor-blink text-primary">|</span>
            </div>
            {/* Output */}
            <div className="pl-0 text-muted-foreground">
              {cmd.output}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
