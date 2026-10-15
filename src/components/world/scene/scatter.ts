// Deterministic decoration layout (same on every visit), shared by rendering and colliders.
//
// The park is dressed the way a diorama is:
// - backdrops: a short treeline arc behind each land, framing it from the plaza
// - groves: small single-species clusters of alien flora in the largest open areas
// - craters: lunar craters in open ground between the groves
// - rim: a rhythmic border of rocks and shrubs along the cliff edge
// - path edging: tufts at regular intervals along both sides of each spoke

import {
  DISTRICTS,
  LAMPS,
  PLAZA_RADIUS,
  SPOKES,
  TOKENS,
  clearRadius,
  districtCenter,
  distanceToFeatures,
  distanceToPaths,
  islandRadius,
  linePoint,
  polarAngle,
  toWorld,
  type Collider,
} from "../world-config"
import type { InstanceTransform } from "./models"

function seeded(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface ScatterGroup {
  pack: "nature" | "tech"
  name: string
  transforms: InstanceTransform[]
}

const GROVE_SPECIES = [
  ["tree_pineRoundA", "tree_pineTallA", "tree_cone"],
  ["tree_oak", "tree_default", "tree_fat"],
  ["tree_default_fall", "tree_oak_fall", "tree_cone_fall"],
  ["tree_plateau", "tree_default", "tree_oak"],
]
const GROVE_FRINGE = ["plant_bush", "plant_bushLarge", "flower_purpleA", "flower_yellowA", "flower_redA", "grass_large"]
const RIM_PATTERN = ["rock_largeA", "plant_bushLarge", "rock_largeB", "grass_large", "rock_smallC", "plant_bush"]

const deg = (value: number) => (value * Math.PI) / 180

/** Distance to the nearest thing decoration must not crowd (negative = inside it). */
function clearance(x: number, z: number) {
  const r = Math.hypot(x, z)
  let best = Math.min(
    r - (PLAZA_RADIUS + 1.6),
    islandRadius(polarAngle(x, z)) - r - 1.3,
    distanceToPaths(x, z) - 0.8,
    distanceToFeatures(x, z) - 0.6,
  )
  for (const district of DISTRICTS) {
    if (district.radius === 0) continue
    const [cx, cz] = districtCenter(district)
    best = Math.min(best, Math.hypot(x - cx, z - cz) - clearRadius(district))
  }
  for (const [lx, lz] of LAMPS) best = Math.min(best, Math.hypot(x - lx, z - lz) - 0.8)
  for (const token of TOKENS) best = Math.min(best, Math.hypot(x - token.position[0], z - token.position[1]) - 1.2)
  return best
}

export function buildScatter() {
  const random = seeded(2026)
  const groups = new Map<string, ScatterGroup>()
  const colliders: Collider[] = []
  const occupied: { x: number; z: number; r: number }[] = []
  const add = (pack: ScatterGroup["pack"], name: string, x: number, z: number, scale: number, r = 0) => {
    if (!groups.has(name)) groups.set(name, { pack, name, transforms: [] })
    groups.get(name)!.transforms.push({ position: [x, 0, z], rotation: random() * Math.PI * 2, scale })
    occupied.push({ x, z, r: Math.max(r, 0.3) })
  }
  const free = (x: number, z: number, r: number) => occupied.every((o) => Math.hypot(o.x - x, o.z - z) > o.r + r)

  // --- Backdrops: an evenly spaced treeline arc behind every land's pad.
  for (const district of DISTRICTS) {
    if (district.radius === 0) continue
    const distance = district.padRadius + 1.9
    for (const offset of [-60, -40, -20, 0, 20, 40, 60]) {
      const [x, z] = toWorld(district, [Math.sin(deg(offset)) * distance, -Math.cos(deg(offset)) * distance])
      if (islandRadius(polarAngle(x, z)) - Math.hypot(x, z) < 1.4 || !free(x, z, 0.8)) continue
      if (distanceToPaths(x, z) < 0.6) continue
      add("nature", offset === 0 ? "tree_pineTallA" : Math.abs(offset) === 40 ? "tree_cone" : "tree_pineRoundA", x, z, 2.3, 0.8)
      colliders.push({ kind: "circle", x, z, r: 0.45 })
    }
  }

  // --- Groves: greedily take the most open spots, keeping groves well apart.
  const candidates: { x: number; z: number; c: number }[] = []
  for (let radius = 14; radius <= 58; radius += 1) {
    for (let a = 0; a < 360; a += 2) {
      const x = Math.sin(deg(a)) * radius
      const z = -Math.cos(deg(a)) * radius
      const c = clearance(x, z)
      if (c >= 2.2) candidates.push({ x, z, c })
    }
  }
  candidates.sort((a, b) => b.c - a.c)
  const groves: { x: number; z: number; radius: number }[] = []
  for (const candidate of candidates) {
    if (groves.length >= 34) break
    const radius = Math.min(candidate.c, 3.4)
    if (groves.some((g) => Math.hypot(g.x - candidate.x, g.z - candidate.z) < g.radius + radius + 3.6)) continue
    groves.push({ x: candidate.x, z: candidate.z, radius })
  }

  groves.forEach((grove, index) => {
    // Every third open spot becomes a crater instead of a grove.
    if (index % 3 === 2) {
      add("tech", index % 2 ? "craterLarge" : "crater", grove.x, grove.z, 2.6 + grove.radius * 0.4, grove.radius * 0.7)
      return
    }
    const species = GROVE_SPECIES[index % GROVE_SPECIES.length]
    const target = Math.max(2, Math.min(5, Math.round(grove.radius * 1.5)))
    let planted = 0
    for (let attempt = 0; attempt < 60 && planted < target; attempt++) {
      const a = random() * Math.PI * 2
      const d = planted === 0 ? 0 : Math.sqrt(random()) * Math.max(grove.radius - 0.9, 0.6)
      const x = grove.x + Math.cos(a) * d
      const z = grove.z + Math.sin(a) * d
      if (!free(x, z, 0.75) || clearance(x, z) < 0.9) continue
      add("nature", species[planted % species.length], x, z, 2.1 + random() * 0.5, 0.75)
      colliders.push({ kind: "circle", x, z, r: 0.45 })
      planted++
    }
    const fringe = 3 + Math.floor(random() * 3)
    for (let i = 0; i < fringe; i++) {
      const a = (i / fringe) * Math.PI * 2 + random() * 0.6
      const d = grove.radius + 0.4 + random() * 0.5
      const x = grove.x + Math.cos(a) * d
      const z = grove.z + Math.sin(a) * d
      if (!free(x, z, 0.3) || clearance(x, z) < 0.2) continue
      add("nature", GROVE_FRINGE[(index + i) % GROVE_FRINGE.length], x, z, 1.9 + random() * 0.4)
    }
  })

  // --- Rim: a rhythmic border along the cliff edge, skipped where a pad, path or ride is close.
  let step = 0
  for (let a = 0; a < 360; a += 4) {
    const theta = deg(a + (random() - 0.5) * 1.5)
    const radius = islandRadius(theta) - 1.15
    const x = Math.sin(theta) * radius
    const z = -Math.cos(theta) * radius
    let nearPad = false
    for (const district of DISTRICTS) {
      if (district.radius === 0) continue
      const [cx, cz] = districtCenter(district)
      if (Math.hypot(x - cx, z - cz) < district.padRadius + 0.7) nearPad = true
    }
    if (nearPad || !free(x, z, 0.5) || distanceToPaths(x, z) < 0.6 || distanceToFeatures(x, z) < 0) continue
    const name = RIM_PATTERN[step % RIM_PATTERN.length]
    const isRock = name.startsWith("rock")
    add("nature", name, x, z, isRock ? 1.6 + random() * 0.3 : 1.9, isRock ? 0.6 : 0.4)
    if (isRock) colliders.push({ kind: "circle", x, z, r: 0.5 })
    step++
  }

  // --- Path edging: tufts at a steady interval on both sides of every spoke (never on pads).
  for (const spoke of SPOKES) {
    for (let t = 0.06; t <= 0.94; t += 0.08) {
      for (const side of [-1.95, 1.95]) {
        const [x, z] = linePoint(spoke, t, side)
        if (Math.hypot(x, z) < PLAZA_RADIUS + 1.2 || !free(x, z, 0.4)) continue
        const onPad = DISTRICTS.some((district) => {
          if (district.radius === 0) return false
          const [cx, cz] = districtCenter(district)
          return Math.hypot(x - cx, z - cz) < district.padRadius + 0.6
        })
        if (onPad || distanceToFeatures(x, z) < 0) continue
        if (TOKENS.some((token) => Math.hypot(token.position[0] - x, token.position[1] - z) < 1.1)) continue
        if (LAMPS.some(([lx, lz]) => Math.hypot(lx - x, lz - z) < 0.7)) continue
        add("nature", "grass", x, z, 1.8)
      }
    }
  }

  return { scatter: Array.from(groups.values()), colliders }
}
