"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { COLORS } from "../world-config"

export function Lights({ shadowSize }: { shadowSize: number }) {
  return (
    <>
      <hemisphereLight args={["#C9D4FF", "#4A3A34", 1.15]} />
      <ambientLight intensity={0.2} color="#9AA7C7" />
      <directionalLight
        position={[24, 36, 16]}
        intensity={2.4}
        color="#FFF1E2"
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-38}
        shadow-camera-right={38}
        shadow-camera-top={38}
        shadow-camera-bottom={-38}
        shadow-camera-near={1}
        shadow-camera-far={110}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
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
        vec2 cell = fract(vWorld.xz / 3.2) - 0.5;
        float dotMask = smoothstep(0.09, 0.05, length(cell));
        float fade = 1.0 - smoothstep(25.0, 150.0, length(vWorld.xz));
        gl_FragColor = vec4(uColor, dotMask * fade * 0.85);
      }
    `,
  })

const glowMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(COLORS.lavender) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float a = pow(max(1.0 - d, 0.0), 2.2) * 0.16;
        gl_FragColor = vec4(uColor * a, a);
      }
    `,
  })

/** The world floats in the same deep-ink "editor void" as the main site, over a dot grid. */
export function Void() {
  const grid = useMemo(dotGridMaterial, [])
  const glow = useMemo(glowMaterial, [])
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-34} material={grid}>
        <planeGeometry args={[420, 420]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-20} material={glow}>
        <planeGeometry args={[110, 110]} />
      </mesh>
    </group>
  )
}

const ISLETS = [
  { position: [-52, -4, -30], scale: 2.4, phase: 0 },
  { position: [58, 3, -18], scale: 1.8, phase: 1.3 },
  { position: [46, -9, 44], scale: 2.8, phase: 2.1 },
  { position: [-40, 6, 48], scale: 1.4, phase: 3.4 },
  { position: [8, -12, -64], scale: 3.2, phase: 4.2 },
  { position: [-70, 10, 8], scale: 1.6, phase: 5.1 },
] as const

export function FloatingIslets({ animate }: { animate: boolean }) {
  const refs = useRef<THREE.Group[]>([])
  const geometries = useMemo(() => {
    return ISLETS.map((_, index) => {
      const rock = new THREE.ConeGeometry(1.4, 2.6, 6 + (index % 3), 1)
      rock.rotateX(Math.PI)
      rock.translate(0, -1.3, 0)
      return rock
    })
  }, [])

  useFrame(({ clock }) => {
    if (!animate) return
    const t = clock.elapsedTime
    refs.current.forEach((group, index) => {
      if (!group) return
      group.position.y = ISLETS[index].position[1] + Math.sin(t * 0.4 + ISLETS[index].phase) * 0.8
      group.rotation.y = t * 0.03 + ISLETS[index].phase
    })
  })

  return (
    <group>
      {ISLETS.map((islet, index) => (
        <group
          key={index}
          ref={(node) => {
            if (node) refs.current[index] = node
          }}
          position={islet.position as unknown as [number, number, number]}
          scale={islet.scale}
        >
          <mesh geometry={geometries[index]}>
            <meshStandardMaterial color="#9C5440" flatShading roughness={1} />
          </mesh>
          <mesh position-y={0.05}>
            <cylinderGeometry args={[1.42, 1.42, 0.18, 6 + (index % 3)]} />
            <meshStandardMaterial color={COLORS.grass} flatShading roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Dust({ animate, count = 240 }: { animate: boolean; count?: number }) {
  const points = useRef<THREE.Points>(null)
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 46
      const a = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = -8 + Math.random() * 26
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
      if (array[i * 3 + 1] > 18) array[i * 3 + 1] = -8
    }
    attribute.needsUpdate = true
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color={COLORS.lavender} size={0.09} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  )
}
