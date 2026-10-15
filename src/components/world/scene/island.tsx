"use client"

import { useMemo } from "react"
import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import type { ThreeEvent } from "@react-three/fiber"
import { COLORS, PATHS, PLAZA_RADIUS, islandRadius } from "../world-config"
import { runtime } from "../systems/runtime"
import { isWalkable } from "../systems/collision"

const SEGMENTS = 192

function seeded(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Soft "maria" (darker lunar patches) so the regolith isn't a flat color. */
function mariaShade(x: number, z: number) {
  return (
    Math.sin(x * 0.11 + 1.3) * Math.cos(z * 0.09 - 0.4) * 0.5 +
    Math.sin(x * 0.047 - z * 0.061 + 2.1) * 0.5
  )
}

/** Polar grid for the regolith top so it has interior vertices for color variation. */
function buildTop() {
  const random = seeded(7)
  const rings = 22
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const base = new THREE.Color(COLORS.regolith)
  const dark = new THREE.Color("#6F709C")
  const edge = new THREE.Color("#777AA6")
  const color = new THREE.Color()
  positions.push(0, 0, 0)
  color.copy(base)
  colors.push(color.r, color.g, color.b)
  for (let ring = 1; ring <= rings; ring++) {
    const f = ring / rings
    for (let s = 0; s < SEGMENTS; s++) {
      const theta = (s / SEGMENTS) * Math.PI * 2
      const r = islandRadius(theta) * f
      const x = Math.sin(theta) * r
      const z = -Math.cos(theta) * r
      positions.push(x, 0, z)
      const maria = Math.max(0, mariaShade(x, z)) * 0.55
      color.copy(base).lerp(dark, maria).lerp(edge, Math.pow(f, 5)).offsetHSL(0, 0, (random() - 0.5) * 0.05)
      colors.push(color.r, color.g, color.b)
    }
  }
  for (let s = 0; s < SEGMENTS; s++) indices.push(0, 1 + ((s + 1) % SEGMENTS), 1 + s)
  for (let ring = 1; ring < rings; ring++) {
    const a = 1 + (ring - 1) * SEGMENTS
    const b = 1 + ring * SEGMENTS
    for (let s = 0; s < SEGMENTS; s++) {
      const n = (s + 1) % SEGMENTS
      indices.push(a + s, a + n, b + s, a + n, b + n, b + s)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  const flat = geometry.toNonIndexed()
  flat.computeVertexNormals()
  return flat
}

/** Asteroid-like underside, faceted, fading from lavender rock to deep violet. */
function buildUnderside() {
  const random = seeded(19)
  const layers = [
    { y: 0, scale: 1, color: "#7C73A6" },
    { y: -1.4, scale: 1, color: "#6B6196" },
    { y: -3.6, scale: 0.95, color: "#5C4F7D" },
    { y: -7.2, scale: 0.82, color: "#4B4068" },
    { y: -12.5, scale: 0.6, color: "#3B3253" },
    { y: -18.5, scale: 0.36, color: "#2E2741" },
    { y: -24, scale: 0.12, color: "#231D33" },
  ]
  const segments = 96
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const color = new THREE.Color()
  layers.forEach((layer, li) => {
    for (let s = 0; s < segments; s++) {
      const theta = (s / segments) * Math.PI * 2
      const noise = li < 2 ? 0 : (random() - 0.5) * 2.4 * layer.scale
      const r = islandRadius(theta) * layer.scale + noise
      const y = layer.y + (li > 1 ? (random() - 0.5) * 1.4 : 0)
      positions.push(Math.sin(theta) * r, y, -Math.cos(theta) * r)
      color.set(layer.color).offsetHSL(0, 0, (random() - 0.5) * 0.05)
      colors.push(color.r, color.g, color.b)
    }
  })
  for (let li = 0; li < layers.length - 1; li++) {
    const a = li * segments
    const b = (li + 1) * segments
    for (let s = 0; s < segments; s++) {
      const n = (s + 1) % segments
      indices.push(a + s, a + n, b + s, a + n, b + n, b + s)
    }
  }
  const tip = positions.length / 3
  positions.push(0, -28, 0)
  colors.push(0.12, 0.1, 0.18)
  const last = (layers.length - 1) * segments
  for (let s = 0; s < segments; s++) indices.push(last + s, last + ((s + 1) % segments), tip)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  const flat = geometry.toNonIndexed()
  flat.computeVertexNormals()
  return flat
}

/** Flat ribbon that follows a smoothed polyline. */
function buildRibbon(points: [number, number][], width: number, y: number, offset = 0) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, y, z)), false, "centripetal")
  const steps = Math.max(16, Math.round(curve.getLength() * 1.5))
  const positions: number[] = []
  const indices: number[] = []
  const side = new THREE.Vector3()
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const p = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)
    side.set(-tangent.z, 0, tangent.x).normalize()
    const cx = p.x + side.x * offset
    const cz = p.z + side.z * offset
    positions.push(cx + (side.x * width) / 2, y, cz + (side.z * width) / 2, cx - (side.x * width) / 2, y, cz - (side.z * width) / 2)
    if (i < steps) {
      const k = i * 2
      indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

// Mission Control's floor: path mouths every 40°, starting at 20° (the avenue is at 180°).
const MOUTH_ANGLES = Array.from({ length: 9 }, (_, i) => 20 + i * 40)

function usePlazaTexture() {
  return useMemo(() => {
    const size = 1024
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = size
    const ctx = canvas.getContext("2d")!
    const c = size / 2
    ctx.fillStyle = "#262B36"
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = "#363E4C"
    for (let x = 12; x < size; x += 24) {
      for (let y = 12; y < size; y += 24) {
        ctx.beginPath()
        ctx.arc(x, y, 1.8, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    // Compass rose under the fountain
    ctx.strokeStyle = "rgba(210,168,255,0.35)"
    ctx.lineWidth = 2
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4
      ctx.beginPath()
      ctx.moveTo(c, c)
      ctx.lineTo(c + Math.sin(a) * c * (i % 2 ? 0.28 : 0.4), c - Math.cos(a) * c * (i % 2 ? 0.28 : 0.4))
      ctx.stroke()
    }
    ctx.lineWidth = 6
    ctx.strokeStyle = COLORS.coral
    ctx.beginPath()
    ctx.arc(c, c, c - 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.lineWidth = 3
    ctx.strokeStyle = "rgba(210,168,255,0.6)"
    ctx.beginPath()
    ctx.arc(c, c, c * 0.62, 0, Math.PI * 2)
    ctx.stroke()
    ctx.strokeStyle = "rgba(247,129,102,0.85)"
    ctx.fillStyle = COLORS.coral
    ctx.lineWidth = 4
    for (const degrees of MOUTH_ANGLES) {
      const a = (degrees * Math.PI) / 180
      const inner = c * 0.62
      const outer = c - 12
      ctx.beginPath()
      ctx.moveTo(c + Math.sin(a) * inner, c - Math.cos(a) * inner)
      ctx.lineTo(c + Math.sin(a) * outer, c - Math.cos(a) * outer)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(c + Math.sin(a) * inner, c - Math.cos(a) * inner, 8, 0, Math.PI * 2)
      ctx.fill()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  }, [])
}

export function Island() {
  const top = useMemo(buildTop, [])
  const underside = useMemo(buildUnderside, [])
  const plazaTexture = usePlazaTexture()
  // All paths share one mesh, and traces one mesh per color, to keep draw calls low.
  const paths = useMemo(() => {
    const surfaces = PATHS.map((line) => buildRibbon(line.points, line.width, 0.012))
    const coral = PATHS.filter((line) => line.kind !== "promenade").flatMap((line) =>
      line.kind === "avenue"
        ? [buildRibbon(line.points, 0.16, 0.02, 1.9), buildRibbon(line.points, 0.16, 0.02, -1.9)]
        : [buildRibbon(line.points, 0.14, 0.02)],
    )
    const lavender = PATHS.filter((line) => line.kind === "promenade").map((line) => buildRibbon(line.points, 0.14, 0.02))
    return {
      surface: mergeGeometries(surfaces)!,
      coral: mergeGeometries(coral)!,
      lavender: mergeGeometries(lavender)!,
    }
  }, [])

  const handleGroundClick = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > 6) return
    event.stopPropagation()
    const { x, z } = event.point
    if (!isWalkable(x, z)) return
    runtime.walkTarget = [x, z]
    runtime.pendingInteract = null
  }

  return (
    <group>
      <mesh geometry={top} receiveShadow onClick={handleGroundClick}>
        <meshStandardMaterial vertexColors flatShading roughness={0.97} />
      </mesh>
      <mesh geometry={underside} receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={1} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position-y={0.03} receiveShadow onClick={handleGroundClick}>
        <circleGeometry args={[PLAZA_RADIUS, 96]} />
        <meshStandardMaterial map={plazaTexture} roughness={0.8} />
      </mesh>

      <mesh geometry={paths.surface} receiveShadow onClick={handleGroundClick}>
        <meshStandardMaterial color="#2C333E" roughness={0.9} />
      </mesh>
      <mesh geometry={paths.coral}>
        <meshBasicMaterial color={COLORS.coral} toneMapped={false} />
      </mesh>
      <mesh geometry={paths.lavender}>
        <meshBasicMaterial color={COLORS.lavender} toneMapped={false} />
      </mesh>
    </group>
  )
}
