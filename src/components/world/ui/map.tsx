"use client"

import { useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Check, Navigation, Play, RotateCcw } from "lucide-react"
import { DISTRICTS, FEATURES, ISLAND_MAX_RADIUS, PATHS, PLAZA_RADIUS, TOKENS, districtCenter, islandRadius, type DistrictId } from "../world-config"
import { runtime } from "../systems/runtime"
import { useWorldStore } from "../store"
import { Dialog } from "./dialog"
import { buttonStyles } from "./primitives"

const VIEW = ISLAND_MAX_RADIUS + 2

function islandPath() {
  const steps = 120
  let d = ""
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const r = islandRadius(theta)
    d += `${i === 0 ? "M" : "L"}${(Math.sin(theta) * r).toFixed(2)} ${(-Math.cos(theta) * r).toFixed(2)} `
  }
  return d + "Z"
}

interface IslandMapProps {
  className?: string
  onSelect?: (id: DistrictId) => void
  showLabels?: boolean
  showPlayer?: boolean
  /** Hide from assistive tech when a parent control already describes it (minimap button). */
  decorative?: boolean
}

/** Top-down SVG of the island. Player position is written straight to the DOM each frame. */
export function IslandMap({ className, onSelect, showLabels = true, showPlayer = true, decorative = false }: IslandMapProps) {
  const outline = useMemo(islandPath, [])
  const player = useRef<SVGGElement>(null)
  const discovered = useWorldStore((state) => state.discovered)
  const current = useWorldStore((state) => state.currentDistrict)

  useEffect(() => {
    if (!showPlayer) return
    let frame = 0
    const tick = () => {
      const p = runtime.player
      player.current?.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.z.toFixed(2)}) rotate(${(-(p.yaw * 180) / Math.PI + 180).toFixed(1)})`)
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [showPlayer])

  return (
    <svg
      viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`}
      className={className}
      role={decorative ? undefined : onSelect ? "group" : "img"}
      aria-label={decorative ? undefined : "Map of Orbit Park"}
      aria-hidden={decorative || undefined}
    >
      <defs>
        <pattern id="map-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.32" fill="#30363D" />
        </pattern>
      </defs>
      <rect x={-VIEW} y={-VIEW} width={VIEW * 2} height={VIEW * 2} fill="url(#map-dots)" />
      <path d={outline} fill="#2F2C4A" stroke="#7C73A6" strokeWidth="0.9" />
      {PATHS.map((line) => (
        <polyline
          key={line.id}
          points={line.points.map(([x, z]) => `${x.toFixed(1)},${z.toFixed(1)}`).join(" ")}
          fill="none"
          stroke={line.kind === "promenade" ? "#D2A8FF" : "#F78166"}
          strokeOpacity="0.75"
          strokeWidth={line.kind === "avenue" ? 1.6 : 0.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      <circle r={PLAZA_RADIUS} fill="#2A313C" stroke="#F78166" strokeWidth="0.7" />
      {/* Attractions: rocket, wheel, orbiter, gate */}
      <path
        d={`M${FEATURES.rocket.position[0]} ${FEATURES.rocket.position[1] - 3} l2.4 4.6 h-4.8 Z`}
        fill="#E6EDF3"
        fillOpacity="0.8"
      />
      <circle cx={FEATURES.wheel.position[0]} cy={FEATURES.wheel.position[1]} r="3" fill="none" stroke="#E6EDF3" strokeOpacity="0.7" strokeWidth="0.6" />
      <circle cx={FEATURES.orbiter.position[0]} cy={FEATURES.orbiter.position[1]} r={FEATURES.orbiter.radius} fill="none" stroke="#D2A8FF" strokeOpacity="0.7" strokeWidth="0.6" />
      <rect x={-FEATURES.gate.halfWidth} y={FEATURES.gate.position[1] - 0.6} width={FEATURES.gate.halfWidth * 2} height="1.2" fill="#F78166" />
      {DISTRICTS.map((district) => {
        const [x, z] = districtCenter(district)
        const known = discovered.includes(district.id)
        const here = current === district.id
        const label = district.path
        const content = (
          <>
            <circle cx={x} cy={z} r={here ? 4.2 : 3.4} fill="#0D1117" stroke={district.color} strokeWidth={here ? 1.4 : 1} />
            {known && <path d={`M${x - 1.5} ${z} l1.1 1.1 l2.1 -2.2`} fill="none" stroke={district.color} strokeWidth="0.7" />}
            {showLabels && (
              <text x={x} y={z + (z > 0 ? 7.4 : -5.8)} textAnchor="middle" fontSize="3.6" fill="#E6EDF3" fontFamily="var(--font-mono), monospace">
                {label}
              </text>
            )}
          </>
        )
        return onSelect ? (
          <g
            key={district.id}
            role="button"
            tabIndex={0}
            aria-label={`Go to ${district.title}`}
            className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-[2.2]"
            onClick={() => onSelect(district.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect(district.id)
              }
            }}
          >
            {content}
          </g>
        ) : (
          <g key={district.id}>{content}</g>
        )
      })}
      {showPlayer && (
        <g ref={player}>
          <path d="M0 -2.7 L1.9 1.9 L0 0.85 L-1.9 1.9 Z" fill="#F78166" stroke="#0D1117" strokeWidth="0.5" />
        </g>
      )}
    </svg>
  )
}

export function MapOverlay({ restoreFocus }: { restoreFocus: () => HTMLElement | null }) {
  const browsing = useWorldStore((state) => state.browsing)
  const engine = useWorldStore((state) => state.engine)
  const phase = useWorldStore((state) => state.phase)
  const discovered = useWorldStore((state) => state.discovered)
  const tokens = useWorldStore((state) => state.tokens)
  const { setOverlay, openPanel, travelTo, stopBrowsing, enterWorld, resetProgress } = useWorldStore.getState()
  const playing = phase === "playing" && !browsing

  const close = () => (browsing ? stopBrowsing() : setOverlay(null))

  return (
    <Dialog
      variant="modal"
      wide
      label={browsing ? "directory" : "map"}
      title={browsing ? "Browse without playing" : "Park map"}
      subtitle={
        browsing
          ? "Every section of the 3D world as plain, readable pages."
          : `districts ${discovered.length}/${DISTRICTS.length} · tokens ${tokens.length}/${TOKENS.length}`
      }
      onClose={close}
      restoreFocus={restoreFocus}
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-2">
          <IslandMap
            className="w-full rounded-lg border border-border bg-[#0D1117]"
            onSelect={playing ? (id) => travelTo(id) : undefined}
            showPlayer={playing}
          />
          {playing && <p className="font-mono text-[11px] text-muted-foreground">Select a district on the map to fast-travel there.</p>}
        </div>
        <ul className="space-y-2">
          {DISTRICTS.map((district) => {
            const known = discovered.includes(district.id)
            return (
              <li key={district.id} className="card-accent flex items-center gap-3 rounded-lg px-3 py-2.5">
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: district.color }} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {district.title}
                    {known && <Check className="h-3.5 w-3.5 text-[hsl(var(--status-green))]" aria-label="discovered" />}
                  </p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">
                    {district.path} · {district.subtitle}
                  </p>
                </div>
                {playing && (
                  <button type="button" className={buttonStyles.link} onClick={() => travelTo(district.id)} aria-label={`Go to ${district.title}`}>
                    <Navigation className="h-3.5 w-3.5" /> Go
                  </button>
                )}
                <button
                  type="button"
                  className={`${buttonStyles.link} border-primary/50 text-primary`}
                  onClick={() => (playing ? travelTo(district.id, true) : openPanel(district.panel))}
                  aria-label={`Read ${district.title}`}
                >
                  <BookOpen className="h-3.5 w-3.5" /> Read
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        {browsing && engine === "ready" && (
          <button type="button" className={buttonStyles.primary} onClick={enterWorld}>
            <Play className="h-4 w-4" /> Enter the 3D world
          </button>
        )}
        <Link href="/" className={buttonStyles.outline}>
          <ArrowLeft className="h-4 w-4" /> Back to main portfolio
        </Link>
        {playing && (
          <button type="button" className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline" onClick={resetProgress}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset progress
          </button>
        )}
      </div>
    </Dialog>
  )
}

export function Minimap() {
  const setOverlay = useWorldStore((state) => state.setOverlay)
  return (
    <button
      type="button"
      onClick={() => setOverlay("map")}
      className="pointer-events-auto block overflow-hidden rounded-lg border border-border bg-[#0D1117]/95 shadow-lg transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Open the park map (M)"
    >
      <IslandMap className="h-[150px] w-[150px]" showLabels={false} decorative />
    </button>
  )
}
