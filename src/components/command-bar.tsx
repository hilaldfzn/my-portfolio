"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useTypewriter } from "../hooks/use-typewriter"

const COMMANDS: Record<string, { action: string; target?: string }> = {
  "goto home": { action: "scroll", target: "#home" },
  "goto about": { action: "scroll", target: "#about" },
  "goto skills": { action: "scroll", target: "#skills" },
  "goto experiences": { action: "scroll", target: "#experiences" },
  "goto awards": { action: "scroll", target: "#awards" },
  "goto projects": { action: "scroll", target: "#projects" },
  "goto articles": { action: "scroll", target: "#articles" },
  "goto contact": { action: "scroll", target: "#contact" },
  "goto github": { action: "scroll", target: "#github" },
  "theme dark": { action: "theme", target: "dark" },
  "theme light": { action: "theme", target: "light" },
  "ls skills": { action: "scroll", target: "#skills" },
  "clear": { action: "clear" },
}

export function CommandBar() {
  const [input, setInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [feedback, setFeedback] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { setTheme } = useTheme()

  const placeholder = useTypewriter({
    texts: [
      "goto projects",
      "theme dark",
      "ls skills",
      "goto contact",
    ],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseDuration: 2500,
  })

  const executeCommand = useCallback((cmd: string) => {
    const normalized = cmd.trim().toLowerCase()
    const match = COMMANDS[normalized]

    if (!match) {
      setFeedback(`command not found: ${normalized}`)
      setTimeout(() => setFeedback(""), 2000)
      return
    }

    if (match.action === "scroll" && match.target) {
      const el = document.querySelector(match.target)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        setFeedback("")
      }
    } else if (match.action === "theme" && match.target) {
      setTheme(match.target)
      setFeedback(`theme set to ${match.target}`)
      setTimeout(() => setFeedback(""), 2000)
    } else if (match.action === "clear") {
      setFeedback("")
    }

    setInput("")
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input)
    }
    if (e.key === "Escape") {
      setInput("")
      inputRef.current?.blur()
    }
  }

  // Global keyboard shortcut: Ctrl+K or Cmd+K to focus
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [])

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-10 gap-3">
          {/* Education info */}
          <span className="font-mono text-[10px] text-muted-foreground/50 flex-shrink-0 select-none hidden sm:block">
            CS @ Universitas Indonesia
          </span>

          <div className="h-3.5 w-px bg-border/50 flex-shrink-0 hidden sm:block" />

          {/* Prompt indicator */}
          <span className="font-mono text-xs text-primary flex-shrink-0 select-none">
            {">_"}
          </span>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? "" : placeholder}
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-foreground placeholder:text-muted-foreground/40"
            aria-label="Command bar"
          />

          {/* Blinking cursor when focused and empty */}
          {isFocused && input.length === 0 && (
            <span className="cursor-blink font-mono text-xs text-primary select-none">|</span>
          )}

          {/* Feedback */}
          {feedback && (
            <span className="font-mono text-xs text-muted-foreground flex-shrink-0">
              {feedback}
            </span>
          )}

          {/* Keyboard shortcut hint */}
          {!isFocused && (
            <span className="font-mono text-xs text-muted-foreground/40 flex-shrink-0 hidden sm:block select-none">
              Ctrl+K
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
