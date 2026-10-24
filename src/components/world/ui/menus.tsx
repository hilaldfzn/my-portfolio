"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUp, Map as MapIcon, Play, RotateCcw } from "lucide-react"
import { DISTRICTS, PARK_NAME, TOKENS } from "../world-config"
import { runtime } from "../systems/runtime"
import { useWorldStore } from "../store"
import { Dialog } from "./dialog"
import { Kbd, buttonStyles } from "./primitives"

export function ControlsLegend({ touch, compact = false }: { touch: boolean; compact?: boolean }) {
  // [keys, short label, full label]
  const rows: [ReactNode, string, string][] = touch
    ? [
        [<Kbd key="joystick">Joystick</Kbd>, "move", "move (push further to run)"],
        [<Kbd key="drag">Drag</Kbd>, "look", "look around · pinch to zoom"],
        [<Kbd key="tap">Tap ground</Kbd>, "walk there", "walk to that spot"],
        [<Kbd key="open">Open</Kbd>, "read", "read what's nearby"],
        [<Kbd key="jump">Jump</Kbd>, "jump", "jump"],
      ]
    : [
        [
          <span key="move" className="flex gap-1">
            <Kbd>W</Kbd>
            <Kbd>A</Kbd>
            <Kbd>S</Kbd>
            <Kbd>D</Kbd>
          </span>,
          "move",
          "move (or arrow keys)",
        ],
        [<Kbd key="run">Shift</Kbd>, "run", "run"],
        [<Kbd key="jump">Space</Kbd>, "jump", "jump"],
        [<Kbd key="e">E</Kbd>, "open", "open what's nearby"],
        [<Kbd key="m">M</Kbd>, "map", "map & fast travel"],
        [<Kbd key="esc">Esc</Kbd>, "menu", "close · menu"],
        [
          <span key="look" className="flex gap-1">
            <Kbd>Drag</Kbd>
            <Kbd>Scroll</Kbd>
          </span>,
          "look · zoom",
          "look around · zoom",
        ],
        [<Kbd key="click">Click</Kbd>, "walk there", "walk to a spot or object"],
      ]
  if (compact) {
    // Two aligned columns of key → action pairs.
    return (
      <dl className="grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5">
        {rows.map(([key, short], index) => (
          <div key={index} className="contents">
            <dt className="flex items-center">{key}</dt>
            <dd className="font-mono text-xs text-muted-foreground">{short}</dd>
          </div>
        ))}
      </dl>
    )
  }
  return (
    <dl className="grid grid-cols-1 gap-2">
      {rows.map(([key, , full], index) => (
        <div key={index} className="flex items-center gap-3">
          <dt className="flex min-w-[7.5rem] items-center font-mono text-xs text-foreground">{key}</dt>
          <dd className="font-mono text-xs text-muted-foreground">{full}</dd>
        </div>
      ))}
    </dl>
  )
}

const STEPS = (touch: boolean) => [
  {
    label: "system",
    body: `Welcome to ${PARK_NAME}, guest agent. Every land in this park is built from Hilal's real work: GDP Labs, bitcorp., Universitas Indonesia, his projects, articles, and more.`,
  },
  {
    label: "controls",
    body: touch
      ? "Use the joystick to move and drag the scene to look around. When something is nearby, tap Open to read it."
      : "Move with WASD or the arrow keys, hold Shift to run, and drag to look around. Press E next to anything glowing to read it.",
  },
  {
    label: "objective",
    body: `Visit all ${DISTRICTS.length} lands and collect ${TOKENS.length} skill tokens along the paths. In a hurry? Press M (or Map) anytime to jump straight to any section.`,
  },
]

export function Onboarding() {
  const step = useWorldStore((state) => state.onboardingStep)
  const touch = useWorldStore((state) => state.touch)
  const panel = useWorldStore((state) => state.panel)
  const overlay = useWorldStore((state) => state.overlay)
  const { advanceOnboarding, finishOnboarding } = useWorldStore.getState()
  if (step === null || panel || overlay) return null
  const steps = STEPS(touch)
  const current = steps[step]
  return (
    <section
      aria-label="Introduction"
      className="pointer-events-auto absolute inset-x-3 top-16 z-20 mx-auto max-w-md rounded-lg border border-border bg-card/95 p-5 shadow-2xl sm:top-auto sm:bottom-24 sm:left-4 sm:right-auto sm:mx-0"
    >
      <p className="font-mono text-xs text-primary">
        {">"} {current.label} <span className="text-muted-foreground">({step + 1}/{steps.length})</span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">{current.body}</p>
      <div className="mt-4 flex items-center justify-between">
        <button type="button" onClick={finishOnboarding} className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
          Skip
        </button>
        <button type="button" onClick={advanceOnboarding} className={`${buttonStyles.primary} h-9 px-4 text-xs`}>
          {step === steps.length - 1 ? "Start exploring" : "Next"}
        </button>
      </div>
    </section>
  )
}

export function ResetProgressButton({ className }: { className?: string }) {
  const resetProgress = useWorldStore((state) => state.resetProgress)
  return (
    <button
      type="button"
      className={className ?? "inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"}
      onClick={resetProgress}
    >
      <RotateCcw className="h-3.5 w-3.5" /> Reset progress
    </button>
  )
}

const CREDITS = [
  "3D models: Kenney Space, Factory, Furniture, Food and Nature kits (CC0)",
  "Player robot: RobotExpressive by Tomás Laulhé / Quaternius (CC0)",
  "Procedural: island, paths, signage, stalls, benches and bookcases",
  "Built with three.js and React Three Fiber",
]

export function PauseMenu({ restoreFocus }: { restoreFocus: () => HTMLElement | null }) {
  const touch = useWorldStore((state) => state.touch)
  const discovered = useWorldStore((state) => state.discovered)
  const tokens = useWorldStore((state) => state.tokens)
  const { setOverlay } = useWorldStore.getState()
  return (
    <Dialog
      variant="modal"
      label="menu"
      title="Paused"
      subtitle={`districts ${discovered.length}/${DISTRICTS.length} · tokens ${tokens.length}/${TOKENS.length}`}
      headerAction={<ResetProgressButton />}
      onClose={() => setOverlay(null)}
      restoreFocus={restoreFocus}
    >
      <div className="space-y-6">
        <div className="grid gap-2">
          <button type="button" className={`${buttonStyles.primary} w-full`} onClick={() => setOverlay(null)}>
            <Play className="h-4 w-4" /> Resume
          </button>
          <button type="button" className={`${buttonStyles.outline} w-full`} onClick={() => setOverlay("map")}>
            <MapIcon className="h-4 w-4" /> Map & directory
          </button>
          <Link href="/" className={`${buttonStyles.outline} w-full`}>
            <ArrowLeft className="h-4 w-4" /> Back to main portfolio
          </Link>
        </div>
        <section className="space-y-3">
          <p className="font-mono text-xs text-muted-foreground">{"// controls"}</p>
          <ControlsLegend touch={touch} />
        </section>
        <section className="space-y-2 border-t border-border pt-4">
          <p className="font-mono text-xs text-muted-foreground">{"// credits"}</p>
          <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground marker:text-primary/70">
            {CREDITS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </div>
    </Dialog>
  )
}

const JOYSTICK_RADIUS = 52

export function TouchControls() {
  const base = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const pointer = useRef<number | null>(null)
  const panel = useWorldStore((state) => state.panel)
  const overlay = useWorldStore((state) => state.overlay)

  useEffect(() => {
    if (panel || overlay) {
      runtime.input.joystickX = runtime.input.joystickY = 0
      setKnob({ x: 0, y: 0 })
      pointer.current = null
    }
  }, [panel, overlay])

  const update = (clientX: number, clientY: number) => {
    const rect = base.current!.getBoundingClientRect()
    let dx = clientX - (rect.left + rect.width / 2)
    let dy = clientY - (rect.top + rect.height / 2)
    const length = Math.hypot(dx, dy)
    if (length > JOYSTICK_RADIUS) {
      dx = (dx / length) * JOYSTICK_RADIUS
      dy = (dy / length) * JOYSTICK_RADIUS
    }
    setKnob({ x: dx, y: dy })
    runtime.input.joystickX = dx / JOYSTICK_RADIUS
    runtime.input.joystickY = -dy / JOYSTICK_RADIUS
  }
  const release = () => {
    pointer.current = null
    setKnob({ x: 0, y: 0 })
    runtime.input.joystickX = runtime.input.joystickY = 0
  }

  if (panel || overlay) return null
  return (
    <>
      <div
        ref={base}
        role="application"
        aria-label="Movement joystick"
        className="pointer-events-auto absolute bottom-14 left-5 z-20 h-32 w-32 touch-none rounded-full border border-border bg-card/60"
        onPointerDown={(event) => {
          pointer.current = event.pointerId
          event.currentTarget.setPointerCapture(event.pointerId)
          update(event.clientX, event.clientY)
        }}
        onPointerMove={(event) => {
          if (pointer.current === event.pointerId) update(event.clientX, event.clientY)
        }}
        onPointerUp={release}
        onPointerCancel={release}
      >
        <div
          className="absolute left-1/2 top-1/2 h-14 w-14 rounded-full border border-primary/70 bg-primary/25"
          style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
        />
      </div>
      <button
        type="button"
        aria-label="Jump"
        className="pointer-events-auto absolute bottom-16 right-5 z-20 flex h-16 w-16 touch-none items-center justify-center rounded-full border border-border bg-card/80 text-foreground active:bg-primary/30"
        onPointerDown={(event) => {
          event.preventDefault()
          runtime.input.jumpQueued = true
        }}
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </>
  )
}
