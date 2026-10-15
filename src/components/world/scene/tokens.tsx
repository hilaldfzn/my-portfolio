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

/** Floating diamonds marking things you can open; the nearest one lights up. */
export function InteractionMarkers({ animate }: { animate: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const items = useMemo(
    () =>
      INTERACTABLES.map((item) => ({
        ...item,
        color: item.panel.type === "exit" ? "#F78166" : DISTRICT_BY_ID[item.district].color,
        height: item.id === "home-monolith" ? 4.45 : item.id.startsWith("kiosk") ? 2.75 : 2.9,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const { nearby, phase } = useWorldStore.getState()
    items.forEach((item, index) => {
      const mesh = refs.current[index]
      if (!mesh) return
      const active = nearby === item.id
      mesh.visible = phase === "playing"
      mesh.position.y = item.height + (animate ? Math.sin(t * 2.2 + index) * 0.12 : 0)
      mesh.rotation.y = animate ? t * 1.2 : 0
      const target = active ? 1.35 : 0.9
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x || target, target, 0.15))
      ;(mesh.material as THREE.MeshBasicMaterial).opacity = active ? 1 : 0.7
    })
  })

  return (
    <group>
      {items.map((item, index) => (
        <mesh
          key={item.id}
          ref={(node) => {
            refs.current[index] = node
          }}
          position={[item.position[0], item.height, item.position[1]]}
        >
          <octahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial color={item.color} transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
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
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}
