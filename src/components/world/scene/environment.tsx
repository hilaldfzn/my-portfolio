"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { COLORS, ISLAND_MAX_RADIUS } from "../world-config"
import { runtime } from "../systems/runtime"
import { useWorldStore } from "../store"
import { InstancedModel, type InstanceTransform } from "./models"

const SUN_OFFSET = new THREE.Vector3(30, 46, 20)
const FOLLOW_EXTENT = 26
const OVERVIEW_EXTENT = ISLAND_MAX_RADIUS + 6

/**
 * Sunlight whose shadow frustum follows the player (crisp shadows in a large park) and covers
 * the whole park on the entry screen's overview.
 */
export function Lights({ shadowSize }: { shadowSize: number }) {
  const light = useRef<THREE.DirectionalLight>(null)
  const extent = useRef(0)
  const focus = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const current = light.current
    if (!current) return
    current.target.position.set(0, 0, 0)
    current.parent?.add(current.target)
    return () => {
      current.target.parent?.remove(current.target)
    }
  }, [])

  useFrame(() => {
    const sun = light.current
    if (!sun) return
    const playing = useWorldStore.getState().phase === "playing"
    const nextExtent = playing ? FOLLOW_EXTENT : OVERVIEW_EXTENT
    if (extent.current !== nextExtent) {
      extent.current = nextExtent
      const camera = sun.shadow.camera
      camera.left = camera.bottom = -nextExtent
      camera.right = camera.top = nextExtent
      camera.updateProjectionMatrix()
    }
    if (playing) {
      // Snap to the shadow-map texel grid so shadows don't shimmer while walking.
      const texel = (nextExtent * 2) / sun.shadow.mapSize.x
      focus.set(Math.round(runtime.player.x / texel) * texel, 0, Math.round(runtime.player.z / texel) * texel)
    } else {
      focus.set(0, 0, 0)
    }
    sun.target.position.copy(focus)
    sun.position.copy(focus).add(SUN_OFFSET)
  })

  return (
    <>
      <hemisphereLight args={["#C9CFFF", "#3B3253", 1.05]} />
      <ambientLight intensity={0.22} color="#A9B1D6" />
      <directionalLight
        ref={light}
        position={SUN_OFFSET.toArray()}
        intensity={2.5}
        color="#FFF3E6"
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
    </>
  )
}

const dotGridMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color("#3A4658") } },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying vec3 vWorld;
      void main() {
        vec2 cell = fract(vWorld.xz / 4.0) - 0.5;
        float dotMask = smoothstep(0.09, 0.05, length(cell));
        float fade = 1.0 - smoothstep(50.0, 230.0, length(vWorld.xz));
        gl_FragColor = vec4(uColor, dotMask * fade * 0.8);
      }
    `,
  })

/** The park floats in the same deep-ink "editor void" as the main site, over a dot grid. */
export function Void() {
  const grid = useMemo(dotGridMaterial, [])
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-48} material={grid}>
      <planeGeometry args={[620, 620]} />
    </mesh>
  )
}

function seeded(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Star field on a large sphere; drawn without fog so it stays crisp behind everything. */
export function Stars({ count = 2200 }: { count?: number }) {
  const geometry = useMemo(() => {
    const random = seeded(42)
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = ["#FFFFFF", "#D2A8FF", "#79C0FF", "#FFD8C9"].map((c) => new THREE.Color(c))
    for (let i = 0; i < count; i++) {
      const u = random() * 2 - 1
      const phi = random() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      const r = 360 + random() * 60
      positions[i * 3] = Math.cos(phi) * s * r
      positions[i * 3 + 1] = u * r
      positions[i * 3 + 2] = Math.sin(phi) * s * r
      const color = palette[i % 7 === 0 ? 1 + (i % 3) : 0]
      const brightness = 0.45 + random() * 0.55
      colors[i * 3] = color.r * brightness
      colors[i * 3 + 1] = color.g * brightness
      colors[i * 3 + 2] = color.b * brightness
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    return g
  }, [count])
  return (
    <points geometry={geometry}>
      <pointsMaterial vertexColors size={1.6} sizeAttenuation={false} fog={false} depthWrite={false} toneMapped={false} />
    </points>
  )
}

function useBandedTexture(stops: string[]) {
  return useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 16
    canvas.height = 256
    const ctx = canvas.getContext("2d")!
    const gradient = ctx.createLinearGradient(0, 0, 0, 256)
    stops.forEach((color, i) => gradient.addColorStop(i / (stops.length - 1), color))
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 16, 256)
    for (let y = 0; y < 256; y += 9) {
      ctx.fillStyle = `rgba(255,255,255,${0.04 + ((y * 7) % 5) * 0.012})`
      ctx.fillRect(0, y, 16, 3)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [stops])
}

const GIANT_STOPS = ["#F2A07B", "#C77D9E", "#8C6FC4", "#5E5AA8", "#C77D9E", "#F2C4A0"]

/** A ringed gas giant and a small moon hanging in the sky. */
export function Planets({ animate }: { animate: boolean }) {
  const giant = useRef<THREE.Group>(null)
  const texture = useBandedTexture(GIANT_STOPS)
  const ringTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 4
    const ctx = canvas.getContext("2d")!
    const gradient = ctx.createLinearGradient(0, 0, 256, 0)
    gradient.addColorStop(0, "rgba(210,168,255,0)")
    gradient.addColorStop(0.2, "rgba(210,168,255,0.55)")
    gradient.addColorStop(0.45, "rgba(247,129,102,0.25)")
    gradient.addColorStop(0.6, "rgba(255,216,201,0.6)")
    gradient.addColorStop(1, "rgba(210,168,255,0)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 4)
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(58, 96, 96, 1)
    // Map the texture radially across the ring.
    const position = geometry.attributes.position
    const uv = geometry.attributes.uv
    for (let i = 0; i < position.count; i++) {
      const r = Math.hypot(position.getX(i), position.getY(i))
      uv.setXY(i, (r - 58) / 38, 0.5)
    }
    return geometry
  }, [])

  useFrame((_, delta) => {
    if (animate && giant.current) giant.current.rotation.y += delta * 0.01
  })

  return (
    <group>
      <group ref={giant} position={[-230, 95, -250]} rotation={[0.18, 0.4, 0.32]}>
        <mesh>
          <sphereGeometry args={[42, 48, 32]} />
          <meshStandardMaterial map={texture} roughness={1} fog={false} />
        </mesh>
        <mesh geometry={ringGeometry} rotation-x={-Math.PI / 2.3}>
          <meshBasicMaterial map={ringTexture} transparent side={THREE.DoubleSide} depthWrite={false} fog={false} />
        </mesh>
      </group>
      <mesh position={[210, 120, -190]}>
        <sphereGeometry args={[12, 32, 20]} />
        <meshStandardMaterial color="#B9BAD6" roughness={1} fog={false} flatShading />
      </mesh>
    </group>
  )
}

const nebulaMaterial = (color: string) =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(color) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv - 0.5;
        float d = length(p * vec2(1.0, 1.6)) * 2.0;
        float wisp = 0.65 + 0.35 * sin(p.x * 9.0 + p.y * 5.0);
        float a = pow(max(1.0 - d, 0.0), 2.4) * 0.22 * wisp;
        gl_FragColor = vec4(uColor * a, a);
      }
    `,
  })

/** Soft nebula clouds far behind the park. */
export function Nebula() {
  const clouds = useMemo(
    () => [
      { position: [160, 60, -300], scale: [320, 220, 1], rotation: 0.2, material: nebulaMaterial(COLORS.lavender) },
      { position: [-60, 20, -340], scale: [380, 200, 1], rotation: -0.15, material: nebulaMaterial(COLORS.coral) },
      { position: [-300, 40, 120], scale: [300, 220, 1], rotation: 1.4, material: nebulaMaterial("#5E7BD8") },
    ],
    [],
  )
  return (
    <group>
      {clouds.map((cloud, index) => (
        <mesh
          key={index}
          position={cloud.position as [number, number, number]}
          scale={cloud.scale as [number, number, number]}
          rotation-y={cloud.rotation}
          material={cloud.material}
          onUpdate={(mesh) => mesh.lookAt(0, 0, 0)}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  )
}

/** Asteroids drifting around the park. */
export function Asteroids({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null)
  const transforms = useMemo<InstanceTransform[]>(() => {
    const random = seeded(99)
    return Array.from({ length: 26 }, () => {
      const angle = random() * Math.PI * 2
      const r = 78 + random() * 70
      return {
        position: [Math.cos(angle) * r, -18 + random() * 46, Math.sin(angle) * r],
        rotation: random() * Math.PI * 2,
        scale: 3 + random() * 9,
      }
    })
  }, [])
  useFrame((_, delta) => {
    if (animate && group.current) group.current.rotation.y += delta * 0.006
  })
  return (
    <group ref={group}>
      <InstancedModel pack="tech" name="meteor" transforms={transforms} castShadow={false} />
    </group>
  )
}

export function Dust({ animate, count = 260 }: { animate: boolean; count?: number }) {
  const points = useRef<THREE.Points>(null)
  const geometry = useMemo(() => {
    const random = seeded(5)
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 10 + random() * 70
      const a = random() * Math.PI * 2
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = -10 + random() * 34
      positions[i * 3 + 2] = Math.sin(a) * r
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return g
  }, [count])

  useFrame((_, delta) => {
    if (!animate || !points.current) return
    const attribute = points.current.geometry.getAttribute("position") as THREE.BufferAttribute
    const array = attribute.array as Float32Array
    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += delta * (0.25 + (i % 5) * 0.06)
      if (array[i * 3 + 1] > 24) array[i * 3 + 1] = -10
    }
    attribute.needsUpdate = true
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color={COLORS.lavender} size={0.1} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  )
}
