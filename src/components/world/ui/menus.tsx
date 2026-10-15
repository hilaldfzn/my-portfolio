"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUp, Map as MapIcon, Play, RotateCcw } from "lucide-react"
import { DISTRICTS, TOKENS } from "../world-config"
import { runtime } from "../systems/runtime"
import { useWorldStore } from "../store"
import { Dialog } from "./dialog"
import { Kbd, buttonStyles } from "./primitives"

export function ControlsLegend({ touch, compact = false }: { touch: boolean; compact?: boolean }) {
  // [key, short label, full label]
  const rows: [ReactNode, string, string][] = touch
    ? [
        ["Joystick", "move", "move (push further to run)"],
        ["Drag", "look", "look around · pinch to zoom"],
        ["Tap ground", "walk there", "walk to that spot"],
        ["Open", "read", "read what's nearby"],
        ["Jump", "jump", "jump"],
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
        ["Drag · scroll", "look · zoom", "look around · zoom"],
        ["Click", "walk there", "walk to a spot or object"],
      ]
  if (compact) {
    return (
      <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
        {rows.map(([key, short], index) => (
          <li key={index} className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="flex items-center text-foreground">{key}</span>
            {short}
          </li>
        ))}
      </ul>
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
    body: "You're a guest agent on Inference Island. Every building here is made from Hilal's real work: the AI lab, the engineering workshop, the project gallery, and more.",
  },
  {
    label: "controls",
    body: touch
      ? "Use the joystick to move and drag the scene to look around. When something is nearby, tap Open to read it."
      : "Move with WASD or the arrow keys, hold Shift to run, and drag to look around. Press E next to anything glowing to read it.",
  },
  {
    label: "objective",
    body: `Visit all ${DISTRICTS.length} districts and collect ${TOKENS.length} skill tokens. In a hurry? Press M (or Map) anytime to jump straight to any section.`,
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

export function PauseMenu({ restoreFocus }: { restoreFocus: () => HTMLElement | null }) {
  const touch = useWorldStore((state) => state.touch)
  const discovered = useWorldStore((state) => state.discovered)
  const tokens = useWorldStore((state) => state.tokens)
  const { setOverlay, resetProgress } = useWorldStore.getState()
  return (
    <Dialog
      variant="modal"
      label="menu"
      title="Paused"
      subtitle={`districts ${discovered.length}/${DISTRICTS.length} · tokens ${tokens.length}/${TOKENS.length}`}
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
          <p className="text-xs leading-relaxed text-muted-foreground">
            3D models: Kenney Space, Factory, Furniture and Nature kits (CC0) and RobotExpressive by Tomás Laulhé /
            Quaternius (CC0). Island, paths and signage are procedural. Built with three.js and React Three Fiber.
          </p>
          <button type="button" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline" onClick={resetProgress}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset progress
          </button>
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
