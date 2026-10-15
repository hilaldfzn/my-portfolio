"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { INTERACTABLES, DISTRICT_BY_ID, TOKENS } from "../world-config"
import { runtime } from "../systems/runtime"
import { useWorldStore } from "../store"

const COLLECT_RADIUS = 1.05
const BASE_HEIGHT = 1.0

/** Skill tokens: hexagonal coins, one per skill on the main portfolio. Instanced for speed. */
export function SkillTokens({ animate }: { animate: boolean }) {
  const coins = useRef<THREE.InstancedMesh>(null)
  const collectedAt = useRef<Map<number, number>>(new Map())
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const coinGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.36, 0.36, 0.16, 6)
    geometry.rotateX(Math.PI / 2)
    return geometry
  }, [])

  // Lit coin whose glow follows each instance's category color.
  const coinMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.1, flatShading: true })
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\n  totalEmissiveRadiance += vColor * 0.55;",
      )
    }
    return material
  }, [])

  useLayoutEffect(() => {
    const color = new THREE.Color()
    TOKENS.forEach((token, index) => {
      color.set(token.color)
      coins.current?.setColorAt(index, color)
    })
    if (coins.current?.instanceColor) coins.current.instanceColor.needsUpdate = true
    // Tokens already collected in a previous visit start hidden.
    const collected = useWorldStore.getState().tokens
    TOKENS.forEach((token, index) => {
      if (collected.includes(token.skill)) collectedAt.current.set(index, -10)
    })
  }, [])

  // Resetting progress brings collected tokens back.
  useLayoutEffect(
    () =>
      useWorldStore.subscribe((state, previous) => {
        if (state.tokens.length < previous.tokens.length) {
          TOKENS.forEach((token, index) => {
            if (!state.tokens.includes(token.skill)) collectedAt.current.delete(index)
          })
        }
      }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const store = useWorldStore.getState()
    const p = runtime.player
    TOKENS.forEach((token, index) => {
      const [x, z] = token.position
      let scale = 1
      const takenAt = collectedAt.current.get(index)
      if (takenAt !== undefined) {
        const age = t - takenAt
        scale = takenAt < 0 ? 0 : age < 0.12 ? 1 + age * 3 : Math.max(0, 1.36 - (age - 0.12) * 4.5)
      } else if (store.phase === "playing" && Math.hypot(x - p.x, z - p.z) < COLLECT_RADIUS && p.y < 2.2) {
        collectedAt.current.set(index, t)
        store.collectToken(token.skill)
      }
      const bob = animate ? Math.sin(t * 2 + index) * 0.1 : 0
      dummy.position.set(x, BASE_HEIGHT + bob, z)
      dummy.rotation.set(0, animate ? t * 1.6 + index : index, 0)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      coins.current?.setMatrixAt(index, dummy.matrix)
    })
    if (coins.current) coins.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={coins} args={[coinGeometry, coinMaterial, TOKENS.length]} castShadow frustumCulled={false} />
}

// Markers float just above the object they belong to.
const MARKER_HEIGHTS: Record<string, number> = {
  "home-monolith": 4.6,
  "gdp-labs-door": 5.6,
  "bitcorp-terminal": 2.6,
  "campus-education": 2.8,
  "campus-classroom": 3.2,
  "campus-booths": 3.4,
  "skills-tower": 3.1,
  "articles-index": 3.0,
  "awards-hall": 3.0,
}

/** Floating diamonds marking things you can open; the nearest one lights up. */
export function InteractionMarkers({ animate }: { animate: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const scales = useRef<number[]>([])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const items = useMemo(
    () =>
      INTERACTABLES.map((item) => ({
        ...item,
        color: item.panel.type === "exit" ? "#F78166" : DISTRICT_BY_ID[item.district].color,
        height: MARKER_HEIGHTS[item.id] ?? (item.id.startsWith("kiosk") ? 2.75 : item.id.startsWith("exhibit") ? 2.4 : 2.9),
      })),
    [],
  )

  useLayoutEffect(() => {
    const color = new THREE.Color()
    items.forEach((item, index) => mesh.current?.setColorAt(index, color.set(item.color)))
    if (mesh.current?.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [items])

  // One instanced mesh for every marker; the nearby one grows.
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const { nearby, phase } = useWorldStore.getState()
    if (!mesh.current) return
    mesh.current.visible = phase === "playing"
    items.forEach((item, index) => {
      const target = nearby === item.id ? 1.35 : 0.9
      const scale = THREE.MathUtils.lerp(scales.current[index] ?? target, target, 0.15)
      scales.current[index] = scale
      dummy.position.set(item.position[0], item.height + (animate ? Math.sin(t * 2.2 + index) * 0.12 : 0), item.position[1])
      dummy.rotation.set(0, animate ? t * 1.2 : 0, 0)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, items.length]} frustumCulled={false}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

/** Invisible click targets: clicking an object walks the player to it, then opens it. */
export function InteractionHitboxes() {
  return (
    <group>
      {INTERACTABLES.map((item) => (
        <mesh
          key={item.id}
          position={[item.position[0], 1.2, item.position[1]]}
          onClick={(event) => {
            if (event.delta > 6) return
            const state = useWorldStore.getState()
            if (state.phase !== "playing" || state.panel || state.overlay) return
            event.stopPropagation()
            const p = runtime.player
            if (Math.hypot(item.position[0] - p.x, item.position[1] - p.z) < item.radius) {
              state.openPanel(item.panel)
              return
            }
            runtime.walkTarget = [item.position[0], item.position[1]]
            runtime.pendingInteract = item.id
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "")}
        >
          <cylinderGeometry args={[0.85, 0.85, 2.4, 8]} />
          {/* Never drawn, still hit by the raycaster */}
          <meshBasicMaterial visible={false} />
        </mesh>
      ))}
    </group>
  )
}
