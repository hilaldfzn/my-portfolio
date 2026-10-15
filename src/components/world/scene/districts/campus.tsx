"use client"

import { useMemo, useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { education } from "../../../../content/profile"
import { experiences } from "../../../../content/experience"
import { COLORS } from "../../world-config"
import { InstancedModel, Model, type InstanceTransform } from "../models"
import { Screen, fontFamily, wrapText } from "../canvas-art"
import { DistrictFrame, DistrictPad, DistrictSign } from "./shared"
import { SHARED } from "../materials"

const UI_YELLOW = COLORS.yellow
const UI_LOGO_URL = "/3d/textures/ui-logo.png"

const SEATS = [0, 1.3].flatMap((z) => [-1.3, 0, 1.3].map((x) => [x, z] as const))
const DESKS: InstanceTransform[] = SEATS.map(([x, z]) => ({ position: [x, 0, z - 0.5], scale: 1.6 }))
const CHAIRS: InstanceTransform[] = SEATS.map(([x, z]) => ({ position: [x, 0, z + 0.1], rotation: Math.PI, scale: 2.2 }))
const COLUMNS: InstanceTransform[] = [-4.6, -3.0, 3.0, 4.6].map((x) => ({ position: [x, 0, 1.8], scale: 2.8 }))

/** Rectorate-style tower flanked by lecture-hall wings, with columns along the front. */
function CampusBuilding() {
  const logo = useLoader(THREE.TextureLoader, UI_LOGO_URL)
  useMemo(() => {
    logo.colorSpace = THREE.SRGBColorSpace
    logo.anisotropy = 4
  }, [logo])
  return (
    <group position={[0, 0, -7.2]}>
      {/* Wings */}
      <mesh position-y={1.7} castShadow receiveShadow>
        <boxGeometry args={[10.8, 3.4, 2.6]} />
        <meshStandardMaterial color="#E4E2EE" roughness={0.75} />
      </mesh>
      <mesh position-y={3.5}>
        <boxGeometry args={[11.2, 0.2, 3.0]} />
        <meshStandardMaterial color={UI_YELLOW} roughness={0.6} />
      </mesh>
      {[-1, 1].map((side) =>
        [0, 1, 2].map((i) => (
          <mesh key={`${side}-${i}`} position={[side * (2.6 + i * 1.0), 2.15, 1.34]}>
            <planeGeometry args={[0.6, 1.6]} />
            <primitive object={SHARED.slate} attach="material" />
          </mesh>
        )),
      )}
      {/* Tower */}
      <mesh position-y={5.5} castShadow receiveShadow>
        <boxGeometry args={[3.0, 11, 3.2]} />
        <meshStandardMaterial color="#ECEAF4" roughness={0.7} />
      </mesh>
      {[-1.05, -0.35, 0.35, 1.05].map((x) => (
        <mesh key={x} position={[x, 5.6, 1.62]}>
          <boxGeometry args={[0.16, 9.6, 0.12]} />
          <meshStandardMaterial color="#C9C6D9" roughness={0.6} />
        </mesh>
      ))}
      <mesh position-y={11.6}>
        <coneGeometry args={[2.3, 1.4, 4]} />
        <meshStandardMaterial color={UI_YELLOW} roughness={0.6} flatShading />
      </mesh>
      <mesh position={[0, 8.6, 1.76]}>
        <planeGeometry args={[2.3, 2.5]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
      {/* Name board mounted in front of the tower (not on its face, which made the text z-fight) */}
      <mesh position={[0, 2.95, 1.71]} castShadow>
        <boxGeometry args={[5.8, 0.76, 0.1]} />
        <primitive object={SHARED.ink} attach="material" />
      </mesh>
      <Screen
        width={5.6}
        height={0.6}
        position={[0, 2.95, 1.77]}
        resolution={900}
        drawKey="campus-name"
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#161B22"
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = UI_YELLOW
          ctx.font = `600 52px ${fontFamily("--font-mono")}`
          ctx.textAlign = "center"
          ctx.fillText("UNIVERSITAS INDONESIA", w / 2, h - 28)
        }}
      />
      <InstancedModel pack="nature" name="statue_column" transforms={COLUMNS} />
    </group>
  )
}

/** Teaching assistant classroom: a chalkboard and two rows of seats. */
function Classroom() {
  const ta = experiences.find((item) => item.id === "ui-teaching-assistant")!
  return (
    <group position={[-5.2, 0, 0]}>
      <group position={[0, 0, -2.4]}>
        {[-1.95, 1.95].map((x) => (
          <mesh key={x} position={[x, 1.25, 0]} castShadow>
            <boxGeometry args={[0.14, 2.5, 0.14]} />
            <meshStandardMaterial color="#6B5A8E" />
          </mesh>
        ))}
        <mesh position={[0, 1.75, -0.03]} castShadow>
          <boxGeometry args={[4.1, 1.75, 0.08]} />
          <meshStandardMaterial color="#4B3F2E" />
        </mesh>
        <Screen
          width={3.9}
          height={1.55}
          position={[0, 1.75, 0.02]}
          resolution={800}
          drawKey="chalkboard"
          draw={(ctx, w, h) => {
            ctx.fillStyle = "#1F3A33"
            ctx.fillRect(0, 0, w, h)
            ctx.fillStyle = "#E6EDF3"
            ctx.font = `400 46px ${fontFamily("--font-display")}`
            ctx.fillText("Teaching Assistant", 30, 64)
            ctx.fillStyle = UI_YELLOW
            ctx.font = `500 24px ${fontFamily("--font-mono")}`
            ctx.fillText(ta.period, 32, 104)
            ctx.fillStyle = "#C9D1D9"
            ctx.font = `400 25px ${fontFamily("--font-mono")}`
            ;["Computer Vision", "Statistics & Probability", "Calculus 2"].forEach((course, i) => ctx.fillText(`· ${course}`, 32, 160 + i * 38))
            ctx.fillStyle = "#E6EDF3"
            ctx.font = `400 64px ${fontFamily("--font-display")}`
            ctx.fillText("250+", w - 210, 210)
            ctx.font = `400 22px ${fontFamily("--font-mono")}`
            ctx.fillStyle = "#C9D1D9"
            ctx.fillText("students tutored", w - 230, 250)
          }}
        />
      </group>
      <InstancedModel pack="furniture" name="desk" transforms={DESKS} />
      <InstancedModel pack="furniture" name="chair" transforms={CHAIRS} />
    </group>
  )
}

function Booth({ position, title, period, color }: { position: [number, number]; title: string; period: string; color: string }) {
  const stripes = useMemo(() => {
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
  return (
    <group position={[position[0], 0, position[1]]} rotation-y={-Math.PI / 2}>
      <mesh position-y={0.55} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.1, 1.2]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 1.65, -0.45]}>
          <boxGeometry args={[0.1, 1.9, 0.1]} />
          <primitive object={SHARED.pale} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, 2.65, 0.05]} rotation-x={0.35} castShadow>
        <boxGeometry args={[2.8, 0.12, 1.8]} />
        <meshStandardMaterial map={stripes} roughness={0.8} />
      </mesh>
      <Screen
        width={2.3}
        height={0.7}
        position={[0, 0.62, 0.61]}
        resolution={420}
        drawKey={`booth-${title}`}
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#0D1117"
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = color
          ctx.fillRect(0, 0, 8, h)
          ctx.fillStyle = "#E6EDF3"
          ctx.font = `400 46px ${fontFamily("--font-display")}`
          ctx.fillText(title, 26, 62, w - 40)
          ctx.fillStyle = "#8B949E"
          ctx.font = `400 20px ${fontFamily("--font-mono")}`
          ctx.fillText(period, 28, h - 22, w - 40)
        }}
      />
    </group>
  )
}

/** Graduation-cap monument with the degree plaque. */
function EducationMonument({ animate }: { animate: boolean }) {
  const cap = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!cap.current) return
    cap.current.rotation.y = animate ? clock.elapsedTime * 0.4 : 0.5
    cap.current.position.y = 1.75 + (animate ? Math.sin(clock.elapsedTime * 1.2) * 0.08 : 0)
  })
  return (
    <group position={[0, 0, 0.4]}>
      <mesh position-y={0.55} castShadow receiveShadow>
        <boxGeometry args={[1.3, 1.1, 1.3]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      <group ref={cap} position-y={1.75} userData={{ dynamic: true }}>
        <mesh position-y={-0.18}>
          <cylinderGeometry args={[0.42, 0.46, 0.36, 16]} />
          <meshStandardMaterial color="#1C1F2B" roughness={0.6} />
        </mesh>
        <mesh rotation-y={Math.PI / 4}>
          <boxGeometry args={[1.25, 0.08, 1.25]} />
          <meshStandardMaterial color="#1C1F2B" roughness={0.6} />
        </mesh>
        <mesh position={[0.5, -0.2, 0.0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.45, 6]} />
          <meshStandardMaterial color={UI_YELLOW} />
        </mesh>
        <mesh position={[0.5, -0.46, 0]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color={UI_YELLOW} />
        </mesh>
      </group>
      <Screen
        width={1.2}
        height={0.8}
        position={[0, 0.58, 0.66]}
        resolution={420}
        drawKey="education-plaque"
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#0D1117"
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = UI_YELLOW
          ctx.font = `500 20px ${fontFamily("--font-mono")}`
          ctx.fillText("// education", 22, 40)
          ctx.fillStyle = "#E6EDF3"
          ctx.font = `400 40px ${fontFamily("--font-display")}`
          wrapText(ctx, education.degree, w - 44).forEach((line, i) => ctx.fillText(line, 22, 96 + i * 40))
          ctx.fillStyle = "#8B949E"
          ctx.font = `400 20px ${fontFamily("--font-mono")}`
          ctx.fillText(education.period, 22, h - 64)
          ctx.fillText(`CGPA ${education.gpa}`, 22, h - 30)
        }}
      />
    </group>
  )
}

/** Universitas Indonesia: studies, teaching assistantships and student organizations. */
export function CampusDistrict({ animate }: { animate: boolean }) {
  const okk = experiences.find((item) => item.id === "okk-ui-2024")!
  const compfest = experiences.find((item) => item.id === "compfest-15")!
  return (
    <DistrictFrame id="campus">
      <DistrictPad id="campus" />
      <CampusBuilding />
      <Classroom />
      <Booth position={[5.4, -2.0]} title={okk.company} period={`${okk.title} · ${okk.period}`} color={UI_YELLOW} />
      <Booth position={[5.4, 2.6]} title={compfest.company} period={`${compfest.title} · ${compfest.period}`} color={COLORS.coral} />
      <EducationMonument animate={animate} />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 8.4, 0, -3.5]}>
          <mesh position-y={2.6} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 5.2, 6]} />
            <primitive object={SHARED.pale} attach="material" />
          </mesh>
          <mesh position={[0, 3.8, 0.02]}>
            <planeGeometry args={[1.0, 2.2]} />
            <meshStandardMaterial color={UI_YELLOW} side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
        </group>
      ))}
      <Model pack="tech" name="astronautA" position={[3.2, 0, -0.2]} scale={2.2} rotation={1.4} />
      <Model pack="tech" name="astronautB" position={[-3.0, 0, 2.6]} scale={2.2} rotation={-2.6} />
      <DistrictSign id="campus" />
    </DistrictFrame>
  )
}
