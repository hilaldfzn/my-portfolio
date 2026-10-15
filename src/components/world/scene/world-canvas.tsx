"use client"

// Everything that depends on three.js lives behind this module, which the /3d page loads
// with next/dynamic. The main portfolio never imports it.

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { PerformanceMonitor, useProgress } from "@react-three/drei"
import * as THREE from "three"
import { COLORS } from "../world-config"
import { useWorldStore } from "../store"
import { CameraRig } from "./camera-rig"
import { Dust, Lights, Nebula, Planets, Stars, Void } from "./environment"
import { preloadPacks } from "./models"
import { World } from "./world"

preloadPacks()

function LoadingReporter() {
  const { progress } = useProgress()
  useEffect(() => {
    useWorldStore.getState().setLoadProgress(Math.min(progress, 99))
  }, [progress])
  return null
}

/** Opt-in renderer stats for maintainers: open /3d?debug and read window.__islandPerf. */
function PerfProbe() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    ;(window as unknown as { __islandScene?: THREE.Scene }).__islandScene = scene
  }, [scene])
  const frames = useRef({ count: 0, since: performance.now() })
  useFrame(() => {
    const f = frames.current
    f.count++
    const now = performance.now()
    if (now - f.since < 1000) return
    ;(window as unknown as { __islandPerf?: object }).__islandPerf = {
      fps: Math.round((f.count * 1000) / (now - f.since)),
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
    }
    f.count = 0
    f.since = now
  })
  return null
}

export default function WorldCanvas() {
  const reducedMotion = useWorldStore((state) => state.reducedMotion)
  const touch = useWorldStore((state) => state.touch)
  const maxDpr = touch ? 1.5 : 1.75
  const [dpr, setDpr] = useState(maxDpr)
  const animate = !reducedMotion
  const [debug] = useState(() => new URLSearchParams(window.location.search).has("debug"))

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ fov: 45, near: 0.5, far: 900, position: [90, 80, 110] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault()
          useWorldStore.getState().setEngine("context-lost")
        })
      }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <color attach="background" args={[COLORS.ink]} />
      <fog attach="fog" args={[COLORS.ink, 120, 300]} />
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} />
      <Lights shadowSize={touch ? 1024 : 2048} />
      <Void />
      <Stars count={touch ? 1400 : 2200} />
      <Planets animate={animate} />
      <Nebula />
      {animate && <Dust animate={animate} count={touch ? 140 : 260} />}
      <Suspense fallback={null}>
        <World animate={animate} />
      </Suspense>
      <CameraRig />
      <LoadingReporter />
      {debug && <PerfProbe />}
    </Canvas>
  )
}
