"use client"

import { useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { projects } from "../../../../content/projects"
import { COLORS, GALLERY_KIOSKS, HANGAR_CRAFTS } from "../../world-config"
import { Model } from "../models"
import { Screen, drawCover, fontFamily, wrapText } from "../canvas-art"
import { DistrictFrame, DistrictPad, DistrictSign } from "./shared"
import { SHARED } from "../materials"

export const projectTextureUrl = (slug: string) => `/3d/textures/projects/${slug}.jpg`

function Kiosk({ index, image }: { index: number; image: HTMLImageElement }) {
  const kiosk = GALLERY_KIOSKS[index]
  const { project } = kiosk
  const title = project.shortTitle ?? project.title
  return (
    <group position={[kiosk.local[0], 0, kiosk.local[1]]} rotation-y={kiosk.rotation}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.84, 0.56]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      <mesh position={[0, 0.85, 0.2]}>
        <boxGeometry args={[1.8, 0.02, 0.1]} />
        <meshBasicMaterial color={COLORS.green} toneMapped={false} />
      </mesh>
      <group position={[0, 1.7, 0.02]} rotation-x={-0.12}>
        <mesh position={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[2.0, 1.36, 0.08]} />
          <primitive object={SHARED.ink} attach="material" />
        </mesh>
        <Screen
          width={1.9}
          height={1.26}
          position={[0, 0, 0.002]}
          resolution={640}
          drawKey={`kiosk-${project.slug}`}
          draw={(ctx, w, h) => {
            const bar = 116
            ctx.fillStyle = "#0D1117"
            ctx.fillRect(0, 0, w, h)
            drawCover(ctx, image, 0, 0, w, h - bar)
            ctx.fillStyle = "#0D1117"
            ctx.fillRect(0, h - bar, w, bar)
            ctx.fillStyle = COLORS.green
            ctx.fillRect(0, h - bar, w, 4)
            ctx.fillStyle = "#8B949E"
            ctx.font = `500 20px ${fontFamily("--font-mono")}`
            ctx.fillText(project.categories.join(" / ").toLowerCase(), 22, h - bar + 34)
            ctx.fillStyle = "#E6EDF3"
            ctx.font = `400 36px ${fontFamily("--font-display")}`
            const lines = wrapText(ctx, title, w - 44).slice(0, 2)
            ctx.font = `400 ${lines.length > 1 ? 30 : 38}px ${fontFamily("--font-display")}`
            lines.forEach((line, i) => ctx.fillText(line, 22, h - bar + 74 + i * 32))
          }}
        />
      </group>
    </group>
  )
}

function IndexTable({ animate }: { animate: boolean }) {
  const hologram = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!hologram.current) return
    const t = clock.elapsedTime
    hologram.current.rotation.y = animate ? t * 0.6 : 0.4
    hologram.current.position.y = 1.75 + (animate ? Math.sin(t * 1.4) * 0.08 : 0)
  })
  return (
    <group position={[0, 0, 0.2]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.95, 0.9, 6]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      <mesh position={[0, 0.91, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.72, 6]} />
        <meshBasicMaterial color={COLORS.green} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh ref={hologram} position={[0, 1.75, 0]} userData={{ dynamic: true }}>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshBasicMaterial color={COLORS.green} wireframe toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Spacecraft on slowly turning display plinths in the open front of the hangar. */
function CraftDisplays({ animate }: { animate: boolean }) {
  const turntables = useRef<(THREE.Group | null)[]>([])
  useFrame(({ clock }) => {
    turntables.current.forEach((table, index) => {
      if (table) table.rotation.y = animate ? clock.elapsedTime * 0.25 + index * 2 : index * 0.8
    })
  })
  return (
    <group>
      {HANGAR_CRAFTS.map((craft, index) => (
        <group key={craft.name} position={[craft.local[0], 0, craft.local[1]]}>
          <mesh position-y={0.25} castShadow receiveShadow>
            <cylinderGeometry args={[1.3, 1.4, 0.5, 6]} />
            <primitive object={SHARED.slate} attach="material" />
          </mesh>
          <mesh position-y={0.51} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[1.1, 1.25, 6]} />
            <meshBasicMaterial color={COLORS.green} toneMapped={false} />
          </mesh>
          <group
            ref={(node) => {
              turntables.current[index] = node
            }}
            position-y={0.95}
            userData={{ dynamic: true }}
          >
            <Model pack="tech" name={craft.name} scale={craft.scale} />
          </group>
        </group>
      ))}
    </group>
  )
}

/** Project Hangar: project kiosks around spacecraft on display. */
export function HangarDistrict({ animate }: { animate: boolean }) {
  const images = useLoader(
    THREE.ImageLoader,
    GALLERY_KIOSKS.map((kiosk) => projectTextureUrl(kiosk.slug)),
  ) as HTMLImageElement[]
  return (
    <DistrictFrame id="projects">
      <DistrictPad id="projects" />
      {GALLERY_KIOSKS.map((kiosk, index) => (
        <Kiosk key={kiosk.slug} index={index} image={images[index]} />
      ))}
      <CraftDisplays animate={animate} />
      <IndexTable animate={animate} />
      <DistrictSign id="projects" subtitle={`${GALLERY_KIOSKS.length} on display · ${projects.length} in the index`} />
    </DistrictFrame>
  )
}
