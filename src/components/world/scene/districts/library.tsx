"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import { articles } from "../../../../content/articles"
import {
  ARTICLE_EXHIBITS,
  BOOKCASE,
  COLORS,
  LIBRARY_DESKS,
  LIBRARY_SHELVES,
  exhibitPropPosition,
  faceCenter,
  type ExhibitTopic,
} from "../../world-config"
import { Model } from "../models"
import { Screen, drawCover, fontFamily, wrapText } from "../canvas-art"
import { DistrictFrame, DistrictPad, DistrictSign } from "./shared"
import { SHARED } from "../materials"

const ACCENT = COLORS.lavender

// ---------------------------------------------------------------------------
// Bookcases: procedural frames with every shelf filled. Frames, back panels and books are three
// instanced meshes for the whole wall.
// ---------------------------------------------------------------------------

const BOOK_COLORS = ["#C8553D", "#E08A45", "#D9A93A", "#3E9B57", "#3A8C8C", "#4F8FCB", "#7C6BC8", "#A98BD8", "#8C3B3B", "#E6DCC8", "#2D3446"]
const SHELF_PITCH = (BOOKCASE.height - 0.26) / BOOKCASE.levels

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function bookcaseGeometries() {
  const { width, height, depth, levels } = BOOKCASE
  const box = (w: number, h: number, d: number, x: number, y: number, z: number) => new THREE.BoxGeometry(w, h, d).translate(x, y, z)
  const frame = [
    box(0.1, height, depth, -width / 2 + 0.05, height / 2, 0),
    box(0.1, height, depth, width / 2 - 0.05, height / 2, 0),
    box(width, 0.1, depth, 0, height - 0.05, 0),
    box(width, 0.16, depth, 0, 0.08, 0),
    ...Array.from({ length: levels - 1 }, (_, k) => box(width - 0.2, 0.05, depth - 0.06, 0, 0.16 + (k + 1) * SHELF_PITCH, 0.03)),
  ]
  const back = box(width - 0.2, height - 0.26, 0.04, 0, 0.16 + (height - 0.26) / 2, -depth / 2 + 0.02)
  return { frame: mergeGeometries(frame)!, back }
}

/** Fills every shelf with upright books of varied size, the odd flat stack, gap and leaning book. */
function bookMatrices() {
  const random = seeded(73)
  const { width, depth, levels } = BOOKCASE
  const result: { matrix: THREE.Matrix4; color: string }[] = []
  const shelfMatrix = new THREE.Matrix4()
  const bookMatrix = new THREE.Matrix4()
  const quaternion = new THREE.Quaternion()
  const euler = new THREE.Euler()
  const push = (x: number, y: number, z: number, w: number, h: number, d: number, lean = 0) => {
    quaternion.setFromEuler(euler.set(0, 0, lean))
    bookMatrix.compose(new THREE.Vector3(x, y, z), quaternion, new THREE.Vector3(w, h, d))
    result.push({ matrix: shelfMatrix.clone().multiply(bookMatrix), color: BOOK_COLORS[Math.floor(random() * BOOK_COLORS.length)] })
  }
  for (const shelf of LIBRARY_SHELVES) {
    shelfMatrix.compose(
      new THREE.Vector3(shelf.local[0], 0, shelf.local[1]),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), shelf.rotation),
      new THREE.Vector3(1, 1, 1),
    )
    for (let level = 0; level < levels; level++) {
      const floor = 0.16 + level * SHELF_PITCH + (level > 0 ? 0.025 : 0)
      const room = SHELF_PITCH - 0.08
      let x = -width / 2 + 0.13
      const end = width / 2 - 0.13
      while (x < end - 0.05) {
        const roll = random()
        if (roll < 0.05) {
          x += 0.12 + random() * 0.14
        } else if (roll < 0.11 && end - x > 0.42) {
          // A short stack of books lying flat
          const count = 2 + Math.floor(random() * 2)
          for (let i = 0; i < count; i++) push(x + 0.19, floor + 0.035 + i * 0.07, -depth / 2 + 0.24, 0.36 - i * 0.03, 0.065, 0.3)
          x += 0.42
        } else if (roll < 0.14 && end - x > 0.2) {
          const h = room * (0.75 + random() * 0.15)
          push(x + 0.1, floor + h / 2 - 0.01, -depth / 2 + 0.22, 0.07, h, 0.3, -0.32)
          x += 0.21
        } else {
          const w = 0.055 + random() * 0.055
          const h = room * (0.66 + random() * 0.32)
          const d = 0.3 + random() * 0.1
          push(x + w / 2, floor + h / 2, -depth / 2 + 0.05 + d / 2, w, h, d)
          x += w + 0.004
        }
      }
    }
  }
  return result
}

function Bookcases() {
  const { frame, back } = useMemo(bookcaseGeometries, [])
  const books = useMemo(bookMatrices, [])
  const frames = useRef<THREE.InstancedMesh>(null)
  const backs = useRef<THREE.InstancedMesh>(null)
  const bookMesh = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4()
    const up = new THREE.Vector3(0, 1, 0)
    LIBRARY_SHELVES.forEach((shelf, index) => {
      matrix.compose(new THREE.Vector3(shelf.local[0], 0, shelf.local[1]), new THREE.Quaternion().setFromAxisAngle(up, shelf.rotation), new THREE.Vector3(1, 1, 1))
      frames.current?.setMatrixAt(index, matrix)
      backs.current?.setMatrixAt(index, matrix)
    })
    const color = new THREE.Color()
    books.forEach((book, index) => {
      bookMesh.current?.setMatrixAt(index, book.matrix)
      bookMesh.current?.setColorAt(index, color.set(book.color))
    })
    for (const mesh of [frames.current, backs.current, bookMesh.current]) {
      if (!mesh) continue
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      mesh.computeBoundingSphere()
    }
  }, [books])
  return (
    <group>
      <instancedMesh ref={frames} args={[frame, undefined, LIBRARY_SHELVES.length]} castShadow receiveShadow>
        <meshStandardMaterial color="#6B4A35" roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={backs} args={[back, undefined, LIBRARY_SHELVES.length]} receiveShadow>
        <meshStandardMaterial color="#33251C" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={bookMesh} args={[undefined, undefined, books.length]} receiveShadow>
        <boxGeometry />
        <meshStandardMaterial roughness={0.75} />
      </instancedMesh>
    </group>
  )
}

/** Writing desks (moved here from the plaza): where the articles get written. */
function WritingDesks() {
  return (
    <group>
      {LIBRARY_DESKS.map((at) => (
        <group key={at[0]} position={[at[0], 0, at[1]]} rotation-y={faceCenter(at)}>
          <Model pack="furniture" name="desk" scale={2.2} />
          <Model pack="furniture" name="computerScreen" position={[-0.35, 0.84, -0.12]} scale={2.2} />
          <Model pack="furniture" name="laptop" position={[0.3, 0.84, 0.05]} scale={2.2} />
          <Model pack="furniture" name="chairDesk" position={[0, 0, 0.95]} scale={2.2} rotation={Math.PI} />
        </group>
      ))}
    </group>
  )
}

function Lectern({ index, image }: { index: number; image: HTMLImageElement }) {
  const exhibit = ARTICLE_EXHIBITS[index]
  const title = exhibit.article.title.split(":")[0]
  return (
    <group position={[exhibit.local[0], 0, exhibit.local[1]]} rotation-y={exhibit.rotation}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.0, 0.6]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      <group position={[0, 1.32, 0.05]} rotation-x={-0.5}>
        <mesh position={[0, 0, -0.04]} castShadow>
          <boxGeometry args={[1.32, 0.98, 0.06]} />
          <primitive object={SHARED.ink} attach="material" />
        </mesh>
        <Screen
          width={1.24}
          height={0.9}
          position={[0, 0, 0.002]}
          resolution={480}
          drawKey={`exhibit-${exhibit.slug}`}
          draw={(ctx, w, h) => {
            const bar = 104
            ctx.fillStyle = "#0D1117"
            ctx.fillRect(0, 0, w, h)
            drawCover(ctx, image, 0, 0, w, h - bar)
            ctx.fillStyle = "#0D1117"
            ctx.fillRect(0, h - bar, w, bar)
            ctx.fillStyle = ACCENT
            ctx.fillRect(0, h - bar, w, 4)
            ctx.fillStyle = "#E6EDF3"
            ctx.font = `400 30px ${fontFamily("--font-display")}`
            wrapText(ctx, title, w - 36)
              .slice(0, 2)
              .forEach((line, i) => ctx.fillText(line, 18, h - bar + 38 + i * 30))
            ctx.fillStyle = "#8B949E"
            ctx.font = `400 16px ${fontFamily("--font-mono")}`
            ctx.fillText(`${exhibit.article.readingTime} min read`, 18, h - 10)
          }}
        />
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Topic props: each article gets an object that illustrates what it is about
// ---------------------------------------------------------------------------

function DeployProp() {
  return (
    <group>
      <mesh position-y={0.15} receiveShadow>
        <cylinderGeometry args={[0.75, 0.8, 0.3, 8]} />
        <meshStandardMaterial color="#353B47" roughness={0.85} />
      </mesh>
      <Model pack="tech" name="rocket_baseA" position={[0, 0.3, 0]} scale={0.6} />
      <Model pack="tech" name="rocket_sidesA" position={[0, 1.26, 0]} scale={0.6} />
      <Model pack="tech" name="rocket_topA" position={[0, 1.86, 0]} scale={0.6} />
      {[0, 1].map((i) => (
        <mesh key={i} position={[0.95, 0.22 + i * 0.44, 0.1]} castShadow>
          <boxGeometry args={[0.7, 0.42, 0.42]} />
          <meshStandardMaterial color={i ? "#2496ED" : "#1D63C7"} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function MockProp() {
  return (
    <group>
      <mesh position-y={0.12} receiveShadow>
        <boxGeometry args={[1.6, 0.24, 0.8]} />
        <meshStandardMaterial color="#353B47" roughness={0.85} />
      </mesh>
      {/* The real astronaut and the alien standing in for it, facing the visitor (models face -z) */}
      <Model pack="tech" name="astronautA" position={[-0.38, 0.24, 0]} scale={1.6} rotation={Math.PI} />
      <Model pack="tech" name="alien" position={[0.4, 0.24, 0]} scale={1.6} rotation={Math.PI} />
    </group>
  )
}

function DatabaseProp({ animate }: { animate: boolean }) {
  const sprout = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (sprout.current) sprout.current.rotation.y = animate ? clock.elapsedTime * 0.5 : 0
  })
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <group key={i} position-y={0.28 + i * 0.5}>
          <mesh castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.42, 24]} />
            <meshStandardMaterial color="#2C5FA8" roughness={0.45} />
          </mesh>
          <mesh position-y={0.215} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.5, 0.6, 24]} />
            <meshBasicMaterial color={COLORS.blue} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* Seeding: a sprout growing out of the database */}
      <group ref={sprout} position-y={1.5} userData={{ dynamic: true }}>
        <Model pack="furniture" name="plantSmall1" scale={4} />
      </group>
    </group>
  )
}

function TddProp() {
  return (
    <group>
      <Model pack="factory" name="warning-traffic" scale={1.6} />
      <mesh position-y={0.03} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.55, 0.7, 24]} />
        <meshBasicMaterial color={COLORS.green} toneMapped={false} />
      </mesh>
    </group>
  )
}

function useLetterTexture(letter: string, color: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 128
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#161B22"
    ctx.fillRect(0, 0, 128, 128)
    ctx.strokeStyle = color
    ctx.lineWidth = 6
    ctx.strokeRect(3, 3, 122, 122)
    ctx.fillStyle = color
    ctx.font = `600 84px ${fontFamily("--font-mono")}`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(letter, 64, 70)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [letter, color])
}

function SolidBlock({ letter, color, position }: { letter: string; color: string; position: [number, number, number] }) {
  const texture = useLetterTexture(letter, color)
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.46, 0.46, 0.46]} />
      <meshStandardMaterial map={texture} roughness={0.6} />
    </mesh>
  )
}

function SolidProp() {
  const colors = [COLORS.coral, COLORS.lavender, COLORS.green, COLORS.yellow, COLORS.blue]
  return (
    <group>
      {"SOLID".split("").map((letter, i) => (
        <SolidBlock key={letter + i} letter={letter} color={colors[i]} position={[(i - 2) * 0.5, 0.23 + (i === 2 ? 0.46 : 0), 0]} />
      ))}
    </group>
  )
}

function SecurityProp() {
  const shield = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.95)
    shape.quadraticCurveTo(0.45, 0.95, 0.72, 0.78)
    shape.lineTo(0.72, 0.25)
    shape.quadraticCurveTo(0.6, -0.55, 0, -0.85)
    shape.quadraticCurveTo(-0.6, -0.55, -0.72, 0.25)
    shape.lineTo(-0.72, 0.78)
    shape.quadraticCurveTo(-0.45, 0.95, 0, 0.95)
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 })
    geometry.center()
    return geometry
  }, [])
  return (
    <group position-y={1.15}>
      <mesh geometry={shield} castShadow>
        <meshStandardMaterial color={COLORS.green} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Lock */}
      <mesh position={[0, -0.12, 0.13]}>
        <boxGeometry args={[0.42, 0.34, 0.08]} />
        <meshStandardMaterial color="#E6EDF3" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.12, 0.13]}>
        <torusGeometry args={[0.13, 0.04, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#E6EDF3" roughness={0.4} />
      </mesh>
      <mesh position-y={-1.15 + 0.3}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
        <primitive object={SHARED.steel} attach="material" />
      </mesh>
    </group>
  )
}

function TopicProp({ topic, animate }: { topic: ExhibitTopic; animate: boolean }) {
  switch (topic) {
    case "deploy":
      return <DeployProp />
    case "mock":
      return <MockProp />
    case "database":
      return <DatabaseProp animate={animate} />
    case "tdd":
      return <TddProp />
    case "solid":
      return <SolidProp />
    case "security":
      return <SecurityProp />
  }
}

/** Central reading table with a hologram book and books orbiting in low gravity. */
function ReadingTable({ animate }: { animate: boolean }) {
  const orbit = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (orbit.current) orbit.current.rotation.y = animate ? clock.elapsedTime * 0.35 : 0.3
  })
  const bookColors = [COLORS.coral, COLORS.lavender, COLORS.green, COLORS.yellow, COLORS.blue, COLORS.orange]
  return (
    <group position={[0, 0, -0.4]}>
      <mesh position-y={0.45} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.9, 12]} />
        <primitive object={SHARED.slate} attach="material" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.26, 1.12, 0]} rotation={[-0.35, 0, side * 0.32]}>
          <planeGeometry args={[0.5, 0.66]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.55} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
      <group ref={orbit} position-y={2.0} userData={{ dynamic: true }}>
        {bookColors.map((color, i) => {
          const a = (i / bookColors.length) * Math.PI * 2
          return (
            <mesh key={color} position={[Math.cos(a) * 1.25, Math.sin(i * 1.7) * 0.2, Math.sin(a) * 1.25]} rotation={[0.3, -a, 0.2]}>
              <boxGeometry args={[0.3, 0.42, 0.1]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

/** Article Library: one exhibit per featured article, each with a prop for its topic. */
export function LibraryDistrict({ animate }: { animate: boolean }) {
  const images = useLoader(
    THREE.ImageLoader,
    ARTICLE_EXHIBITS.map((exhibit) => exhibit.article.image),
  ) as HTMLImageElement[]
  return (
    <DistrictFrame id="articles">
      <DistrictPad id="articles" />
      {ARTICLE_EXHIBITS.map((exhibit, index) => {
        const [px, pz] = exhibitPropPosition(exhibit)
        return (
          <group key={exhibit.slug}>
            <Lectern index={index} image={images[index]} />
            <group position={[px, 0, pz]} rotation-y={exhibit.rotation}>
              <TopicProp topic={exhibit.topic} animate={animate} />
            </group>
          </group>
        )
      })}
      <Bookcases />
      <WritingDesks />
      <ReadingTable animate={animate} />
      <DistrictSign id="articles" subtitle={`${articles.length} articles · ${ARTICLE_EXHIBITS.length} on display`} />
    </DistrictFrame>
  )
}
