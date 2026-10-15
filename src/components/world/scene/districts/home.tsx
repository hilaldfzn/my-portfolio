"use client"

import { useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { profile } from "../../../../content/profile"
import { COLORS, HOME_LAYOUT } from "../../world-config"
import { Model } from "../models"
import { Screen, fontFamily, wrapText } from "../canvas-art"
import { DistrictFrame } from "./shared"
import { SHARED } from "../materials"

const PORTRAIT_URL = "/3d/textures/portrait.jpg"

/** Fountain with a hologram planet: the plaza's centerpiece. */
function PlanetFountain({ animate }: { animate: boolean }) {
  const planet = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (planet.current) {
      planet.current.rotation.y = animate ? t * 0.3 : 0.6
      planet.current.position.y = 2.6 + (animate ? Math.sin(t * 1.1) * 0.12 : 0)
    }
    if (ring.current) ring.current.rotation.z = animate ? t * 0.5 : 0.4
  })
  const radius = HOME_LAYOUT.fountainRadius
  return (
    <group>
      <mesh position-y={0.25} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius + 0.15, 0.5, 24]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      <mesh position-y={0.51} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[radius - 0.2, 24]} />
        <meshStandardMaterial color="#3F8FD8" emissive="#3F8FD8" emissiveIntensity={0.35} roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position-y={0.52} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[radius - 0.08, radius + 0.02, 32]} />
        <meshBasicMaterial color={COLORS.coral} toneMapped={false} />
      </mesh>
      <mesh position-y={1.5}>
        <cylinderGeometry args={[0.55, 1.2, 1.9, 24, 1, true]} />
        <meshBasicMaterial color={COLORS.lavender} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={planet} position-y={2.6} userData={{ dynamic: true }}>
        <mesh>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshBasicMaterial color={COLORS.lavender} wireframe toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.55, 20, 14]} />
          <meshStandardMaterial color="#5E5AA8" emissive="#8E5BE8" emissiveIntensity={0.5} roughness={0.5} />
        </mesh>
        <mesh ref={ring} rotation-x={Math.PI / 2.5}>
          <torusGeometry args={[1.05, 0.04, 6, 48]} />
          <meshBasicMaterial color={COLORS.coral} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

export function HomeDistrict({ animate }: { animate: boolean }) {
  const portrait = useLoader(THREE.ImageLoader, PORTRAIT_URL)
  const { monolith, plants } = HOME_LAYOUT

  return (
    <DistrictFrame id="home">
      {/* Monolith with the real portrait: the park's "README" */}
      <group position={[monolith[0], 0, monolith[1]]}>
        <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 4.0, 0.55]} />
          <primitive object={SHARED.ink} attach="material" />
        </mesh>
        <mesh position={[0, 0.07, 0]} receiveShadow>
          <boxGeometry args={[3.5, 0.14, 1.1]} />
          <primitive object={SHARED.steel} attach="material" />
        </mesh>
        <Screen
          width={2.5}
          height={3.65}
          position={[0, 2.04, 0.285]}
          resolution={600}
          drawKey="monolith"
          draw={(ctx, w, h) => {
            ctx.fillStyle = "#0D1117"
            ctx.fillRect(0, 0, w, h)
            ctx.strokeStyle = "#30363D"
            ctx.lineWidth = 4
            ctx.strokeRect(2, 2, w - 4, h - 4)
            ctx.fillStyle = COLORS.coral
            ctx.font = `500 26px ${fontFamily("--font-mono")}`
            ctx.fillText("// mission control", 40, 70)
            const size = 250
            const cx = w / 2
            const cy = 250
            ctx.save()
            ctx.beginPath()
            ctx.arc(cx, cy, size / 2, 0, Math.PI * 2)
            ctx.clip()
            const scale = Math.max(size / portrait.width, size / portrait.height)
            ctx.drawImage(portrait, cx - (portrait.width * scale) / 2, cy - (portrait.height * scale) / 2, portrait.width * scale, portrait.height * scale)
            ctx.restore()
            ctx.strokeStyle = COLORS.coral
            ctx.lineWidth = 5
            ctx.beginPath()
            ctx.arc(cx, cy, size / 2 + 6, 0, Math.PI * 2)
            ctx.stroke()
            ctx.textAlign = "center"
            ctx.fillStyle = "#E6EDF3"
            ctx.font = `400 96px ${fontFamily("--font-display")}`
            ctx.fillText(`${profile.shortName}.`, cx, 490)
            ctx.fillStyle = "#C9D1D9"
            ctx.font = `600 32px ${fontFamily("--font-body")}`
            wrapText(ctx, profile.name, w - 80).forEach((line, i) => ctx.fillText(line, cx, 552 + i * 40))
            ctx.fillStyle = "#8B949E"
            ctx.font = `400 27px ${fontFamily("--font-mono")}`
            ctx.fillText("AI Engineer", cx, 656)
            ctx.font = `400 24px ${fontFamily("--font-mono")}`
            ctx.fillText("Backend-Focused Software Engineer", cx, 694, w - 60)
            ctx.fillStyle = COLORS.coral
            ctx.font = `500 26px ${fontFamily("--font-mono")}`
            ctx.fillText("> read about me", cx, h - 52)
            ctx.textAlign = "left"
          }}
        />
      </group>
      {plants.map(([x, z]) => (
        <Model key={x} pack="furniture" name="pottedPlant" position={[x, 0, z]} scale={2.6} />
      ))}

      {/* The plaza's park benches and lamp posts are rendered with the park's (see park.tsx). */}
      <PlanetFountain animate={animate} />
    </DistrictFrame>
  )
}
