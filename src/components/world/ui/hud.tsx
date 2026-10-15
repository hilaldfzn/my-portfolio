"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Flag, GitBranch, Hexagon, Map as MapIcon, Maximize, Menu, Minimize, MapPin } from "lucide-react"
import { DISTRICTS, DISTRICT_BY_ID, INTERACTABLES, TOKENS } from "../world-config"
import { useWorldStore } from "../store"
import { Minimap } from "./map"
import { Kbd, buttonStyles } from "./primitives"

function useFullscreen() {
  const [active, setActive] = useState(false)
  const [supported, setSupported] = useState(false)
  useEffect(() => {
    setSupported(Boolean(document.fullscreenEnabled))
    const onChange = () => setActive(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])
  const toggle = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined)
    else document.documentElement.requestFullscreen().catch(() => undefined)
  }
  return { active, supported, toggle }
}

export function TopBar() {
  const touch = useWorldStore((state) => state.touch)
  const setOverlay = useWorldStore((state) => state.setOverlay)
  const fullscreen = useFullscreen()
  return (
    <nav aria-label="Island controls" className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
      <Link href="/" className={buttonStyles.hud}>
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Main portfolio</span>
        <span className="sm:hidden">Main</span>
      </Link>
      <div className="flex flex-col items-end gap-3">
        <div className="flex gap-2">
          <button type="button" className={buttonStyles.hud} onClick={() => setOverlay("map")} aria-label="Open map and directory (M)">
            <MapIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Map</span>
            {!touch && <Kbd className="hidden sm:inline-flex">M</Kbd>}
          </button>
          <button type="button" className={buttonStyles.hud} onClick={() => setOverlay("pause")} aria-label="Open menu (Esc)">
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Menu</span>
            {!touch && <Kbd className="hidden sm:inline-flex">Esc</Kbd>}
          </button>
          {fullscreen.supported && !touch && (
            <button
              type="button"
              className={buttonStyles.hud}
              onClick={fullscreen.toggle}
              aria-label={fullscreen.active ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen.active ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          )}
        </div>
        <div className="hidden md:block">
          <Minimap />
        </div>
      </div>
    </nav>
  )
}

export function StatusBar() {
  const current = useWorldStore((state) => state.currentDistrict)
  const discovered = useWorldStore((state) => state.discovered)
  const tokens = useWorldStore((state) => state.tokens)
  const touch = useWorldStore((state) => state.touch)
  const where = !current ? "trail" : current === "home" ? "home" : DISTRICT_BY_ID[current].path
  return (
    <footer className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex h-8 items-center gap-3 border-t border-border bg-card px-3 font-mono text-[11px] text-muted-foreground sm:gap-4 sm:px-4">
      <span className="flex items-center gap-1.5 text-primary">
        <GitBranch className="h-3.5 w-3.5" /> main
      </span>
      <span className="flex min-w-0 items-center gap-1.5 truncate">
        <MapPin className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">inference-island/{where}</span>
      </span>
      <span className="ml-auto flex items-center gap-3 sm:gap-4">
        <span className="flex items-center gap-1" title="Districts discovered">
          <Flag className="h-3 w-3 text-primary sm:hidden" />
          <span className="hidden sm:inline">districts</span>
          <span className="text-foreground">
            {discovered.length}/{DISTRICTS.length}
          </span>
        </span>
        <span className="flex items-center gap-1" title="Skill tokens collected">
          <Hexagon className="h-3 w-3 text-accent" />
          <span className="text-foreground">
            {tokens.length}/{TOKENS.length}
          </span>
        </span>
        {!touch && (
          <span className="hidden items-center gap-3 lg:flex">
            <span>E interact</span>
            <span>M map</span>
            <span>Esc menu</span>
          </span>
        )}
      </span>
    </footer>
  )
}

export function InteractionPrompt() {
  const nearby = useWorldStore((state) => state.nearby)
  const panel = useWorldStore((state) => state.panel)
  const overlay = useWorldStore((state) => state.overlay)
  const touch = useWorldStore((state) => state.touch)
  const openPanel = useWorldStore((state) => state.openPanel)
  const item = nearby ? INTERACTABLES.find((i) => i.id === nearby) : null
  if (!item || panel || overlay) return null
  const district = DISTRICT_BY_ID[item.district]
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-52 z-20 flex justify-center px-4 sm:bottom-14">
      <button
        type="button"
        onClick={() => openPanel(item.panel)}
        className="pointer-events-auto flex max-w-full items-center gap-3 rounded-md border border-primary/60 bg-card/95 py-2 pl-2 pr-4 text-left shadow-xl transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {touch ? (
          <span className="flex h-8 items-center rounded bg-primary px-2 font-mono text-xs font-medium text-primary-foreground">Open</span>
        ) : (
          <Kbd className="h-8 min-w-[2rem] border-primary/60 text-primary">E</Kbd>
        )}
        <span className="min-w-0">
          <span className="block font-mono text-[11px] text-primary">{district.path}</span>
          <span className="block truncate text-sm font-semibold text-foreground">{item.label}</span>
        </span>
      </button>
    </div>
  )
}

export function Toasts() {
  const toasts = useWorldStore((state) => state.toasts)
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-30 flex flex-col items-center gap-2 px-4 sm:top-4" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="fade-in-up flex max-w-sm items-center gap-3 rounded-md border border-border bg-card/95 px-4 py-2.5 shadow-xl"
          style={{ borderLeftColor: toast.tone === "token" ? "hsl(var(--accent))" : toast.tone === "district" ? "hsl(var(--primary))" : "hsl(var(--status-green))", borderLeftWidth: 2 }}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{toast.title}</p>
            {toast.detail && <p className="truncate font-mono text-[11px] text-muted-foreground">{toast.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export function FadeOverlay() {
  const fading = useWorldStore((state) => state.fading)
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 bg-[#0D1117] transition-opacity duration-150"
      style={{ opacity: fading ? 1 : 0 }}
    />
  )
}
