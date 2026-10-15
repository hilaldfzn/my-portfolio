"use client"

import { useEffect, useMemo } from "react"
import * as THREE from "three"
import { COLORS } from "../world-config"
import { SHARED } from "./materials"

type FontVariable = "--font-mono" | "--font-display" | "--font-body"

const FALLBACKS: Record<FontVariable, string> = {
  "--font-mono": "Menlo, monospace",
  "--font-display": "Georgia, serif",
  "--font-body": "system-ui, sans-serif",
}

/** Resolves the next/font family behind one of the site's CSS font variables. */
export function fontFamily(variable: FontVariable) {
  if (typeof document === "undefined") return FALLBACKS[variable]
  const value = getComputedStyle(document.body).getPropertyValue(variable).trim()
  return value ? `${value}, ${FALLBACKS[variable]}` : FALLBACKS[variable]
}

let fontsReady: Promise<void> | null = null
export function ensureFonts() {
  if (!fontsReady) {
    fontsReady = Promise.all([
      document.fonts.load(`500 32px ${fontFamily("--font-mono")}`),
      document.fonts.load(`400 32px ${fontFamily("--font-display")}`),
      document.fonts.load(`600 32px ${fontFamily("--font-body")}`),
    ])
      .then(() => undefined)
      .catch(() => undefined)
  }
  return fontsReady
}

const imageLoader = new THREE.ImageLoader()
const imageCache = new Map<string, Promise<HTMLImageElement>>()
/** Loads through three's DefaultLoadingManager so images count toward the loading bar. */
export function loadImage(url: string) {
  if (!imageCache.has(url)) {
    imageCache.set(url, new Promise((resolve, reject) => imageLoader.load(url, resolve, undefined, reject)))
  }
  return imageCache.get(url)!
}

export function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / image.width, h / image.height)
  const sw = w / scale
  const sh = h / scale
  ctx.drawImage(image, (image.width - sw) / 2, (image.height - sh) / 2, sw, sh, x, y, w, h)
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ")
  const lines: string[] = []
  let line = ""
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

type Draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => void | Promise<void>

/** A CanvasTexture redrawn once fonts (and any images the draw call awaits) are ready. */
export function useCanvasTexture(width: number, height: number, draw: Draw, key: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, key])

  useEffect(() => {
    let cancelled = false
    const canvas = texture.image as HTMLCanvasElement
    const ctx = canvas.getContext("2d")!
    ensureFonts().then(async () => {
      if (cancelled) return
      await draw(ctx, width, height)
      if (!cancelled) texture.needsUpdate = true
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texture])

  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

// ---------------------------------------------------------------------------
// Signboard: the main site's card motif (ink card, 1px border, coral left accent), mounted
// low on a plinth like a theme-park land marker.
// ---------------------------------------------------------------------------

const PLINTH_HEIGHT = 0.42
const BOARD_TILT = -0.14

interface SignProps {
  label: string
  title: string
  subtitle?: string
  color?: string
  position: [number, number, number]
  rotation?: number
  width?: number
}

export function SignBoard({ label, title, subtitle, color = COLORS.coral, position, rotation = 0, width = 3.4 }: SignProps) {
  const height = width * 0.42
  const texture = useCanvasTexture(
    768,
    Math.round(768 * 0.42),
    (ctx, w, h) => {
      ctx.fillStyle = "#0D1117"
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = "#30363D"
      ctx.lineWidth = 4
      ctx.strokeRect(2, 2, w - 4, h - 4)
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 10, h)
      ctx.fillStyle = color
      ctx.font = `500 30px ${fontFamily("--font-mono")}`
      ctx.fillText(`// ${label}`, 44, 64)
      // Long titles (company names) shrink first, then wrap onto two lines instead of being squashed.
      const maxWidth = w - 84
      const titleFont = (size: number) => `400 ${size}px ${fontFamily("--font-display")}`
      let size = 74
      ctx.font = titleFont(size)
      while (size > 56 && ctx.measureText(title).width > maxWidth) ctx.font = titleFont((size -= 2))
      let lines = [title]
      if (ctx.measureText(title).width > maxWidth) {
        size = 54
        ctx.font = titleFont(size)
        lines = wrapText(ctx, title, maxWidth).slice(0, 2)
      }
      ctx.fillStyle = "#E6EDF3"
      const firstBaseline = lines.length > 1 ? 128 : 160
      lines.forEach((line, index) => ctx.fillText(line, 42, firstBaseline + index * size * 1.02, maxWidth))
      if (subtitle) {
        ctx.fillStyle = "#8B949E"
        ctx.font = `400 28px ${fontFamily("--font-mono")}`
        ctx.fillText(subtitle, 44, lines.length > 1 ? 262 : 232, maxWidth)
      }
      ctx.fillStyle = "#3FB950"
      ctx.beginPath()
      ctx.arc(w - 46, 56, 9, 0, Math.PI * 2)
      ctx.fill()
    },
    `${label}|${title}|${subtitle}|${color}`,
  )

  return (
    <group position={position} rotation-y={rotation}>
      <mesh position-y={PLINTH_HEIGHT / 2} castShadow receiveShadow>
        <boxGeometry args={[width + 0.3, PLINTH_HEIGHT, 0.56]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      <mesh position={[0, PLINTH_HEIGHT - 0.07, 0.285]}>
        <boxGeometry args={[width + 0.3, 0.05, 0.02]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* Tilted back a little so it reads from the follow camera above */}
      <group position-y={PLINTH_HEIGHT + 0.04 + (height + 0.12) / 2} rotation-x={BOARD_TILT}>
        <mesh castShadow>
          <boxGeometry args={[width + 0.12, height + 0.12, 0.12]} />
          <primitive object={SHARED.ink} attach="material" />
        </mesh>
        <mesh position-z={0.065}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={texture} toneMapped={false} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
        </mesh>
      </group>
    </group>
  )
}

/** A flat emissive screen showing canvas-drawn content. */
export function Screen({
  width,
  height,
  draw,
  drawKey,
  position,
  rotation = [0, 0, 0],
  resolution = 512,
}: {
  width: number
  height: number
  draw: Draw
  drawKey: string
  position: [number, number, number]
  rotation?: [number, number, number]
  resolution?: number
}) {
  const texture = useCanvasTexture(resolution, Math.round((resolution * height) / width), draw, drawKey)
  // Screens sit just in front of their housings; the polygon offset keeps them from z-fighting.
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
    </mesh>
  )
}
