"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { COLORS } from "../../world-config"
import { Model } from "../models"
import { Screen, fontFamily } from "../canvas-art"
import { DistrictFrame, DistrictPad, DistrictSign } from "./shared"
import { SHARED } from "../materials"

const BELT_START = -5.4
const BELT_END = 5.4
const BOX_COUNT = 5

function Conveyor({ animate }: { animate: boolean }) {
  const boxes = useRef<(THREE.Group | null)[]>([])
  const arms = useRef<(THREE.Group | null)[]>([])
  useFrame(({ clock }) => {
    if (!animate) return
    const t = clock.elapsedTime
    const span = BELT_END - BELT_START
    boxes.current.forEach((box, index) => {
      if (box) box.position.x = BELT_START + ((t * 0.9 + (index * span) / BOX_COUNT) % span)
    })
    arms.current.forEach((arm, index) => {
      if (arm) arm.rotation.y = Math.sin(t * 0.8 + index * 1.7) * 0.9 + (index === 0 ? Math.PI / 2 : -Math.PI / 2)
    })
  })

  return (
    <group position={[0, 0, -2.6]}>
      {[-4.5, -1.5, 1.5, 4.5].map((x) => (
        <Model key={x} pack="factory" name="conveyor-long" position={[x, 0, 0]} scale={1.5} />
      ))}
      {Array.from({ length: BOX_COUNT }, (_, index) => (
        <group
          key={index}
          ref={(node) => {
            boxes.current[index] = node
          }}
          position={[BELT_START + index * 2.2, 0.6, 0]}
          userData={{ dynamic: true }}
        >
          <Model pack="factory" name={index % 2 ? "box-small" : "box-wide"} scale={1.1} />
        </group>
      ))}
      {[-6.8, 6.8].map((x, index) => (
        <group
          key={x}
          ref={(node) => {
            arms.current[index] = node
          }}
          position={[x, 0, 0]}
          userData={{ dynamic: true }}
        >
          <Model pack="factory" name={index === 0 ? "robot-arm-a" : "robot-arm-b"} scale={0.9} />
        </group>
      ))}
    </group>
  )
}

/** Crew check-in: the face-scan gate every visitor walks through. */
function ScanGate({ animate }: { animate: boolean }) {
  const beam = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (beam.current) beam.current.position.y = animate ? 0.25 + ((Math.sin(clock.elapsedTime * 1.8) + 1) / 2) * 1.6 : 1.0
  })
  return (
    <group position={[0, 0, 4.3]}>
      <Model pack="factory" name="scanner-high" scale={1.7} rotation={Math.PI / 2} />
      <mesh position={[0, 1.0, 0]}>
        <planeGeometry args={[2.3, 1.9]} />
        <meshBasicMaterial color={COLORS.green} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={beam} position={[0, 1, 0]} userData={{ dynamic: true }}>
        <boxGeometry args={[2.3, 0.035, 0.04]} />
        <meshBasicMaterial color={COLORS.green} toneMapped={false} />
      </mesh>
      {[-2.3, 2.3].map((x) => (
        <Model key={x} pack="factory" name="warning-traffic" position={[x, 0, 0.3]} scale={1.3} />
      ))}
    </group>
  )
}

/** PT Bringin Inti Teknologi (bitcorp.): a crew check-in and assembly bay for TogetherApps. */
export function BitcorpDistrict({ animate }: { animate: boolean }) {
  return (
    <DistrictFrame id="bitcorp">
      <DistrictPad id="bitcorp" />
      {/* Assembly floor inset; its front edge (hazard stripe) is where the scan gate stands */}
      <mesh position={[0, 0.04, -1.0]} receiveShadow>
        <boxGeometry args={[14.4, 0.03, 9.6]} />
        <meshStandardMaterial color="#3A3F48" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.06, 3.84]}>
        <boxGeometry args={[14.4, 0.01, 0.12]} />
        <meshBasicMaterial color={COLORS.yellow} toneMapped={false} />
      </mesh>

      <Conveyor animate={animate} />
      <ScanGate animate={animate} />

      {[-1, 1].map((side) => (
        <group key={side}>
          <Model pack="factory" name={side < 0 ? "machine" : "machine-window"} position={[side * 5.6, 0, 1.6]} scale={1.4} rotation={-side * (Math.PI / 2)} />
        </group>
      ))}
      <Model pack="factory" name="hopper-round" position={[-5.6, 0, -5.6]} scale={1.4} />
      <Model pack="factory" name="cog-a" position={[-5.6, 1.5, -5.6]} scale={1.2} />
      <Model pack="factory" name="box-large" position={[5.6, 0, -5.6]} scale={1.3} />
      <Model pack="factory" name="box-small" position={[5.5, 0.72, -5.5]} scale={1.2} rotation={0.3} />
      <Model pack="tech" name="astronautA" position={[-2.8, 0, 1.2]} scale={2.2} rotation={0.5} />

      {/* Terminal: open the bitcorp. experience */}
      <Model pack="factory" name="screen-panel-wide" position={[0, 0, -0.6]} scale={1.3} />

      {/* Approvals dashboard (illustrative of the TogetherApps workflows) */}
      <group position={[0, 0, -6.4]}>
        {[-2.6, 2.6].map((x) => (
          <mesh key={x} position={[x, 1.5, 0]} castShadow>
            <boxGeometry args={[0.14, 3.0, 0.14]} />
            <primitive object={SHARED.slate} attach="material" />
          </mesh>
        ))}
        <mesh position={[0, 2.6, -0.04]} castShadow>
          <boxGeometry args={[5.4, 2.3, 0.1]} />
          <primitive object={SHARED.ink} attach="material" />
        </mesh>
        <Screen
          width={5.2}
          height={2.1}
          position={[0, 2.6, 0.02]}
          resolution={940}
          drawKey="bitcorp-dashboard"
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
              const y = 120 + index * 62
              ctx.fillStyle = "#161B22"
              ctx.fillRect(36, y - 38, w - 72, 48)
              ctx.fillStyle = "#E6EDF3"
              ctx.font = `500 28px ${fontFamily("--font-mono")}`
              ctx.fillText(name, 56, y)
              ctx.fillStyle = COLORS.green
              ctx.fillText(`● ${status}`, w / 2 - 60, y)
            })
            ctx.fillStyle = "#8B949E"
            ctx.font = `400 22px ${fontFamily("--font-mono")}`
            ctx.fillText("manual processing: 3 days → 4 hours", 36, h - 24)
          }}
        />
      </group>

      <DistrictSign id="bitcorp" />
    </DistrictFrame>
  )
}
