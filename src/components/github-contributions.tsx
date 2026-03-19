"use client"

import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { TerminalWindow } from "./terminal-window"

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  { ssr: false, loading: () => <div className="h-32 flex items-center justify-center font-mono text-xs text-muted-foreground">Loading contributions...</div> }
)

export function GitHubContributions() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <TerminalWindow
      title="hilal@dev:~/github"
      commands={[
        {
          prompt: "$",
          command: "display-contributions --calendar --user hilaldfzn",
          output: (
            <div className="overflow-x-auto py-2">
              <GitHubCalendar
                username="hilaldfzn"
                colorScheme={isDark ? "dark" : "light"}
                blockSize={12}
                blockMargin={4}
                fontSize={13}
                theme={{
                  dark: [
                    "#161b22",
                    "hsl(14, 90%, 68%, 0.25)",
                    "hsl(14, 90%, 68%, 0.5)",
                    "hsl(14, 90%, 68%, 0.75)",
                    "hsl(14, 90%, 68%)",
                  ],
                  light: [
                    "#ebedf0",
                    "hsl(14, 65%, 50%, 0.25)",
                    "hsl(14, 65%, 50%, 0.5)",
                    "hsl(14, 65%, 50%, 0.75)",
                    "hsl(14, 65%, 50%)",
                  ],
                }}
              />
            </div>
          ),
        },
        {
          prompt: "$",
          command: "cat status.txt",
          output: (
            <div className="flex items-center gap-2 py-1">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--status-green))] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--status-green))]" />
              </span>
              <span className="text-[hsl(var(--status-green))]">Available for opportunities</span>
            </div>
          ),
        },
      ]}
    />
  )
}
