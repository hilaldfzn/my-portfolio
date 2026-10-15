// Lightweight 2D (x/z) collision: the player is a circle, static obstacles are circles or
// oriented boxes, and the island edge is a polar boundary. Cheaper than a physics engine
// and sufficient for a flat island with a few dozen obstacles.

import { insideIsland, islandRadius, polarAngle, type Collider } from "../world-config"

export const PLAYER_RADIUS = 0.45
const EDGE_MARGIN = 1.1

export function resolveCollisions(position: { x: number; z: number }, colliders: Collider[], radius = PLAYER_RADIUS) {
  for (let pass = 0; pass < 3; pass++) {
    let moved = false
    for (const collider of colliders) {
      if (collider.kind === "circle") {
        const dx = position.x - collider.x
        const dz = position.z - collider.z
        const min = collider.r + radius
        const distSq = dx * dx + dz * dz
        if (distSq < min * min) {
          const dist = Math.sqrt(distSq) || 0.0001
          const push = min - dist
          position.x += (dx / dist) * push
          position.z += (dz / dist) * push
          moved = true
        }
      } else {
        // Transform into the box's local frame (rotation about +y, three.js convention).
        const cos = Math.cos(collider.rot)
        const sin = Math.sin(collider.rot)
        const rx = position.x - collider.x
        const rz = position.z - collider.z
        const lx = rx * cos - rz * sin
        const lz = rx * sin + rz * cos
        const cx = Math.max(-collider.hw, Math.min(collider.hw, lx))
        const cz = Math.max(-collider.hd, Math.min(collider.hd, lz))
        let dx = lx - cx
        let dz = lz - cz
        const distSq = dx * dx + dz * dz
        if (distSq < radius * radius) {
          let nx: number
          let nz: number
          if (distSq > 1e-8) {
            const dist = Math.sqrt(distSq)
            nx = (dx / dist) * (radius - dist)
            nz = (dz / dist) * (radius - dist)
          } else {
            // Center is inside the box: push out along the shallowest axis.
            const px = collider.hw - Math.abs(lx) + radius
            const pz = collider.hd - Math.abs(lz) + radius
            if (px < pz) {
              nx = Math.sign(lx || 1) * px
              nz = 0
            } else {
              nx = 0
              nz = Math.sign(lz || 1) * pz
            }
          }
          dx = nx * cos + nz * sin
          dz = -nx * sin + nz * cos
          position.x += dx
          position.z += dz
          moved = true
        }
      }
    }
    if (!moved) break
  }

  // Island edge
  const dist = Math.hypot(position.x, position.z)
  const limit = islandRadius(polarAngle(position.x, position.z)) - EDGE_MARGIN
  if (dist > limit) {
    position.x *= limit / dist
    position.z *= limit / dist
  }
}

export function isWalkable(x: number, z: number) {
  return insideIsland(x, z, EDGE_MARGIN)
}
