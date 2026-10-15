"use client"

import { useMemo } from "react"
import * as THREE from "three"
import type { ThreeEvent } from "@react-three/fiber"
import { COLORS, PLAZA_RADIUS, SPOKES, islandRadius } from "../world-config"
import { runtime } from "../systems/runtime"
import { isWalkable } from "../systems/collision"

const SEGMENTS = 144

function seeded(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Polar grid for the grass top so it has interior vertices for color variation. */
function buildTop() {
  const random = seeded(7)
  const rings = 14
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const base = new THREE.Color(COLORS.grass)
  const edge = new THREE.Color("#3FA483")
  const color = new THREE.Color()
  positions.push(0, 0, 0)
  color.copy(base)
  colors.push(color.r, color.g, color.b)
  for (let ring = 1; ring <= rings; ring++) {
    const f = ring / rings
    for (let s = 0; s < SEGMENTS; s++) {
      const theta = (s / SEGMENTS) * Math.PI * 2
      const r = islandRadius(theta) * f
      positions.push(Math.sin(theta) * r, 0, -Math.cos(theta) * r)
      const jitter = (random() - 0.5) * 0.07
      color.copy(base).lerp(edge, Math.pow(f, 4)).offsetHSL(0, 0, jitter)
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

/** Cliff skirt and rocky underside, faceted. */
function buildUnderside() {
  const random = seeded(19)
  const layers = [
    { y: 0, scale: 1, color: "#E08B63" },
    { y: -0.9, scale: 1, color: "#D27A55" },
    { y: -2.3, scale: 0.95, color: "#B9623F" },
    { y: -4.6, scale: 0.8, color: "#97503A" },
    { y: -7.8, scale: 0.58, color: "#783F31" },
    { y: -11.5, scale: 0.34, color: "#5C3229" },
    { y: -15, scale: 0.12, color: "#432620" },
  ]
  const segments = 72
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const color = new THREE.Color()
  layers.forEach((layer, li) => {
    for (let s = 0; s < segments; s++) {
      const theta = (s / segments) * Math.PI * 2
      const noise = li < 2 ? 0 : (random() - 0.5) * 1.6 * layer.scale
      const r = islandRadius(theta) * layer.scale + noise
      const y = layer.y + (li > 1 ? (random() - 0.5) * 0.9 : 0)
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
  positions.push(0, -18, 0)
  colors.push(0.22, 0.13, 0.11)
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

/** Flat ribbon that follows a smoothed spoke, plus a thin center trace. */
function buildRibbon(points: [number, number][], width: number, y: number) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, y, z)), false, "centripetal")
  const steps = 48
  const positions: number[] = []
  const indices: number[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const p = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize().multiplyScalar(width / 2)
    positions.push(p.x + side.x, y, p.z + side.z, p.x - side.x, y, p.z - side.z)
    if (i < steps) {
      const k = i * 2
      indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return { geometry, curve }
}

function usePlazaTexture() {
  return useMemo(() => {
    const size = 1024
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = size
    const ctx = canvas.getContext("2d")!
    const c = size / 2
    ctx.fillStyle = "#2A313C"
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = "#3A4350"
    for (let x = 16; x < size; x += 32) {
      for (let y = 16; y < size; y += 32) {
        ctx.beginPath()
        ctx.arc(x, y, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.lineWidth = 6
    ctx.strokeStyle = COLORS.coral
    ctx.beginPath()
    ctx.arc(c, c, c - 14, 0, Math.PI * 2)
    ctx.stroke()
    ctx.lineWidth = 3
    ctx.strokeStyle = "rgba(210,168,255,0.55)"
    ctx.beginPath()
    ctx.arc(c, c, c * 0.62, 0, Math.PI * 2)
    ctx.stroke()
    // Traces toward each spoke, ending in vias.
    ctx.strokeStyle = "rgba(247,129,102,0.85)"
    ctx.fillStyle = COLORS.coral
    ctx.lineWidth = 4
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3
      const inner = c * 0.62
      const outer = c - 14
      ctx.beginPath()
      ctx.moveTo(c + Math.sin(a) * inner, c - Math.cos(a) * inner)
      ctx.lineTo(c + Math.sin(a) * outer, c - Math.cos(a) * outer)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(c + Math.sin(a) * inner, c - Math.cos(a) * inner, 9, 0, Math.PI * 2)
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
  const ribbons = useMemo(
    () =>
      SPOKES.map((spoke) => ({
        path: buildRibbon(spoke.points, 2.5, 0.012).geometry,
        trace: buildRibbon(spoke.points, 0.14, 0.02).geometry,
      })),
    [],
  )

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
        <meshStandardMaterial vertexColors flatShading roughness={0.95} />
      </mesh>
      <mesh geometry={underside} receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={1} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position-y={0.03} receiveShadow onClick={handleGroundClick}>
        <circleGeometry args={[PLAZA_RADIUS, 72]} />
        <meshStandardMaterial map={plazaTexture} roughness={0.8} />
      </mesh>

      {ribbons.map((ribbon, index) => (
        <group key={index}>
          <mesh geometry={ribbon.path} receiveShadow onClick={handleGroundClick}>
            <meshStandardMaterial color="#2C333E" roughness={0.9} />
          </mesh>
          <mesh geometry={ribbon.trace}>
            <meshBasicMaterial color={COLORS.coral} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
