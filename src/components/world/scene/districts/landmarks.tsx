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
import { DistrictFrame, DistrictPad, DistrictSign } from "./shared"

// ---------------------------------------------------------------------------
// skills/ — the Token Well
// ---------------------------------------------------------------------------

export function SkillsDistrict({ animate }: { animate: boolean }) {
  const orbit = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (orbit.current && animate) orbit.current.rotation.y = clock.elapsedTime * 0.5
  })
  const categories = skillCategories.map((category) => ({ ...category, color: TOKEN_COLORS[category.label] }))

  return (
    <DistrictFrame id="skills">
      <DistrictPad id="skills" />
      {/* The well */}
      <mesh position={[0, 0.35, -0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[1.55, 1.7, 0.7, 6, 1, true]} />
        <meshStandardMaterial color="#3A4250" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.5, -0.4]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[1.5, 6]} />
        <meshBasicMaterial color="#8E5BE8" toneMapped={false} />
      </mesh>
      <group ref={orbit} position={[0, 1.6, -0.4]}>
        {categories.map((category, index) => {
          const angle = (index / categories.length) * Math.PI * 2
          return (
            <mesh key={category.label} position={[Math.cos(angle) * 1.1, Math.sin(index) * 0.15, Math.sin(angle) * 1.1]} rotation-y={-angle}>
              <cylinderGeometry args={[0.24, 0.24, 0.07, 6]} />
              <meshBasicMaterial color={category.color} toneMapped={false} />
            </mesh>
          )
        })}
      </group>

      {/* Terminal screen listing the catalog */}
      <group position={[0, 0, -3.4]}>
        {[-1.75, 1.75].map((x) => (
          <mesh key={x} position={[x, 1.5, 0]} castShadow>
            <boxGeometry args={[0.14, 3.0, 0.14]} />
            <meshStandardMaterial color="#2C333E" />
          </mesh>
        ))}
        <mesh position={[0, 2.6, -0.04]} castShadow>
          <boxGeometry args={[3.7, 1.9, 0.1]} />
          <meshStandardMaterial color="#161B22" />
        </mesh>
        <Screen
          width={3.5}
          height={1.72}
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
            // Two columns so all categories fit the screen.
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
        <Model key={side} pack="tech" name="rock_crystalsLargeA" position={[side * 4.3, 0, -2.2]} scale={2.2} rotation={-side * 0.6} />
      ))}
      <DistrictSign id="skills" subtitle={`${allSkills.length} skills · ${skillCategories.length} categories`} />
    </DistrictFrame>
  )
}

// ---------------------------------------------------------------------------
// awards/ — Hall of Achievements
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

export function AwardsDistrict({ animate }: { animate: boolean }) {
  const trophy = useTrophyGeometry()
  const trophies = useRef<(THREE.Mesh | null)[]>([])
  useFrame(({ clock }) => {
    if (!animate) return
    trophies.current.forEach((mesh, index) => {
      if (mesh) mesh.rotation.y = clock.elapsedTime * 0.6 + index
    })
  })
  const pedestals: [number, number][] = [
    [-2.2, -1.3],
    [0, -0.6],
    [2.2, -1.3],
  ]

  return (
    <DistrictFrame id="awards">
      <DistrictPad id="awards" />
      <Model pack="nature" name="statue_obelisk" position={[0, 0, -2.9]} scale={4.6} />
      <Model pack="nature" name="statue_column" position={[-3.7, 0, -0.4]} scale={2.6} />
      <Model pack="nature" name="statue_column" position={[3.7, 0, -0.4]} scale={2.6} />
      {pedestals.map(([x, z], index) => {
        const award = awards[index]
        return (
          <group key={award.id} position={[x, 0, z]} rotation-y={-x * 0.12}>
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.0, 1.1, 1.0]} />
              <meshStandardMaterial color="#2C333E" roughness={0.75} />
            </mesh>
            <mesh
              ref={(node) => {
                trophies.current[index] = node
              }}
              geometry={trophy}
              position={[0, 1.1, 0]}
              scale={1.15}
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
              draw={(ctx, w, h) => {
                ctx.fillStyle = "#0D1117"
                ctx.fillRect(0, 0, w, h)
                ctx.fillStyle = COLORS.yellow
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
      <DistrictSign id="awards" subtitle="scholarship · competitions" />
    </DistrictFrame>
  )
}

// ---------------------------------------------------------------------------
// contact/ — Signal Tower and the portal home
// ---------------------------------------------------------------------------

function LatticeTower({ animate }: { animate: boolean }) {
  const beacon = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    if (beacon.current) beacon.current.opacity = animate ? (Math.sin(clock.elapsedTime * 3) > 0 ? 1 : 0.25) : 1
  })
  const height = 8.6
  const base = 1.3
  const top = 0.32
  const legs = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]
  const levels = 5
  return (
    <group>
      {legs.map(([sx, sz], index) => {
        const from = new THREE.Vector3(sx * base, 0, sz * base)
        const to = new THREE.Vector3(sx * top, height, sz * top)
        const mid = from.clone().add(to).multiplyScalar(0.5)
        const length = from.distanceTo(to)
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize())
        return (
          <mesh key={index} position={mid} quaternion={quaternion} castShadow>
            <boxGeometry args={[0.14, length, 0.14]} />
            <meshStandardMaterial color="#3A4250" roughness={0.6} />
          </mesh>
        )
      })}
      {Array.from({ length: levels }, (_, level) => {
        const y = ((level + 1) / (levels + 1)) * height
        const half = base + (top - base) * (y / height)
        return (
          <group key={level} position-y={y}>
            {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((angle) => (
              <mesh key={angle} rotation-y={angle} position={[Math.sin(angle) * half, 0, Math.cos(angle) * half]}>
                <boxGeometry args={[half * 2, 0.08, 0.08]} />
                <meshStandardMaterial color={level % 2 ? COLORS.coral : "#3A4250"} roughness={0.6} />
              </mesh>
            ))}
          </group>
        )
      })}
      <group position={[0, height, 0]}>
        <Model pack="tech" name="satelliteDish_large" scale={2.2} rotation={Math.PI} />
        <mesh position={[0, 2.0, 0]}>
          <sphereGeometry args={[0.16, 10, 8]} />
          <meshBasicMaterial ref={beacon} color="#FF5F57" transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

export function ContactDistrict({ animate }: { animate: boolean }) {
  return (
    <DistrictFrame id="contact">
      <DistrictPad id="contact" />
      <group position={[0, 0, -2.2]}>
        <LatticeTower animate={animate} />
        <Model pack="tech" name="machine_wireless" position={[0, 0, 0]} scale={2.4} />
      </group>

      {/* Contact terminal and the portal home, mirrored either side of the approach */}
      <group position={[-3.2, 0, 0.8]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1.0, 1.2, 0.7]} />
          <meshStandardMaterial color="#2C333E" roughness={0.7} />
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

      <group position={[3.2, 0, 0.8]}>
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
