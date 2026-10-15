"use client"

import { useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { profile } from "../../../../content/profile"
import { COLORS, HOME_LAYOUT, faceCenter } from "../../world-config"
import { Model } from "../models"
import { Screen, fontFamily, wrapText } from "../canvas-art"
import { DistrictFrame } from "./shared"

const PORTRAIT_URL = "/3d/textures/portrait.jpg"

export function HomeDistrict() {
  const portrait = useLoader(THREE.ImageLoader, PORTRAIT_URL)
  const { desk, bookcase, benches, lamps, plants } = HOME_LAYOUT

  return (
    <DistrictFrame id="home">
      {/* Monolith with the real portrait: the island's "README" */}
      <mesh position={[0, 1.75, -3.1]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.5, 0.5]} />
        <meshStandardMaterial color="#161B22" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.06, -3.1]} receiveShadow>
        <boxGeometry args={[3.1, 0.12, 1.0]} />
        <meshStandardMaterial color="#3A4250" roughness={0.8} />
      </mesh>
      <Screen
        width={2.2}
        height={3.2}
        position={[0, 1.78, -2.84]}
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
          ctx.fillText("// ~/home", 44, 70)
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
      {plants.map(([x, z]) => (
        <Model key={x} pack="furniture" name="pottedPlant" position={[x, 0, z]} scale={2.4} />
      ))}

      {/* Plaza furniture sits between the path mouths and faces the center. */}
      {lamps.map(([x, z]) => (
        <Model key={x} pack="furniture" name="lampRoundFloor" position={[x, 0, z]} scale={3.3} />
      ))}
      <group position={[desk[0], 0, desk[1]]} rotation-y={faceCenter(desk)}>
        <Model pack="furniture" name="desk" scale={2.2} />
        <Model pack="furniture" name="computerScreen" position={[-0.35, 0.84, -0.12]} scale={2.2} />
        <Model pack="furniture" name="laptop" position={[0.3, 0.84, 0.05]} scale={2.2} />
        <Model pack="furniture" name="chairDesk" position={[0, 0, 0.95]} scale={2.2} rotation={Math.PI} />
      </group>
      <group position={[bookcase[0], 0, bookcase[1]]} rotation-y={faceCenter(bookcase)}>
        <Model pack="furniture" name="bookcaseClosedWide" scale={2.3} />
        <Model pack="furniture" name="books" position={[-0.4, 1.83, 0]} scale={2.3} />
        <Model pack="furniture" name="plantSmall2" position={[0.55, 1.83, 0]} scale={2.6} />
      </group>
      {/* Kenney's bench model faces -z, so it is turned around to face the plaza. */}
      {benches.map((at) => (
        <Model key={at[0]} pack="furniture" name="bench" position={[at[0], 0, at[1]]} rotation={faceCenter(at) + Math.PI} scale={2.6} />
      ))}
    </DistrictFrame>
  )
}
