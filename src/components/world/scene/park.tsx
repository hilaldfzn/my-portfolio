"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import {
  BENCHES,
  COLORS,
  FEATURES,
  GUESTS,
  LAMPS,
  MONORAIL,
  PARK_NAME,
  type GuestModel,
  type Stall as StallSpot,
  type StallKind,
} from "../world-config"
import { InstancedModel, Model, StaticBatch, type InstanceTransform, type PackName } from "./models"
import { Screen, fontFamily } from "./canvas-art"
import { SHARED } from "./materials"

const rad = (degrees: number) => (degrees * Math.PI) / 180
const RIDE_COLORS = [COLORS.coral, COLORS.lavender, COLORS.yellow, COLORS.blue, COLORS.green, COLORS.orange]

/** Four-legged lattice tower (launch gantry, comms towers), merged into two meshes. */
export function Lattice({ height, base, top, levels, accent }: { height: number; base: number; top: number; levels: number; accent: string }) {
  const { frame, bands } = useMemo(() => {
    const frameParts: THREE.BufferGeometry[] = []
    const bandParts: THREE.BufferGeometry[] = []
    const up = new THREE.Vector3(0, 1, 0)
    for (const [sx, sz] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      const from = new THREE.Vector3(sx * base, 0, sz * base)
      const to = new THREE.Vector3(sx * top, height, sz * top)
      const leg = new THREE.BoxGeometry(0.18, from.distanceTo(to), 0.18)
      leg.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, to.clone().sub(from).normalize()))
      const mid = from.clone().add(to).multiplyScalar(0.5)
      leg.translate(mid.x, mid.y, mid.z)
      frameParts.push(leg)
    }
    for (let level = 0; level < levels; level++) {
      const y = ((level + 1) / (levels + 1)) * height
      const half = base + (top - base) * (y / height)
      for (const angle of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
        const bar = new THREE.BoxGeometry(half * 2, 0.1, 0.1)
        bar.rotateY(angle)
        bar.translate(Math.sin(angle) * half, y, Math.cos(angle) * half)
        ;(level % 2 ? bandParts : frameParts).push(bar)
      }
    }
    return { frame: mergeGeometries(frameParts)!, bands: mergeGeometries(bandParts)! }
  }, [base, top, height, levels])
  return (
    <group>
      <mesh geometry={frame} castShadow>
        <primitive object={SHARED.steel} attach="material" />
      </mesh>
      <mesh geometry={bands}>
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Blinker({ position, color = "#FF5F57", animate, speed = 2.6, size = 0.22 }: { position: [number, number, number]; color?: string; animate: boolean; speed?: number; size?: number }) {
  const material = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    if (material.current) material.current.opacity = animate ? (Math.sin(clock.elapsedTime * speed) > 0 ? 1 : 0.2) : 1
  })
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 10, 8]} />
      <meshBasicMaterial ref={material} color={color} transparent toneMapped={false} />
    </mesh>
  )
}

// ---------------------------------------------------------------------------
// The park icon: a rocket on its launch pad, visible straight up the avenue from the gate
// ---------------------------------------------------------------------------

const ROCKET_SCALE = 5
const ROCKET_STACK: { name: string; height: number }[] = [
  { name: "rocket_baseA", height: 1.6 },
  { name: "rocket_sidesA", height: 1 },
  { name: "rocket_fuelA", height: 0.5 },
  { name: "rocket_sidesA", height: 1 },
  { name: "rocket_topA", height: 0.8 },
]

export function LaunchPad({ animate }: { animate: boolean }) {
  const [x, z] = FEATURES.rocket.position
  const vapor = useRef<(THREE.Mesh | null)[]>([])
  useFrame(({ clock }) => {
    vapor.current.forEach((puff, index) => {
      if (!puff) return
      const t = (clock.elapsedTime * 0.35 + index / 4) % 1
      const s = animate ? 0.8 + t * 1.6 : 1.2
      puff.scale.setScalar(s)
      puff.position.y = 0.8 + (animate ? t * 2.4 : 0.8)
      ;(puff.material as THREE.MeshStandardMaterial).opacity = animate ? 0.35 * (1 - t) : 0.2
    })
  })
  let y = 0.55
  const stack = ROCKET_STACK.map((part) => {
    const at = y
    y += part.height * ROCKET_SCALE
    return { ...part, y: at }
  })
  return (
    <group position={[x, 0, z]}>
      <mesh position-y={0.27} receiveShadow castShadow>
        <cylinderGeometry args={[FEATURES.rocket.radius, FEATURES.rocket.radius + 0.3, 0.55, 8]} />
        <meshStandardMaterial color="#353B47" roughness={0.85} flatShading />
      </mesh>
      <mesh position-y={0.56} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[FEATURES.rocket.radius - 0.5, FEATURES.rocket.radius - 0.25, 8]} />
        <meshBasicMaterial color={COLORS.yellow} toneMapped={false} />
      </mesh>
      {stack.map((part, index) => (
        <Model key={index} pack="tech" name={part.name} position={[0, part.y, 0]} scale={ROCKET_SCALE} />
      ))}
      <group position={[4.2, 0.55, 0]}>
        <Lattice height={20} base={1.2} top={0.8} levels={9} accent={COLORS.coral} />
        {/* Gantry arm reaching to the capsule */}
        <mesh position={[-1.9, 17.6, 0]} castShadow>
          <boxGeometry args={[3.2, 0.35, 0.9]} />
          <primitive object={SHARED.steel} attach="material" />
        </mesh>
        <Blinker position={[0, 20.4, 0]} animate={animate} />
      </group>
      {[0, 1, 2, 3].map((index) => (
        <mesh
          key={index}
          ref={(node) => {
            vapor.current[index] = node
          }}
          position={[Math.cos(index * 1.7) * 2.2, 1, Math.sin(index * 1.7) * 2.2]}
        >
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#E6E8F5" transparent opacity={0.25} depthWrite={false} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Orbital Wheel (ferris wheel), facing the avenue
// ---------------------------------------------------------------------------

const WHEEL_GONDOLAS = 12

export function OrbitalWheel({ animate }: { animate: boolean }) {
  const { position, angle, radius, axleHeight } = FEATURES.wheel
  const wheel = useRef<THREE.Group>(null)
  const cabins = useRef<THREE.InstancedMesh>(null)
  const roofs = useRef<THREE.InstancedMesh>(null)
  const rim = useMemo(() => new THREE.TorusGeometry(radius, 0.14, 6, 64), [radius])
  const spokes = useMemo(() => {
    const parts: THREE.BufferGeometry[] = []
    for (let i = 0; i < WHEEL_GONDOLAS; i++) {
      for (const zOffset of [-0.62, 0.62]) {
        const spoke = new THREE.BoxGeometry(radius, 0.08, 0.08)
        spoke.translate(radius / 2, 0, zOffset)
        spoke.rotateZ((i / WHEEL_GONDOLAS) * Math.PI * 2)
        parts.push(spoke)
      }
    }
    return mergeGeometries(parts)!
  }, [radius])
  const bulbs = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useLayoutEffect(() => {
    const color = new THREE.Color()
    for (let i = 0; i < WHEEL_GONDOLAS; i++) {
      color.set(RIDE_COLORS[i % RIDE_COLORS.length])
      cabins.current?.setColorAt(i, color)
    }
    if (cabins.current?.instanceColor) cabins.current.instanceColor.needsUpdate = true
  }, [])

  useLayoutEffect(() => {
    const mesh = bulbs.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2
      dummy.position.set(Math.cos(a) * (radius + 0.05), Math.sin(a) * (radius + 0.05), 0.62 * (i % 2 ? 1 : -1))
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [radius])

  useFrame(({ clock }) => {
    const a = animate ? -clock.elapsedTime * 0.12 : 0.3
    if (wheel.current) wheel.current.rotation.z = a
    // Cabins hang from the rim and stay upright as the wheel turns.
    for (let i = 0; i < WHEEL_GONDOLAS; i++) {
      const g = (i / WHEEL_GONDOLAS) * Math.PI * 2 + a
      const x = Math.cos(g) * radius
      const y = axleHeight + Math.sin(g) * radius
      dummy.position.set(x, y - 0.85, 0)
      dummy.updateMatrix()
      cabins.current?.setMatrixAt(i, dummy.matrix)
      dummy.position.set(x, y - 0.32, 0)
      dummy.updateMatrix()
      roofs.current?.setMatrixAt(i, dummy.matrix)
    }
    if (cabins.current) cabins.current.instanceMatrix.needsUpdate = true
    if (roofs.current) roofs.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={[position[0], 0, position[1]]} rotation-y={rad(90 - angle)}>
      <mesh position-y={0.15} receiveShadow>
        <boxGeometry args={[11, 0.3, 4.4]} />
        <meshStandardMaterial color="#353B47" roughness={0.85} />
      </mesh>
      {/* A-frame supports */}
      {[-1.15, 1.15].map((zSide) =>
        [-4.4, 4.4].map((xSide) => {
          const from = new THREE.Vector3(xSide, 0.3, zSide * 1.15)
          const to = new THREE.Vector3(0, axleHeight, zSide)
          const mid = from.clone().add(to).multiplyScalar(0.5)
          const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize())
          return (
            <mesh key={`${zSide}-${xSide}`} position={mid} quaternion={quaternion} castShadow>
              <boxGeometry args={[0.28, from.distanceTo(to), 0.28]} />
              <primitive object={SHARED.steel} attach="material" />
            </mesh>
          )
        }),
      )}
      <group ref={wheel} position-y={axleHeight}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.45, 0.45, 2.6, 12]} />
          <meshStandardMaterial color={COLORS.coral} roughness={0.5} />
        </mesh>
        {[-0.62, 0.62].map((zOffset) => (
          <mesh key={zOffset} geometry={rim} position-z={zOffset} castShadow>
            <meshStandardMaterial color="#D9DCEB" roughness={0.45} metalness={0.2} />
          </mesh>
        ))}
        <mesh geometry={spokes}>
          <primitive object={SHARED.pale} attach="material" />
        </mesh>
        <instancedMesh ref={bulbs} args={[undefined, undefined, 36]}>
          <sphereGeometry args={[0.11, 8, 6]} />
          <meshBasicMaterial color="#FFE7B0" toneMapped={false} />
        </instancedMesh>
      </group>
      <instancedMesh ref={cabins} args={[undefined, undefined, WHEEL_GONDOLAS]} castShadow frustumCulled={false}>
        <boxGeometry args={[0.95, 0.85, 0.95]} />
        <meshStandardMaterial roughness={0.45} />
      </instancedMesh>
      <instancedMesh ref={roofs} args={[undefined, undefined, WHEEL_GONDOLAS]} frustumCulled={false}>
        <coneGeometry args={[0.7, 0.4, 4]} />
        <meshStandardMaterial color="#E6EDF3" roughness={0.5} />
      </instancedMesh>
      <Screen
        width={3.6}
        height={0.9}
        position={[0, 1.1, 2.25]}
        resolution={512}
        drawKey="wheel-sign"
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#0D1117"
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = COLORS.coral
          ctx.fillRect(0, 0, 8, h)
          ctx.fillStyle = "#E6EDF3"
          ctx.font = `400 64px ${fontFamily("--font-display")}`
          ctx.fillText("Orbital Wheel", 26, h - 40, w - 40)
        }}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Astro Orbiter: rocket gondolas on arms spinning around a planet tower
// ---------------------------------------------------------------------------

const ORBITER_ARMS = 8

export function AstroOrbiter({ animate }: { animate: boolean }) {
  const { position, radius } = FEATURES.orbiter
  const spinner = useRef<THREE.Group>(null)
  const arms = useRef<(THREE.Group | null)[]>([])
  const planets = useRef<THREE.Group>(null)
  const fence = useMemo(() => new THREE.TorusGeometry(radius, 0.07, 6, 48), [radius])
  const posts = useMemo(() => {
    const parts = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      const post = new THREE.BoxGeometry(0.1, 0.8, 0.1)
      post.translate(Math.cos(a) * radius, 0.45, Math.sin(a) * radius)
      return post
    })
    return mergeGeometries(parts)!
  }, [radius])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (spinner.current) spinner.current.rotation.y = animate ? t * 0.7 : 0.4
    if (planets.current) planets.current.rotation.y = animate ? -t * 0.4 : 0
    arms.current.forEach((arm, index) => {
      if (arm) arm.rotation.z = animate ? 0.28 + Math.sin(t * 0.9 + index) * 0.12 : 0.28
    })
  })
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh position-y={0.12} receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.24, 48]} />
        <meshStandardMaterial color="#353B47" roughness={0.85} />
      </mesh>
      <mesh geometry={fence} position-y={0.85} rotation-x={Math.PI / 2}>
        <meshStandardMaterial color={COLORS.lavender} roughness={0.5} />
      </mesh>
      <mesh geometry={posts}>
        <primitive object={SHARED.steel} attach="material" />
      </mesh>
      <mesh position-y={3.2} castShadow>
        <cylinderGeometry args={[0.38, 0.65, 6.4, 10]} />
        <meshStandardMaterial color="#D9DCEB" roughness={0.45} metalness={0.2} />
      </mesh>
      <group ref={planets} position-y={6.9}>
        <mesh>
          <sphereGeometry args={[0.85, 24, 16]} />
          <meshStandardMaterial color={COLORS.orange} emissive={COLORS.orange} emissiveIntensity={0.35} roughness={0.6} />
        </mesh>
        {[COLORS.blue, COLORS.green, COLORS.lavender].map((color, i) => {
          const a = (i / 3) * Math.PI * 2
          return (
            <mesh key={color} position={[Math.cos(a) * 1.7, 0.2 * (i - 1), Math.sin(a) * 1.7]}>
              <sphereGeometry args={[0.32, 16, 12]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.6} />
            </mesh>
          )
        })}
      </group>
      <group ref={spinner} position-y={3.3}>
        {Array.from({ length: ORBITER_ARMS }, (_, i) => (
          <group key={i} rotation-y={(i / ORBITER_ARMS) * Math.PI * 2}>
            <group
              ref={(node) => {
                arms.current[i] = node
              }}
            >
              <mesh position={[radius * 0.42, 0, 0]}>
                <boxGeometry args={[radius * 0.84, 0.12, 0.12]} />
                <primitive object={SHARED.pale} attach="material" />
              </mesh>
              <group position={[radius * 0.86, 0.1, 0]}>
                <mesh rotation-x={Math.PI / 2} castShadow>
                  <capsuleGeometry args={[0.32, 0.9, 4, 10]} />
                  <meshStandardMaterial color={RIDE_COLORS[i % RIDE_COLORS.length]} roughness={0.4} />
                </mesh>
                <mesh position-z={-0.92} rotation-x={-Math.PI / 2}>
                  <coneGeometry args={[0.32, 0.5, 10]} />
                  <meshStandardMaterial color="#E6EDF3" roughness={0.4} />
                </mesh>
              </group>
            </group>
          </group>
        ))}
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Orbit Express: a monorail ring floating around the park
// ---------------------------------------------------------------------------

// Car lengths (model units, see manifest.json); cars are placed end to end so the train is coupled.
const TRAIN = [
  { name: "monorail_trainFront", length: 1.05 },
  { name: "monorail_trainPassenger", length: 1 },
  { name: "monorail_trainPassenger", length: 1 },
  { name: "monorail_trainPassenger", length: 1 },
  { name: "monorail_trainEnd", length: 1 },
]
const CAR_SCALE = 3.4
const CAR_OFFSETS = TRAIN.reduce<number[]>((offsets, car, index) => {
  if (index === 0) return [0]
  const previous = TRAIN[index - 1]
  return [...offsets, offsets[index - 1] + ((previous.length + car.length) / 2) * CAR_SCALE - 0.02]
}, [])

export function Monorail({ animate }: { animate: boolean }) {
  const { radius, height, tilt } = MONORAIL
  const train = useRef<THREE.Group>(null)
  // Rectangular beam: a rectangle profile lathed around the park's vertical axis.
  const beam = useMemo(() => {
    const w = 0.6
    const h = 0.45
    const profile = [
      [radius - w, -h],
      [radius + w, -h],
      [radius + w, h],
      [radius - w, h],
      [radius - w, -h],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(profile, 256)
  }, [radius])
  const stripe = useMemo(() => {
    const geometry = new THREE.RingGeometry(radius - 0.14, radius + 0.14, 256)
    geometry.rotateX(-Math.PI / 2)
    return geometry
  }, [radius])
  const glow = useMemo(() => {
    const geometry = new THREE.RingGeometry(radius - 0.75, radius + 0.75, 256)
    geometry.rotateX(-Math.PI / 2)
    return geometry
  }, [radius])

  useFrame(({ clock }) => {
    if (train.current) train.current.rotation.y = animate ? -clock.elapsedTime * 0.035 : -0.9
  })

  return (
    <group position-y={height} rotation={[tilt, 0, tilt * 0.5]}>
      <mesh geometry={beam} castShadow={false} receiveShadow>
        <meshStandardMaterial color="#D9DCEB" roughness={0.5} metalness={0.15} flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={stripe} position-y={0.46}>
        <meshBasicMaterial color={COLORS.coral} toneMapped={false} />
      </mesh>
      <mesh geometry={glow} position-y={-0.48}>
        <meshBasicMaterial color={COLORS.lavender} transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={train}>
        {TRAIN.map(({ name }, index) => {
          // Cars ride clockwise; each faces along the ring's tangent.
          const a = -CAR_OFFSETS[index] / radius
          const x = Math.sin(a) * radius
          const z = -Math.cos(a) * radius
          return (
            <group key={index} position={[x, 0.45, z]} rotation-y={Math.PI / 2 - a}>
              <Model pack="tech" name={name} scale={CAR_SCALE} rotation={Math.PI} shadows={false} />
            </group>
          )
        })}
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Park gate, ticket booths and Main Street stalls
// ---------------------------------------------------------------------------

function GateSign({ z, rotation }: { z: number; rotation: number }) {
  return (
    <Screen
      width={7.4}
      height={1.7}
      position={[0, 7.65, z]}
      rotation={[0, rotation, 0]}
      resolution={1024}
      drawKey={`gate-${rotation}`}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#0D1117"
        ctx.fillRect(0, 0, w, h)
        ctx.strokeStyle = COLORS.coral
        ctx.lineWidth = 6
        ctx.strokeRect(3, 3, w - 6, h - 6)
        ctx.textAlign = "center"
        ctx.fillStyle = COLORS.coral
        ctx.font = `500 26px ${fontFamily("--font-mono")}`
        ctx.fillText("// playable portfolio", w / 2, 52)
        ctx.fillStyle = "#E6EDF3"
        ctx.font = `400 118px ${fontFamily("--font-display")}`
        ctx.fillText(PARK_NAME, w / 2, h - 40)
        ctx.textAlign = "left"
      }}
    />
  )
}

const BOOTH_WALL = 2.6
const BOOTH_ROOF_TOP = BOOTH_WALL + 0.3

/** Open-fronted booth with a crew member behind the counter. Its front (+z) faces the visitor. */
function StaffedCounter({ width, vendor, roofColor }: { width: number; vendor: GuestModel; roofColor: string }) {
  return (
    <group>
      <mesh position={[0, BOOTH_WALL / 2, -0.85]} castShadow receiveShadow>
        <boxGeometry args={[width, BOOTH_WALL, 0.15]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      {/* Light inner wall, so the crew member reads against it */}
      <mesh position={[0, 1.6, -0.77]}>
        <boxGeometry args={[width - 0.3, 1.8, 0.02]} />
        <primitive object={SHARED.pale} attach="material" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 - 0.075), BOOTH_WALL / 2, 0]} castShadow>
          <boxGeometry args={[0.15, BOOTH_WALL, 1.85]} />
          <primitive object={SHARED.slate} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0.68]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.3, 1.0, 0.45]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      <mesh position={[0, 1.04, 0.7]} receiveShadow>
        <boxGeometry args={[width - 0.1, 0.08, 0.6]} />
        <primitive object={SHARED.pale} attach="material" />
      </mesh>
      <mesh position-y={BOOTH_WALL + 0.15} castShadow>
        <boxGeometry args={[width + 0.4, 0.3, 2.3]} />
        <meshStandardMaterial color={roofColor} roughness={0.6} />
      </mesh>
      {/* The crew member stands on a step behind the counter */}
      <mesh position={[0, 0.11, -0.3]}>
        <boxGeometry args={[width - 0.3, 0.22, 0.9]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      {/* Kenney's characters face -z, so the crew member is turned to face the counter */}
      <Model pack="tech" name={vendor} position={[0, 0.22, -0.3]} scale={2.1} rotation={Math.PI} />
    </group>
  )
}

function Booth({ x, label, vendor }: (typeof FEATURES.booths)[number]) {
  return (
    <group position={[x, 0, FEATURES.gate.position[1]]}>
      <StaffedCounter width={2.4} vendor={vendor} roofColor={COLORS.coral} />
      <Screen
        width={1.9}
        height={0.38}
        position={[0, BOOTH_WALL + 0.15, 1.16]}
        resolution={320}
        drawKey={`booth-${label}`}
        draw={(ctx, w, h) => {
          ctx.fillStyle = COLORS.coral
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = "#0D1117"
          ctx.font = `600 30px ${fontFamily("--font-mono")}`
          ctx.textAlign = "center"
          ctx.fillText(label, w / 2, h - 18)
        }}
      />
    </group>
  )
}

export function ParkGate({ animate }: { animate: boolean }) {
  const { position, halfWidth } = FEATURES.gate
  const ring = useMemo(() => new THREE.TorusGeometry(1.5, 0.08, 6, 48), [])
  const ringRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ringRef.current) ringRef.current.rotation.z = animate ? clock.elapsedTime * 0.4 : 0.5
  })
  return (
    <StaticBatch>
      <group position={[0, 0, position[1]]}>
        {[-halfWidth, halfWidth].map((x) => (
          <group key={x} position-x={x}>
            <mesh position-y={3.4} castShadow>
              <boxGeometry args={[1.0, 6.8, 1.0]} />
              <primitive object={SHARED.slate} attach="material" />
            </mesh>
            {[1.6, 3.4, 5.2].map((y) => (
              <mesh key={y} position-y={y}>
                <boxGeometry args={[1.06, 0.16, 1.06]} />
                <meshBasicMaterial color={COLORS.coral} toneMapped={false} />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position-y={7.65} castShadow>
          <boxGeometry args={[halfWidth * 2 + 1.4, 2.0, 0.6]} />
          <primitive object={SHARED.ink} attach="material" />
        </mesh>
        <GateSign z={0.31} rotation={0} />
        <GateSign z={-0.31} rotation={Math.PI} />
        {/* Planet ornament */}
        <group position-y={10.2}>
          <mesh>
            <sphereGeometry args={[0.95, 24, 16]} />
            <meshStandardMaterial color={COLORS.lavender} emissive={COLORS.lavender} emissiveIntensity={0.3} roughness={0.5} />
          </mesh>
          <mesh ref={ringRef} geometry={ring} rotation-x={Math.PI / 2.4} userData={{ dynamic: true }}>
            <meshBasicMaterial color={COLORS.coral} toneMapped={false} />
          </mesh>
        </group>
      </group>
      {FEATURES.booths.map((booth) => (
        <Booth key={booth.label} {...booth} />
      ))}
      {[-10.5, 10.5].map((x, i) => (
        <group key={x} position={[x, 0, position[1] + 0.5]}>
          <mesh position-y={3.2} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 6.4, 6]} />
            <primitive object={SHARED.pale} attach="material" />
          </mesh>
          <mesh position={[0.65 * (i ? -1 : 1), 5.6, 0]}>
            <planeGeometry args={[1.2, 1.5]} />
            <meshStandardMaterial color={i ? COLORS.lavender : COLORS.coral} side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </StaticBatch>
  )
}

function useStripeTexture(color: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 8
    const ctx = canvas.getContext("2d")!
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? "#E6EDF3" : color
      ctx.fillRect(i * 8, 0, 8, 8)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.magFilter = THREE.NearestFilter
    return texture
  }, [color])
}

interface Goods {
  pack: PackName
  name: string
  scale: number
  /** Extra turn, for models whose front is -z (Kenney's characters). */
  turn?: number
}

// What each stall sells: four items on the counter, a giant one on the roof, and the menu.
const STALL_GOODS: Record<StallKind, { items: Goods[]; mascot?: Goods & { upright?: boolean }; menu: [string, string][] }> = {
  donuts: {
    items: [
      { pack: "food", name: "donut-sprinkles", scale: 2.4 },
      { pack: "food", name: "donut-chocolate", scale: 2.4 },
      { pack: "food", name: "donut", scale: 2.4 },
      { pack: "food", name: "cup-coffee", scale: 2.4 },
    ],
    mascot: { pack: "food", name: "donut-sprinkles", scale: 6.5, upright: true },
    menu: [["glazed orbit", "3 cr"], ["sprinkle nebula", "4 cr"], ["choco crater", "4 cr"]],
  },
  burgers: {
    items: [
      { pack: "food", name: "burger-cheese", scale: 2.0 },
      { pack: "food", name: "fries", scale: 2.0 },
      { pack: "food", name: "hot-dog", scale: 1.7 },
      { pack: "food", name: "soda-can", scale: 2.0 },
    ],
    mascot: { pack: "food", name: "burger", scale: 3.6 },
    menu: [["meteor burger", "6 cr"], ["crater fries", "3 cr"], ["comet dog", "5 cr"]],
  },
  cones: {
    items: [
      { pack: "food", name: "ice-cream", scale: 2.0 },
      { pack: "food", name: "sundae", scale: 1.6 },
      { pack: "food", name: "ice-cream-cup", scale: 2.4 },
      { pack: "food", name: "popsicle", scale: 2.2 },
    ],
    mascot: { pack: "food", name: "ice-cream", scale: 3.6 },
    menu: [["galaxy swirl", "4 cr"], ["supernova sundae", "6 cr"], ["polar pop", "2 cr"]],
  },
  drinks: {
    items: [
      { pack: "food", name: "soda", scale: 2.0 },
      { pack: "food", name: "frappe", scale: 1.8 },
      { pack: "food", name: "cocktail", scale: 1.8 },
      { pack: "food", name: "soda-can", scale: 2.0 },
    ],
    mascot: { pack: "food", name: "frappe", scale: 3.4 },
    menu: [["rocket fuel cola", "3 cr"], ["nebula frappe", "5 cr"], ["zero-g fizz", "4 cr"]],
  },
  bakery: {
    items: [
      { pack: "food", name: "cupcake", scale: 1.9 },
      { pack: "food", name: "muffin", scale: 2.2 },
      { pack: "food", name: "cookie-chocolate", scale: 3.2 },
      { pack: "food", name: "lollypop", scale: 2.2 },
    ],
    mascot: { pack: "food", name: "cupcake", scale: 3.8 },
    menu: [["moon muffin", "3 cr"], ["star cupcake", "4 cr"], ["cosmic cookie", "2 cr"]],
  },
  souvenirs: {
    items: [
      { pack: "tech", name: "craft_speederA", scale: 0.55 },
      { pack: "tech", name: "alien", scale: 0.75, turn: Math.PI },
      { pack: "tech", name: "astronautA", scale: 0.75, turn: Math.PI },
      { pack: "tech", name: "craft_racer", scale: 0.5 },
    ],
    menu: [["mini rocket", "12 cr"], ["alien plush", "8 cr"], ["park map", "free"]],
  },
}

const STALL_WIDTH = 3.0
const COUNTER_TOP = 1.08
// Goods sit either side of the crew member, keeping the middle of the counter clear.
const GOODS_X = [-1.05, -0.56, 0.56, 1.05]

/** A ringed planet ornament (the souvenir shop's roof sign). */
function PlanetOrnament({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.62, 20, 14]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0, 0.3]}>
        <torusGeometry args={[0.95, 0.06, 6, 40]} />
        <meshBasicMaterial color={COLORS.yellow} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Main Street snack stall: a staffed counter, the goods on display, a menu and a giant roof sign. */
function Stall({ position, rotation, name, kind, color, vendor }: StallSpot) {
  const stripes = useStripeTexture(color)
  const goods = STALL_GOODS[kind]
  const roofTop = BOOTH_ROOF_TOP
  return (
    <group position={[position[0], 0, position[1]]} rotation-y={rotation}>
      <StaffedCounter width={STALL_WIDTH} vendor={vendor} roofColor="#3A4250" />
      {/* Striped awning sloping down from the roof's front edge */}
      <mesh position={[0, BOOTH_WALL - 0.2, 1.55]} rotation-x={0.42} castShadow>
        <boxGeometry args={[STALL_WIDTH + 0.4, 0.08, 0.9]} />
        <meshStandardMaterial map={stripes} roughness={0.8} />
      </mesh>
      {goods.items.map((item, index) => (
        <Model
          key={index}
          pack={item.pack}
          name={item.name}
          position={[GOODS_X[index], COUNTER_TOP, 0.72]}
          rotation={(index % 2 ? -0.4 : 0.35) + (item.turn ?? 0)}
          scale={item.scale}
        />
      ))}
      {/* Giant roof sign on a short pedestal behind the name board */}
      <mesh position={[0, roofTop + 0.17, -0.45]} castShadow>
        <cylinderGeometry args={[0.36, 0.42, 0.34, 10]} />
        <primitive object={SHARED.steel} attach="material" />
      </mesh>
      <group position={[0, roofTop + 0.34, -0.45]}>
        {goods.mascot ? (
          goods.mascot.upright ? (
            <group position-y={0.93} rotation-x={Math.PI / 2}>
              <Model pack={goods.mascot.pack} name={goods.mascot.name} position={[0, -0.3, 0]} scale={goods.mascot.scale} />
            </group>
          ) : (
            <Model pack={goods.mascot.pack} name={goods.mascot.name} scale={goods.mascot.scale} rotation={0.4} />
          )
        ) : (
          <group position-y={0.9}>
            <PlanetOrnament color={color} />
          </group>
        )}
      </group>
      <mesh position={[0, roofTop + 0.33, 0.98]} castShadow>
        <boxGeometry args={[STALL_WIDTH, 0.6, 0.08]} />
        <primitive object={SHARED.ink} attach="material" />
      </mesh>
      <Screen
        width={STALL_WIDTH - 0.1}
        height={0.5}
        position={[0, roofTop + 0.33, 1.025]}
        resolution={480}
        drawKey={`stall-${name}`}
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#0D1117"
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = color
          ctx.fillRect(0, h - 6, w, 6)
          ctx.fillStyle = "#E6EDF3"
          ctx.font = `400 50px ${fontFamily("--font-display")}`
          ctx.textAlign = "center"
          ctx.fillText(name, w / 2, h - 24)
        }}
      />
      {/* The menu, on the front of the counter */}
      <Screen
        width={STALL_WIDTH - 0.5}
        height={0.62}
        position={[0, 0.52, 0.915]}
        resolution={480}
        drawKey={`menu-${name}`}
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#0D1117"
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = color
          ctx.fillRect(0, 0, 6, h)
          ctx.font = `500 22px ${fontFamily("--font-mono")}`
          goods.menu.forEach(([item, price], index) => {
            const y = 40 + index * 38
            ctx.fillStyle = "#E6EDF3"
            ctx.textAlign = "left"
            ctx.fillText(item, 26, y)
            ctx.fillStyle = color
            ctx.textAlign = "right"
            ctx.fillText(price, w - 22, y)
          })
          ctx.textAlign = "left"
        }}
      />
    </group>
  )
}

export function MainStreet() {
  return (
    <StaticBatch>
      {FEATURES.stalls.map((stall) => (
        <Stall key={stall.name} {...stall} />
      ))}
    </StaticBatch>
  )
}

// ---------------------------------------------------------------------------
// Park benches: wooden slats on a cast-iron frame, instanced (two draw calls for all of them)
// ---------------------------------------------------------------------------

const BENCH_SCALE = 1.15

function benchGeometries() {
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, tilt = 0) =>
    new THREE.BoxGeometry(w, h, d).rotateX(tilt).translate(x, y, z)
  const wood = [
    ...[-0.17, 0, 0.17].map((z) => box(2.0, 0.055, 0.15, 0, 0.5, z)),
    box(2.0, 0.13, 0.045, 0, 0.74, -0.31, -0.2),
    box(2.0, 0.13, 0.045, 0, 0.92, -0.345, -0.2),
  ]
  const iron = [-0.86, 0.86].flatMap((x) => [
    box(0.07, 0.5, 0.07, x, 0.25, 0.19),
    box(0.07, 1.02, 0.07, x, 0.51, -0.28, -0.2),
    box(0.07, 0.06, 0.58, x, 0.45, -0.03),
    box(0.07, 0.05, 0.5, x, 0.7, -0.02),
    box(0.06, 0.2, 0.06, x, 0.58, 0.2),
  ])
  return { wood: mergeGeometries(wood)!, iron: mergeGeometries(iron)! }
}

export function ParkBenches() {
  const { wood, iron } = useMemo(benchGeometries, [])
  const woodMesh = useRef<THREE.InstancedMesh>(null)
  const ironMesh = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    BENCHES.forEach((bench, index) => {
      dummy.position.set(bench.position[0], 0, bench.position[1])
      dummy.rotation.set(0, bench.rotation, 0)
      dummy.scale.setScalar(BENCH_SCALE)
      dummy.updateMatrix()
      woodMesh.current?.setMatrixAt(index, dummy.matrix)
      ironMesh.current?.setMatrixAt(index, dummy.matrix)
    })
    for (const mesh of [woodMesh.current, ironMesh.current]) {
      if (!mesh) continue
      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    }
  }, [])
  return (
    <group>
      <instancedMesh ref={woodMesh} args={[wood, undefined, BENCHES.length]} castShadow receiveShadow>
        <meshStandardMaterial color="#B9875A" roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={ironMesh} args={[iron, SHARED.slate, BENCHES.length]} castShadow />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Lamp posts and guests (instanced)
// ---------------------------------------------------------------------------

export function LampPosts() {
  const poles = useRef<THREE.InstancedMesh>(null)
  const bulbs = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    LAMPS.forEach(([x, z], i) => {
      dummy.position.set(x, 1.6, z)
      dummy.updateMatrix()
      poles.current?.setMatrixAt(i, dummy.matrix)
      dummy.position.set(x, 3.35, z)
      dummy.updateMatrix()
      bulbs.current?.setMatrixAt(i, dummy.matrix)
    })
    if (poles.current) poles.current.instanceMatrix.needsUpdate = true
    if (bulbs.current) bulbs.current.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <group>
      <instancedMesh ref={poles} args={[undefined, undefined, LAMPS.length]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 3.2, 6]} />
        <primitive object={SHARED.steel} attach="material" />
      </instancedMesh>
      <instancedMesh ref={bulbs} args={[undefined, undefined, LAMPS.length]}>
        <sphereGeometry args={[0.24, 12, 8]} />
        <meshBasicMaterial color="#FFE7B0" toneMapped={false} />
      </instancedMesh>
    </group>
  )
}

export function Guests() {
  const groups = useMemo(() => {
    const byModel = new Map<GuestModel, InstanceTransform[]>()
    for (const guest of GUESTS) {
      if (!byModel.has(guest.model)) byModel.set(guest.model, [])
      byModel.get(guest.model)!.push({ position: [guest.position[0], 0, guest.position[1]], rotation: guest.rotation, scale: 2.2 })
    }
    return Array.from(byModel.entries())
  }, [])
  return (
    <group>
      {groups.map(([model, transforms]) => (
        <InstancedModel key={model} pack="tech" name={model} transforms={transforms} />
      ))}
    </group>
  )
}
