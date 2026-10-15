"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { COLORS } from "../../world-config"
import { Model } from "../models"
import { Screen, fontFamily } from "../canvas-art"
import { DistrictFrame, DistrictPad, DistrictSign } from "./shared"

const BELT_START = -4.3
const BELT_END = 4.3
const BOX_COUNT = 4

function Conveyor({ animate }: { animate: boolean }) {
  const boxes = useRef<(THREE.Group | null)[]>([])
  const arms = useRef<(THREE.Group | null)[]>([])
  useFrame(({ clock }) => {
    if (!animate) return
    const t = clock.elapsedTime
    const span = BELT_END - BELT_START
    boxes.current.forEach((box, index) => {
      if (!box) return
      const x = BELT_START + ((t * 0.9 + (index * span) / BOX_COUNT) % span)
      box.position.x = x
    })
    arms.current.forEach((arm, index) => {
      if (arm) arm.rotation.y = Math.sin(t * 0.8 + index * 1.7) * 0.9 + (index === 0 ? Math.PI / 2 : -Math.PI / 2)
    })
  })

  return (
    <group position={[0, 0, -2.2]}>
      {[-3, 0, 3].map((x) => (
        <Model key={x} pack="factory" name="conveyor-long" position={[x, 0, 0]} scale={1.5} />
      ))}
      {Array.from({ length: BOX_COUNT }, (_, index) => (
        <group
          key={index}
          ref={(node) => {
            boxes.current[index] = node
          }}
          position={[BELT_START + index * 2.1, 0.6, 0]}
        >
          <Model pack="factory" name={index % 2 ? "box-small" : "box-wide"} scale={1.1} />
        </group>
      ))}
      {[-5.5, 5.5].map((x, index) => (
        <group
          key={x}
          ref={(node) => {
            arms.current[index] = node
          }}
          position={[x, 0, 0]}
        >
          <Model pack="factory" name={index === 0 ? "robot-arm-a" : "robot-arm-b"} scale={0.85} />
        </group>
      ))}
    </group>
  )
}

function ScanGate({ animate }: { animate: boolean }) {
  const beam = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!beam.current) return
    beam.current.position.y = animate ? 0.25 + ((Math.sin(clock.elapsedTime * 1.8) + 1) / 2) * 1.6 : 1.0
  })
  return (
    <group position={[0, 0, 3.6]}>
      <Model pack="factory" name="scanner-high" scale={1.7} rotation={Math.PI / 2} />
      <mesh position={[0, 1.0, 0]}>
        <planeGeometry args={[2.3, 1.9]} />
        <meshBasicMaterial color={COLORS.green} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={beam} position={[0, 1, 0]}>
        <boxGeometry args={[2.3, 0.035, 0.04]} />
        <meshBasicMaterial color={COLORS.green} toneMapped={false} />
      </mesh>
      {[-2.25, 2.25].map((x) => (
        <Model key={x} pack="factory" name="warning-traffic" position={[x, 0, 0.3]} scale={1.3} />
      ))}
    </group>
  )
}

export function WorkshopDistrict({ animate }: { animate: boolean }) {
  return (
    <DistrictFrame id="workshop">
      <DistrictPad id="workshop" />
      {/* Factory floor inset; its front edge (hazard stripe) is where the scan gate stands */}
      <mesh position={[0, 0.04, -0.6]} receiveShadow>
        <boxGeometry args={[11, 0.03, 8.4]} />
        <meshStandardMaterial color="#3A3F48" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.06, 3.54]}>
        <boxGeometry args={[11, 0.01, 0.12]} />
        <meshBasicMaterial color={COLORS.yellow} toneMapped={false} />
      </mesh>

      <Conveyor animate={animate} />
      <ScanGate animate={animate} />

      <Model pack="factory" name="machine" position={[-4.6, 0, 1.3]} scale={1.4} rotation={Math.PI / 2} />
      <Model pack="factory" name="machine-window" position={[4.6, 0, 1.3]} scale={1.4} rotation={-Math.PI / 2} />
      <Model pack="factory" name="hopper-round" position={[-4.6, 0, -4.4]} scale={1.4} />
      <Model pack="factory" name="cog-a" position={[-4.6, 1.5, -4.4]} scale={1.2} />
      <Model pack="factory" name="box-large" position={[4.6, 0, -4.4]} scale={1.3} />
      <Model pack="factory" name="box-small" position={[4.5, 0.72, -4.3]} scale={1.2} rotation={0.3} />

      {/* Terminal: open the bitcorp. experience */}
      <Model pack="factory" name="screen-panel-wide" position={[0, 0, -0.5]} scale={1.3} />

      {/* Approvals dashboard (illustrative of the TogetherApps workflows) */}
      <group position={[0, 0, -4.7]}>
        {[-2.3, 2.3].map((x) => (
          <mesh key={x} position={[x, 1.4, 0]} castShadow>
            <boxGeometry args={[0.14, 2.8, 0.14]} />
            <meshStandardMaterial color="#2C333E" />
          </mesh>
        ))}
        <mesh position={[0, 2.5, -0.04]} castShadow>
          <boxGeometry args={[4.9, 2.2, 0.1]} />
          <meshStandardMaterial color="#161B22" />
        </mesh>
        <Screen
          width={4.7}
          height={2.0}
          position={[0, 2.5, 0.02]}
          resolution={940}
          drawKey="workshop-dashboard"
          draw={(ctx, w, h) => {
            ctx.fillStyle = "#0D1117"
            ctx.fillRect(0, 0, w, h)
            ctx.fillStyle = COLORS.coral
            ctx.font = `500 30px ${fontFamily("--font-mono")}`
            ctx.fillText("togetherapps / approvals", 36, 58)
            const rows = [
              ["leave", "automated"],
              ["overtime", "automated"],
              ["timesheet", "automated"],
              ["attendance", "face + anti-spoofing + GPS"],
            ]
            rows.forEach(([name, status], index) => {
              const y = 120 + index * 64
              ctx.fillStyle = "#161B22"
              ctx.fillRect(36, y - 38, w - 72, 50)
              ctx.fillStyle = "#E6EDF3"
              ctx.font = `500 28px ${fontFamily("--font-mono")}`
              ctx.fillText(name, 56, y)
              ctx.fillStyle = COLORS.green
              ctx.fillText(`● ${status}`, w / 2 - 40, y)
            })
            ctx.fillStyle = "#8B949E"
            ctx.font = `400 22px ${fontFamily("--font-mono")}`
            ctx.fillText("manual processing: 3 days → 4 hours", 36, h - 26)
          }}
        />
      </group>

      <DistrictSign id="workshop" />
    </DistrictFrame>
  )
}
