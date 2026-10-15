"use client"

import { useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { runtime } from "../systems/runtime"
import { useWorldStore } from "../store"

const MIN_PITCH = 0.2
const MAX_PITCH = 1.22
const MIN_DISTANCE = 5.5
const MAX_DISTANCE = 22

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Attract-mode orbit on the entry screen, a fly-in on start, then a third-person follow camera. */
export function CameraRig() {
  const { camera, gl, size } = useThree()
  const target = useRef(new THREE.Vector3(0, 1.2, 4))
  const scratchTarget = useRef(new THREE.Vector3())
  const scratchPosition = useRef(new THREE.Vector3())
  const flyIn = useRef<{ from: THREE.Vector3; fromTarget: THREE.Vector3; t: number } | null>(null)
  const lastPhase = useRef(useWorldStore.getState().phase)
  // Maintainer aid: /3d?debug&view=top shows the island straight from above on the entry screen.
  const topView = useRef(new URLSearchParams(window.location.search).get("view") === "top")

  // Portrait screens see less of the world horizontally; start a bit further out.
  useEffect(() => {
    if (size.width < size.height) runtime.camera.distance = Math.max(runtime.camera.distance, 15)
  }, [size.width, size.height])

  // Drag to orbit, wheel / pinch to zoom.
  useEffect(() => {
    const element = gl.domElement
    const pointers = new Map<number, { x: number; y: number }>()
    let pinchDistance = 0

    const enabled = () => {
      const state = useWorldStore.getState()
      return state.phase === "playing" && !state.panel && !state.overlay
    }
    const onDown = (event: PointerEvent) => {
      if (!enabled()) return
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
      element.setPointerCapture?.(event.pointerId)
      if (pointers.size === 2) {
        const [a, b] = Array.from(pointers.values())
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y)
      }
    }
    const onMove = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId)
      if (!previous) return
      const current = { x: event.clientX, y: event.clientY }
      pointers.set(event.pointerId, current)
      if (pointers.size === 1) {
        runtime.camera.yaw -= (current.x - previous.x) * 0.0055
        runtime.camera.pitch = THREE.MathUtils.clamp(runtime.camera.pitch + (current.y - previous.y) * 0.004, MIN_PITCH, MAX_PITCH)
      } else if (pointers.size === 2) {
        const [a, b] = Array.from(pointers.values())
        const distance = Math.hypot(a.x - b.x, a.y - b.y)
        if (pinchDistance > 0) {
          runtime.camera.distance = THREE.MathUtils.clamp(runtime.camera.distance * (pinchDistance / distance), MIN_DISTANCE, MAX_DISTANCE)
        }
        pinchDistance = distance
      }
    }
    const onUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId)
      pinchDistance = 0
    }
    const onWheel = (event: WheelEvent) => {
      if (!enabled()) return
      event.preventDefault()
      runtime.camera.distance = THREE.MathUtils.clamp(runtime.camera.distance * (1 + event.deltaY * 0.0012), MIN_DISTANCE, MAX_DISTANCE)
    }

    element.addEventListener("pointerdown", onDown)
    element.addEventListener("pointermove", onMove)
    element.addEventListener("pointerup", onUp)
    element.addEventListener("pointercancel", onUp)
    element.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      element.removeEventListener("pointerdown", onDown)
      element.removeEventListener("pointermove", onMove)
      element.removeEventListener("pointerup", onUp)
      element.removeEventListener("pointercancel", onUp)
      element.removeEventListener("wheel", onWheel)
    }
  }, [gl])

  useFrame(({ clock }, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20)
    const { phase, reducedMotion } = useWorldStore.getState()
    const p = runtime.player
    const cam = runtime.camera

    const followTarget = scratchTarget.current.set(p.x, p.y * 0.6 + 1.25, p.z)
    const followPosition = scratchPosition.current.set(
      followTarget.x + Math.sin(cam.yaw) * Math.cos(cam.pitch) * cam.distance,
      followTarget.y + Math.sin(cam.pitch) * cam.distance,
      followTarget.z + Math.cos(cam.yaw) * Math.cos(cam.pitch) * cam.distance,
    )

    if (phase === "entry") {
      lastPhase.current = phase
      if (topView.current) {
        camera.position.set(0, 92, 0.001)
        camera.lookAt(0, 0, 0)
        return
      }
      const angle = reducedMotion ? 0.7 : 0.7 + clock.elapsedTime * 0.045
      camera.position.set(Math.sin(angle) * 54, 40, Math.cos(angle) * 54)
      target.current.set(0, -3, 0)
      camera.lookAt(target.current)
      return
    }

    if (lastPhase.current !== "playing") {
      lastPhase.current = "playing"
      if (reducedMotion) cam.snap = true
      else flyIn.current = { from: camera.position.clone(), fromTarget: target.current.clone(), t: 0 }
    }

    if (flyIn.current) {
      flyIn.current.t = Math.min(flyIn.current.t + dt / 1.6, 1)
      const k = easeInOut(flyIn.current.t)
      camera.position.lerpVectors(flyIn.current.from, followPosition, k)
      target.current.lerpVectors(flyIn.current.fromTarget, followTarget, k)
      camera.lookAt(target.current)
      if (flyIn.current.t >= 1) flyIn.current = null
      return
    }

    if (cam.snap) {
      camera.position.copy(followPosition)
      target.current.copy(followTarget)
      cam.snap = false
    } else {
      const k = 1 - Math.exp(-9 * dt)
      camera.position.lerp(followPosition, k)
      target.current.lerp(followTarget, 1 - Math.exp(-14 * dt))
    }
    camera.lookAt(target.current)
  })

  return null
}
