"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { awards } from "../../../../content/achievements"
import { profile } from "../../../../content/profile"
import { allSkills, skillCategories } from "../../../../content/skills"
import { COLORS, TOKEN_COLORS } from "../../world-config"
import { Model } from "../models"
import { Screen, fontFamily, wrapText } from "../canvas-art"
import { Lattice } from "../park"
import { DistrictFrame, DistrictPad, DistrictSign } from "./shared"
import { SHARED } from "../materials"

// ---------------------------------------------------------------------------
// skills/ — Tech Stack: a drop-tower ride whose tower is one layer per skill category
// ---------------------------------------------------------------------------

const LAYER_HEIGHT = 0.95
const STACK_BASE = 0.4
const DROP_CYCLE = 9

function DropTower({ animate }: { animate: boolean }) {
  const gondola = useRef<THREE.Group>(null)
  const categories = skillCategories.map((category) => ({ ...category, color: TOKEN_COLORS[category.label] }))
  const stackTop = STACK_BASE + categories.length * LAYER_HEIGHT
  const mastTop = stackTop + 5.2
  useFrame(({ clock }) => {
    if (!gondola.current) return
    if (!animate) {
      gondola.current.position.y = 3.6
      return
    }
    // Slow climb, a pause at the top, then the drop.
    const t = clock.elapsedTime % DROP_CYCLE
    const low = 0.9
    const high = mastTop - 1.4
    let y = low
    if (t < 6) y = low + (high - low) * (t / 6)
    else if (t < 7) y = high
    else if (t < 7.6) y = high - (high - low) * Math.pow((t - 7) / 0.6, 2)
    gondola.current.position.y = y
  })
  return (
    <group position={[0, 0, -1.2]}>
      <mesh position-y={0.2} castShadow receiveShadow>
        <cylinderGeometry args={[2.1, 2.2, 0.4, 6]} />
        <meshStandardMaterial color="#3A4250" roughness={0.8} flatShading />
      </mesh>
      {categories.map((category, index) => (
        <mesh key={category.label} position-y={STACK_BASE + index * LAYER_HEIGHT + LAYER_HEIGHT / 2} rotation-y={index * 0.12} castShadow receiveShadow>
          <cylinderGeometry args={[1.75 - index * 0.1, 1.8 - index * 0.1, LAYER_HEIGHT - 0.08, 6]} />
          <meshStandardMaterial color={category.color} emissive={category.color} emissiveIntensity={0.22} roughness={0.5} flatShading />
        </mesh>
      ))}
      <mesh position-y={(stackTop + mastTop) / 2}>
        <cylinderGeometry args={[0.22, 0.3, mastTop - stackTop, 8]} />
        <meshStandardMaterial color="#D9DCEB" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position-y={mastTop + 0.2}>
        <sphereGeometry args={[0.3, 12, 10]} />
        <meshBasicMaterial color="#FF5F57" toneMapped={false} />
      </mesh>
      <group ref={gondola} position-y={3.6} userData={{ dynamic: true }}>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[2.25, 0.16, 8, 36]} />
          <meshStandardMaterial color="#D9DCEB" roughness={0.45} metalness={0.2} />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 2.55, -0.15, Math.sin(a) * 2.55]} rotation-y={-a}>
              <boxGeometry args={[0.45, 0.55, 0.5]} />
              <meshStandardMaterial color={categories[i % categories.length].color} roughness={0.5} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

export function SkillsDistrict({ animate }: { animate: boolean }) {
  const categories = skillCategories.map((category) => ({ ...category, color: TOKEN_COLORS[category.label] }))
  return (
    <DistrictFrame id="skills">
      <DistrictPad id="skills" />
      <DropTower animate={animate} />

      {/* Terminal screen listing the catalog */}
      <group position={[0, 0, -6.0]}>
        {[-1.85, 1.85].map((x) => (
          <mesh key={x} position={[x, 1.5, 0]} castShadow>
            <boxGeometry args={[0.14, 3.0, 0.14]} />
            <primitive object={SHARED.slate} attach="material" />
          </mesh>
        ))}
        <mesh position={[0, 2.6, -0.04]} castShadow>
          <boxGeometry args={[3.9, 1.95, 0.1]} />
          <primitive object={SHARED.ink} attach="material" />
        </mesh>
        <Screen
          width={3.7}
          height={1.78}
          position={[0, 2.6, 0.02]}
          resolution={760}
          drawKey="skills-terminal"
          draw={(ctx, w, h) => {
            ctx.fillStyle = "#0D1117"
            ctx.fillRect(0, 0, w, h)
            ctx.font = `500 28px ${fontFamily("--font-mono")}`
            ctx.fillStyle = COLORS.green
            ctx.fillText("$", 30, 54)
            ctx.fillStyle = "#E6EDF3"
            ctx.fillText(" ls skills/", 46, 54)
            const rows = Math.ceil(categories.length / 2)
            categories.forEach((category, index) => {
              const column = Math.floor(index / rows)
              const x = 34 + column * (w / 2)
              const y = 124 + (index % rows) * 78
              ctx.fillStyle = category.color
              ctx.fillRect(x, y - 22, 16, 16)
              ctx.fillStyle = "#E6EDF3"
              ctx.font = `500 26px ${fontFamily("--font-mono")}`
              ctx.fillText(`${category.label}/`, x + 30, y - 6, w / 2 - 70)
              ctx.fillStyle = "#8B949E"
              ctx.font = `400 21px ${fontFamily("--font-mono")}`
              ctx.fillText(`${category.skills.length} items`, x + 30, y + 24)
            })
          }}
        />
      </group>

      {[-1, 1].map((side) => (
        <Model key={side} pack="tech" name="rock_crystalsLargeA" position={[side * 5.0, 0, -3.2]} scale={2.3} rotation={-side * 0.6} />
      ))}
      <DistrictSign id="skills" subtitle={`${allSkills.length} skills · ${skillCategories.length} categories`} />
    </DistrictFrame>
  )
}

// ---------------------------------------------------------------------------
// awards/ — Hall of Achievements, with a walk of fame leading in
// ---------------------------------------------------------------------------

function useTrophyGeometry() {
  return useMemo(() => {
    const points = [
      [0.0, 0],
      [0.28, 0],
      [0.28, 0.06],
      [0.08, 0.12],
      [0.06, 0.38],
      [0.12, 0.44],
      [0.34, 0.6],
      [0.4, 0.92],
      [0.36, 0.94],
      [0.3, 0.66],
      [0.0, 0.6],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(points, 10)
  }, [])
}

function useStarGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape()
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.2 : 0.48
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [])
}

export function AwardsDistrict({ animate }: { animate: boolean }) {
  const trophy = useTrophyGeometry()
  const star = useStarGeometry()
  const trophies = useRef<(THREE.Mesh | null)[]>([])
  useFrame(({ clock }) => {
    if (!animate) return
    trophies.current.forEach((mesh, index) => {
      if (mesh) mesh.rotation.y = clock.elapsedTime * 0.6 + index
    })
  })
  const pedestals: [number, number][] = [
    [-2.6, -1.6],
    [0, -0.8],
    [2.6, -1.6],
  ]

  return (
    <DistrictFrame id="awards">
      <DistrictPad id="awards" />
      <Model pack="nature" name="statue_obelisk" position={[0, 0, -3.6]} scale={5.4} />
      <Model pack="nature" name="statue_column" position={[-4.4, 0, -0.6]} scale={2.8} />
      <Model pack="nature" name="statue_column" position={[4.4, 0, -0.6]} scale={2.8} />
      {pedestals.map(([x, z], index) => {
        const award = awards[index]
        return (
          <group key={award.id} position={[x, 0, z]} rotation-y={-x * 0.1}>
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.0, 1.1, 1.0]} />
              <primitive object={SHARED.slate} attach="material" />
            </mesh>
            <mesh
              ref={(node) => {
                trophies.current[index] = node
              }}
              geometry={trophy}
              position={[0, 1.1, 0]}
              userData={{ dynamic: true }}
              scale={1.2}
              castShadow
            >
              <meshStandardMaterial color={COLORS.yellow} metalness={0.55} roughness={0.32} flatShading />
            </mesh>
            <Screen
              width={0.9}
              height={0.62}
              position={[0, 0.62, 0.505]}
              resolution={360}
              drawKey={`plaque-${award.id}`}
              draw={(ctx, w) => {
                ctx.fillStyle = "#0D1117"
                ctx.fillRect(0, 0, w, 248)
                ctx.fillStyle = COLORS.orange
                ctx.font = `500 22px ${fontFamily("--font-mono")}`
                ctx.fillText(award.year, 20, 40)
                ctx.fillStyle = "#E6EDF3"
                ctx.font = `400 30px ${fontFamily("--font-display")}`
                wrapText(ctx, award.title, w - 40)
                  .slice(0, 3)
                  .forEach((line, i) => ctx.fillText(line, 20, 90 + i * 34))
              }}
            />
          </group>
        )
      })}
      {/* Walk of fame */}
      {[2.8, 4.3, 5.8, 7.3].map((z, index) => (
        <mesh key={z} geometry={star} position={[index % 2 ? 1.0 : -1.0, 0.04, z]} rotation-x={-Math.PI / 2}>
          <meshBasicMaterial color={COLORS.orange} toneMapped={false} />
        </mesh>
      ))}
      <DistrictSign id="awards" subtitle="scholarship · competitions" />
    </DistrictFrame>
  )
}

// ---------------------------------------------------------------------------
// contact/ — Contact Hub: comms tower, contact terminal and the portal home
// ---------------------------------------------------------------------------

export function ContactDistrict({ animate }: { animate: boolean }) {
  const beacon = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    if (beacon.current) beacon.current.opacity = animate ? (Math.sin(clock.elapsedTime * 3) > 0 ? 1 : 0.25) : 1
  })
  return (
    <DistrictFrame id="contact">
      <DistrictPad id="contact" />
      <group position={[0, 0, -2.6]}>
        <Lattice height={9} base={1.4} top={0.34} levels={5} accent={COLORS.coral} />
        <group position-y={9}>
          <Model pack="tech" name="satelliteDish_large" scale={2.3} rotation={Math.PI} />
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.17, 10, 8]} />
            <meshBasicMaterial ref={beacon} color="#FF5F57" transparent toneMapped={false} />
          </mesh>
        </group>
        <Model pack="tech" name="machine_wireless" scale={2.4} />
      </group>

      {/* Contact terminal and the portal home, mirrored either side of the approach */}
      <group position={[-3.4, 0, 1.0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1.0, 1.2, 0.7]} />
          <primitive object={SHARED.slate} attach="material" />
        </mesh>
        <Screen
          width={1.0}
          height={0.66}
          position={[0, 1.5, 0.12]}
          rotation={[-0.3, 0, 0]}
          resolution={420}
          drawKey="contact-terminal"
          draw={(ctx, w, h) => {
            ctx.fillStyle = "#0D1117"
            ctx.fillRect(0, 0, w, h)
            ctx.fillStyle = COLORS.coral
            ctx.font = `500 26px ${fontFamily("--font-mono")}`
            ctx.fillText(">_ contact", 24, 50)
            ctx.fillStyle = "#E6EDF3"
            ctx.font = `400 21px ${fontFamily("--font-mono")}`
            ctx.fillText(profile.email, 24, 120, w - 48)
            ctx.fillStyle = "#8B949E"
            ctx.fillText("resume · github · linkedin", 24, 168, w - 48)
            ctx.fillStyle = COLORS.green
            ctx.fillText("● open to opportunities", 24, h - 34, w - 48)
          }}
        />
      </group>
      <group position={[3.4, 0, 1.0]}>
        <Model pack="tech" name="gate_complex" scale={3.2} />
        <mesh position={[0, 1.45, 0]}>
          <planeGeometry args={[1.5, 2.3]} />
          <meshBasicMaterial color={COLORS.coral} transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
        </mesh>
      </group>

      <DistrictSign id="contact" subtitle="resume · email · github · linkedin" />
    </DistrictFrame>
  )
}
