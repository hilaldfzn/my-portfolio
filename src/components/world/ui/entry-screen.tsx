"use client"

import Link from "next/link"
import { ArrowLeft, BookOpen, Download, Play, RefreshCw } from "lucide-react"
import { profile } from "../../../content/profile"
import { PARK_NAME } from "../world-config"
import { useWorldStore } from "../store"
import { ControlsLegend } from "./menus"
import { buttonStyles } from "./primitives"

function ProgressLine({ value, label }: { value: number; label: string }) {
  const cells = 20
  const filled = Math.round((value / 100) * cells)
  return (
    <p className="font-mono text-xs text-muted-foreground" role="status" aria-live="polite">
      <span className="text-primary" aria-hidden="true">
        [{"█".repeat(filled)}
        <span className="text-border">{"░".repeat(cells - filled)}</span>]
      </span>{" "}
      {Math.round(value)}% <span className="hidden sm:inline">· {label}</span>
    </p>
  )
}

export function EntryScreen({ onEnter }: { onEnter: () => void }) {
  const engine = useWorldStore((state) => state.engine)
  const progress = useWorldStore((state) => state.loadProgress)
  const touch = useWorldStore((state) => state.touch)
  const { startBrowsing, setEngine } = useWorldStore.getState()
  const ready = engine === "ready"
  const unavailable = engine === "unsupported" || engine === "error"

  return (
    <section className="pointer-events-none absolute inset-0 z-20 flex items-end sm:items-center" aria-labelledby="entry-title">
      <div className="pointer-events-auto max-h-[92dvh] w-full overflow-y-auto border-t border-border bg-[#0D1117]/95 p-6 sm:m-8 sm:max-w-[34rem] sm:rounded-lg sm:border sm:p-8 lg:ml-14">
        <p className="section-label">{"// playable portfolio"}</p>
        <h1 id="entry-title" className="mt-2 font-display text-5xl leading-none text-foreground sm:text-6xl">
          {PARK_NAME}
        </h1>
        <p className="mt-4 font-body text-base font-semibold text-foreground">{profile.name}</p>
        <p className="font-mono text-sm text-muted-foreground">{profile.headline}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          A space theme park built from my work. Ride past my internships at GDP Labs and bitcorp., my campus life at
          Universitas Indonesia, the project hangar and the article library, collect a token for every skill, or skip
          straight to any section.
        </p>

        {engine === "unsupported" && (
          <p className="mt-5 rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
            This browser or device can&apos;t run WebGL, so the 3D world is unavailable here. Everything in it is still
            readable below, or on the main portfolio.
          </p>
        )}
        {engine === "error" && (
          <p className="mt-5 rounded-md border border-destructive/50 bg-card p-3 text-sm text-muted-foreground">
            The 3D world failed to load. You can retry, browse its content without the 3D view, or head back.
          </p>
        )}
        {engine === "idle" && (
          <p className="mt-5 rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
            Data saver is on, so nothing has been downloaded yet. The world needs about 1.5 MB of models and
            images.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {engine === "idle" && (
            <button type="button" className={buttonStyles.primary} onClick={() => setEngine("loading")}>
              <Download className="h-4 w-4" /> Load 3D world
            </button>
          )}
          {engine === "error" && (
            <button type="button" className={buttonStyles.primary} onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          )}
          {!unavailable && engine !== "idle" && (
            <button type="button" className={buttonStyles.primary} onClick={onEnter} disabled={!ready} aria-disabled={!ready}>
              <Play className="h-4 w-4" />
              {ready ? "Enter world" : "Loading world…"}
            </button>
          )}
          <button type="button" className={unavailable ? buttonStyles.primary : buttonStyles.outline} onClick={startBrowsing}>
            <BookOpen className="h-4 w-4" /> Browse without playing
          </button>
        </div>

        {(engine === "loading" || engine === "checking") && (
          <div className="mt-4">
            <ProgressLine value={progress} label={progress < 1 ? "loading engine" : "loading models and screenshots"} />
          </div>
        )}

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to main portfolio
        </Link>

        {!unavailable && (
          <div className="mt-6 border-t border-border pt-5">
            <p className="mb-3 font-mono text-xs text-muted-foreground">{touch ? "// touch controls" : "// controls"}</p>
            <ControlsLegend touch={touch} compact />
          </div>
        )}
      </div>
    </section>
  )
}
