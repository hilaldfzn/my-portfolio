"use client"

import { Component, useCallback, useEffect, useRef, type ReactNode } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { RefreshCw } from "lucide-react"
import { SPAWN, INTERACTABLES } from "./world-config"
import { useWorldStore } from "./store"
import { clearMovementInput, resetRuntime, runtime } from "./systems/runtime"
import { supportsWebGL } from "./systems/webgl"
import { EntryScreen } from "./ui/entry-screen"
import { FadeOverlay, InteractionPrompt, StatusBar, Toasts, TopBar } from "./ui/hud"
import { MapOverlay } from "./ui/map"
import { Onboarding, PauseMenu, TouchControls } from "./ui/menus"
import { Dialog } from "./ui/dialog"
import { PanelBody, panelHeader } from "./ui/panels"
import { buttonStyles } from "./ui/primitives"

// three.js, R3F and the scene only download when this route renders on the client.
const WorldCanvas = dynamic(() => import("./scene/world-canvas"), { ssr: false })

class CanvasBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

const MOVEMENT_KEYS: Record<string, keyof typeof runtime.input> = {
  KeyW: "up",
  ArrowUp: "up",
  KeyS: "down",
  ArrowDown: "down",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  ShiftLeft: "run",
  ShiftRight: "run",
}

export function PlayablePortfolio() {
  const engine = useWorldStore((state) => state.engine)
  const phase = useWorldStore((state) => state.phase)
  const browsing = useWorldStore((state) => state.browsing)
  const overlay = useWorldStore((state) => state.overlay)
  const panel = useWorldStore((state) => state.panel)
  const touch = useWorldStore((state) => state.touch)
  const game = useRef<HTMLDivElement>(null)
  const restoreFocus = useCallback(() => game.current, [])

  // Environment detection, saved progress, and full-viewport layout.
  useEffect(() => {
    const store = useWorldStore.getState()
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const coarse = window.matchMedia("(pointer: coarse)")
    const sync = () => store.setEnvironment({ reducedMotion: reduced.matches, touch: coarse.matches })
    sync()
    reduced.addEventListener("change", sync)
    coarse.addEventListener("change", sync)
    store.hydrate()
    resetRuntime(SPAWN.position, SPAWN.yaw, SPAWN)

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!supportsWebGL()) store.setEngine("unsupported")
    else store.setEngine(connection?.saveData ? "idle" : "loading")

    const html = document.documentElement
    const previous = { overflow: html.style.overflow, overscroll: html.style.overscrollBehavior }
    html.style.overflow = "hidden"
    html.style.overscrollBehavior = "none"
    return () => {
      reduced.removeEventListener("change", sync)
      coarse.removeEventListener("change", sync)
      html.style.overflow = previous.overflow
      html.style.overscrollBehavior = previous.overscroll
    }
  }, [])

  // Keyboard: movement and shortcuts. Dialogs own the keyboard while open (arrow keys scroll them).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const state = useWorldStore.getState()
      const target = event.target as HTMLElement | null
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return

      if (event.key === "Escape") {
        if (state.panel) state.closePanel()
        else if (state.overlay) state.browsing ? state.stopBrowsing() : state.setOverlay(null)
        else if (state.phase === "playing") state.setOverlay("pause")
        return
      }
      if (state.phase !== "playing" || state.browsing || state.panel) return
      if (event.code === "KeyM") {
        if (!state.overlay || state.overlay === "map") state.toggleMap()
        return
      }
      if (state.overlay || event.metaKey || event.ctrlKey || event.altKey) return

      const onControl = Boolean(target?.closest("button, a"))
      const movement = MOVEMENT_KEYS[event.code]
      if (movement) {
        ;(runtime.input[movement] as boolean) = true
        if (event.code.startsWith("Arrow")) event.preventDefault()
        return
      }
      if (event.code === "Space" && !onControl) {
        event.preventDefault()
        runtime.input.jumpQueued = true
        return
      }
      if (event.code === "KeyE" || (event.code === "Enter" && !onControl)) {
        const item = INTERACTABLES.find((i) => i.id === state.nearby)
        if (item) {
          event.preventDefault()
          state.openPanel(item.panel)
        }
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      const movement = MOVEMENT_KEYS[event.code]
      if (movement) (runtime.input[movement] as boolean) = false
    }
    const onBlur = () => clearMovementInput()
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onBlur)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onBlur)
    }
  }, [])

  // Opening any dialog releases held keys so the robot doesn't keep walking afterwards.
  useEffect(() => {
    if (panel || overlay) clearMovementInput()
  }, [panel, overlay])

  const enter = () => {
    useWorldStore.getState().enterWorld()
    requestAnimationFrame(() => game.current?.focus({ preventScroll: true }))
  }

  const showCanvas = engine === "loading" || engine === "ready"
  const playing = phase === "playing" && !browsing
  const header = panel ? panelHeader(panel) : null

  return (
    <main className="dark fixed inset-0 overflow-hidden bg-[#0D1117] font-body text-foreground">
      <div ref={game} tabIndex={-1} role="application" className="absolute inset-0 outline-none" aria-label="Orbit Park 3D view">
        {showCanvas && (
          <CanvasBoundary onError={() => useWorldStore.getState().setEngine("error")}>
            <WorldCanvas />
          </CanvasBoundary>
        )}
      </div>

      {phase === "entry" && !browsing && <EntryScreen onEnter={enter} />}

      {playing && (
        <>
          <TopBar />
          <StatusBar />
          <InteractionPrompt />
          <Onboarding />
          {touch && <TouchControls />}
        </>
      )}

      <Toasts />
      {(overlay === "map" || (browsing && !panel)) && <MapOverlay restoreFocus={restoreFocus} />}
      {overlay === "pause" && <PauseMenu restoreFocus={restoreFocus} />}
      {panel && header && (
        <Dialog
          variant={browsing ? "modal" : "drawer"}
          wide={false}
          label={header.label}
          title={header.title}
          subtitle={header.subtitle}
          onClose={() => useWorldStore.getState().closePanel()}
          restoreFocus={restoreFocus}
          contentKey={JSON.stringify(panel)}
        >
          <PanelBody panel={panel} onClose={() => useWorldStore.getState().closePanel()} />
        </Dialog>
      )}
      <FadeOverlay />

      {engine === "context-lost" && (
        <div role="alert" className="absolute inset-0 z-50 flex items-center justify-center bg-[#0D1117]/90 p-6">
          <div className="max-w-sm space-y-4 rounded-lg border border-border bg-card p-6">
            <p className="section-label">{"// gpu"}</p>
            <p className="font-display text-2xl text-foreground">The 3D view stopped</p>
            <p className="text-sm text-muted-foreground">
              The browser reclaimed the graphics context. Reload to continue, or browse the content without the 3D view.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={buttonStyles.primary} onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4" /> Reload
              </button>
              <Link href="/" className={buttonStyles.outline}>
                Main portfolio
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
