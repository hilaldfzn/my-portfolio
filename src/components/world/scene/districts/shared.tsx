"use client"

import type { ReactNode } from "react"
import {
  DISTRICT_BY_ID,
  SIGN_WIDTH,
  districtCenter,
  districtRotation,
  signPlacement,
  type DistrictId,
} from "../../world-config"
import { SignBoard } from "../canvas-art"

/** Places children in a district's local frame (+z faces the island center). */
export function DistrictFrame({ id, children }: { id: DistrictId; children: ReactNode }) {
  const district = DISTRICT_BY_ID[id]
  const [x, z] = districtCenter(district)
  return (
    <group position={[x, 0, z]} rotation-y={districtRotation(district)}>
      {children}
    </group>
  )
}

/** Slate ground pad with a glowing accent ring, the visual "footprint" of a district. */
export function DistrictPad({ id, segments = 64 }: { id: DistrictId; segments?: number }) {
  const { padRadius, color } = DISTRICT_BY_ID[id]
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={0.025} receiveShadow>
        <circleGeometry args={[padRadius, segments]} />
        <meshStandardMaterial color="#2C333E" roughness={0.9} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.035}>
        <ringGeometry args={[padRadius - 0.16, padRadius, segments]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** The district's entrance sign, always in the same spot left of the path. */
export function DistrictSign({ id, subtitle }: { id: DistrictId; subtitle?: string }) {
  const district = DISTRICT_BY_ID[id]
  const { local, rotation } = signPlacement(district)
  return (
    <SignBoard
      label={district.path}
      title={district.title}
      subtitle={subtitle ?? district.subtitle}
      color={district.color}
      position={[local[0], 0, local[1]]}
      rotation={rotation}
      width={SIGN_WIDTH}
    />
  )
}
