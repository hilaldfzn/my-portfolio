"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useAnimations, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { PACK_URLS } from "./models"
import { runtime } from "../systems/runtime"
import { resolveCollisions } from "../systems/collision"
import { useWorldStore } from "../store"
import {
  COLORS,
  DISTRICTS,
  INTERACTABLES,
  TOKENS,
  TRIGGERS,
  districtCenter,
  zoneRadius,
  type Collider,
} from "../world-config"

const WALK_SPEED = 3.8
const RUN_SPEED = 7.2
const JUMP_VELOCITY = 7.2
const GRAVITY = 21
const ROBOT_SCALE = 0.4

type Locomotion = "Idle" | "Walking" | "Running" | "Jump"

function dampAngle(current: number, target: number, lambda: number, dt: number) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current))
  return current + delta * (1 - Math.exp(-lambda * dt))
}

export function Player({ colliders }: { colliders: Collider[] }) {
  const { scene, animations } = useGLTF(PACK_URLS.robot, false, true)
  const group = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, scene)
  const current = useRef<string>("Idle")
  const oneShotUntil = useRef(0)
  const stuckTime = useRef(0)
  const firedTriggers = useRef(new Set<string>())

  // Tint the robot with the site's coral accent and enable shadows (done once).
  useMemo(() => {
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      const material = mesh.material as THREE.MeshStandardMaterial
      if (material.name === "Main") material.color.set(COLORS.coral).multiplyScalar(0.85)
      material.roughness = 0.6
    })
  }, [scene])

  const play = (name: string, fade = 0.2) => {
    if (current.current === name) return
    const next = actions[name]
    const previous = actions[current.current]
    if (!next) return
    next.reset().fadeIn(fade).play()
    previous?.fadeOut(fade)
    current.current = name
  }

  const playOnce = (name: string, seconds: number) => {
    const action = actions[name]
    if (!action) return
    action.setLoop(THREE.LoopOnce, 1)
    action.clampWhenFinished = true
    play(name, 0.25)
    oneShotUntil.current = performance.now() + seconds * 1000
  }

  useEffect(() => {
    actions.Idle?.play()
    const jump = actions.Jump
    if (jump) {
      jump.setLoop(THREE.LoopOnce, 1)
      jump.clampWhenFinished = true
    }
  }, [actions])

  // Greet on entering the world; celebrate when every token is collected.
  useEffect(() => {
    return useWorldStore.subscribe((state, previous) => {
      if (state.phase === "playing" && previous.phase !== "playing" && !state.reducedMotion) playOnce("Wave", 2.2)
      if (state.tokens.length === TOKENS.length && previous.tokens.length < TOKENS.length) playOnce("Dance", 4)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions])

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20)
    const p = runtime.player
    const input = runtime.input
    const store = useWorldStore.getState()

    if (runtime.teleport) {
      p.x = runtime.teleport.position[0]
      p.z = runtime.teleport.position[1]
      p.y = 0
      p.vx = p.vz = p.vy = 0
      p.yaw = runtime.teleport.yaw
      runtime.camera.yaw = p.yaw + Math.PI
      runtime.camera.snap = true
      runtime.walkTarget = null
      runtime.teleport = null
    }

    const controlsEnabled = store.phase === "playing" && !store.panel && !store.overlay
    let forward = 0
    let right = 0
    let wantsRun = false
    if (controlsEnabled) {
      forward = (input.up ? 1 : 0) - (input.down ? 1 : 0) + input.joystickY
      right = (input.right ? 1 : 0) - (input.left ? 1 : 0) + input.joystickX
      const magnitude = Math.hypot(forward, right)
      if (magnitude > 1) {
        forward /= magnitude
        right /= magnitude
      }
      wantsRun = input.run || Math.hypot(input.joystickX, input.joystickY) > 0.92
    } else {
      input.jumpQueued = false
    }

    // Camera-relative directions.
    const yaw = runtime.camera.yaw
    let dirX = -Math.sin(yaw) * forward + Math.cos(yaw) * right
    let dirZ = -Math.cos(yaw) * forward - Math.sin(yaw) * right
    let speedScale = Math.min(Math.hypot(forward, right), 1)

    if (speedScale > 0.05) {
      runtime.walkTarget = null
      runtime.pendingInteract = null
    } else if (controlsEnabled && runtime.walkTarget) {
      const [tx, tz] = runtime.walkTarget
      const dx = tx - p.x
      const dz = tz - p.z
      const distance = Math.hypot(dx, dz)
      const pending = runtime.pendingInteract ? INTERACTABLES.find((i) => i.id === runtime.pendingInteract) : null
      const arriveRadius = pending ? pending.radius * 0.7 : 0.35
      if (distance < arriveRadius) {
        runtime.walkTarget = null
        if (pending) {
          runtime.pendingInteract = null
          store.openPanel(pending.panel)
        }
      } else {
        dirX = dx / distance
        dirZ = dz / distance
        speedScale = 1
        wantsRun = distance > 9
      }
    }

    const targetSpeed = speedScale * (wantsRun ? RUN_SPEED : WALK_SPEED)
    const blend = 1 - Math.exp(-10 * dt)
    p.vx += (dirX * targetSpeed - p.vx) * blend
    p.vz += (dirZ * targetSpeed - p.vz) * blend

    const before = { x: p.x, z: p.z }
    const next = { x: p.x + p.vx * dt, z: p.z + p.vz * dt }
    resolveCollisions(next, colliders)
    p.x = next.x
    p.z = next.z
    const actualSpeed = Math.hypot(p.x - before.x, p.z - before.z) / Math.max(dt, 1e-4)
    p.speed = actualSpeed

    // If a click-to-walk target is blocked, give up instead of pushing into the wall forever.
    stuckTime.current = runtime.walkTarget && actualSpeed < 0.6 ? stuckTime.current + dt : 0
    if (stuckTime.current > 0.6) {
      runtime.walkTarget = null
      runtime.pendingInteract = null
      stuckTime.current = 0
    }

    if (controlsEnabled && input.jumpQueued && p.grounded) {
      p.vy = JUMP_VELOCITY
      p.grounded = false
      play("Jump", 0.1)
    }
    input.jumpQueued = false
    if (!p.grounded) {
      p.vy -= GRAVITY * dt
      p.y += p.vy * dt
      if (p.y <= 0) {
        p.y = 0
        p.vy = 0
        p.grounded = true
      }
    }

    if (actualSpeed > 0.3) p.yaw = dampAngle(p.yaw, Math.atan2(p.vx, p.vz), 12, dt)

    if (group.current) {
      group.current.position.set(p.x, p.y, p.z)
      group.current.rotation.y = p.yaw
    }

    // Animation state.
    const now = performance.now()
    if (speedScale > 0.05 || !p.grounded) oneShotUntil.current = 0
    if (now > oneShotUntil.current) {
      let next: Locomotion = "Idle"
      if (!p.grounded) next = "Jump"
      else if (actualSpeed > 5) next = "Running"
      else if (actualSpeed > 0.4) next = "Walking"
      play(next)
      // Reduced motion: hold the idle pose instead of looping the idle animation.
      if (actions.Idle) actions.Idle.timeScale = store.reducedMotion ? 0 : 1
      const walking = actions.Walking
      const running = actions.Running
      if (walking) walking.timeScale = THREE.MathUtils.clamp(actualSpeed / WALK_SPEED, 0.6, 1.4)
      if (running) running.timeScale = THREE.MathUtils.clamp(actualSpeed / RUN_SPEED, 0.7, 1.2)
    }

    // Nearby interactable.
    let nearest: string | null = null
    let nearestDistance = Infinity
    for (const item of INTERACTABLES) {
      const d = Math.hypot(item.position[0] - p.x, item.position[1] - p.z)
      if (d < item.radius && d < nearestDistance) {
        nearest = item.id
        nearestDistance = d
      }
    }
    store.setNearby(store.phase === "playing" ? nearest : null)

    // District zones.
    if (store.phase === "playing") {
      let inside: (typeof DISTRICTS)[number]["id"] | null = null
      for (const district of DISTRICTS) {
        const [cx, cz] = districtCenter(district)
        if (Math.hypot(cx - p.x, cz - p.z) < zoneRadius(district)) inside = district.id
      }
      store.enterDistrict(inside)

      for (const trigger of TRIGGERS) {
        if (firedTriggers.current.has(trigger.id)) continue
        if (Math.hypot(trigger.position[0] - p.x, trigger.position[1] - p.z) < trigger.radius) {
          firedTriggers.current.add(trigger.id)
          store.pushToast({ tone: "info", title: trigger.title, detail: trigger.detail })
        }
      }
    }
  })

  return (
    <group ref={group}>
      <primitive object={scene} scale={ROBOT_SCALE} />
    </group>
  )
}
