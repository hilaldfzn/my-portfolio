"use client"

import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { COLORS, DISTRICT_BY_ID } from "../../world-config"
import { Model } from "../models"
import { Screen, fontFamily } from "../canvas-art"
import { DistrictFrame, DistrictPad, DistrictSign } from "./shared"
import { SHARED } from "../materials"

const SHIELD_RADIUS = DISTRICT_BY_ID["gdp-labs"].padRadius - 0.2

function useShieldMaterial() {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(COLORS.lavender) } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float fade = pow(1.0 - vUv.y, 1.6);
            float lines = smoothstep(0.82, 1.0, sin((vUv.y * 18.0 - uTime * 1.4) * 3.14159) * 0.5 + 0.5);
            float seams = smoothstep(0.97, 1.0, abs(sin(vUv.x * 3.14159 * 64.0)));
            float alpha = fade * (0.16 + lines * 0.22 + seams * 0.12);
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
      }),
    [],
  )
}

/** GDP Labs: a research dome inside a guardrail shield, with the classifier console out front. */
export function GdpLabsDistrict({ animate }: { animate: boolean }) {
  const shield = useShieldMaterial()
  useFrame((_, delta) => {
    if (animate) shield.uniforms.uTime.value += delta
  })

  return (
    <DistrictFrame id="gdp-labs">
      <DistrictPad id="gdp-labs" />

      {/* Guardrail shield: the visitor passes a "safety check" when crossing it */}
      <mesh position-y={1.0} material={shield}>
        <cylinderGeometry args={[SHIELD_RADIUS, SHIELD_RADIUS, 2.0, 128, 1, true]} />
      </mesh>

      <Model pack="tech" name="hangar_roundGlass" position={[0, 0, -3.6]} scale={3.6} rotation={Math.PI} />
      {/* Mirrored pairs on both sides of the dome */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Model pack="tech" name="satelliteDish_large" position={[side * 7.2, 0, 1.2]} scale={3.4} rotation={-side * 0.6} />
          <Model pack="tech" name="machine_generatorLarge" position={[side * 6.2, 0, -6.0]} scale={2.2} rotation={-side * 0.8} />
          <Model pack="tech" name="rock_crystalsLargeA" position={[side * 8.6, 0, -2.0]} scale={2.4} rotation={-side * 1.2} />
          <Model pack="tech" name="rock_crystals" position={[side * 4.6, 0, 6.6]} scale={1.9} rotation={-side * 0.4} />
        </group>
      ))}
      <Model pack="tech" name="astronautB" position={[-2.6, 0, 3.4]} scale={2.2} rotation={0.6} />

      {/* Classifier console in front of the lab door */}
      <group position={[3.0, 0, 3.0]} rotation-y={-0.35}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.3, 1.0, 0.65]} />
          <primitive object={SHARED.slate} attach="material" />
        </mesh>
        <Screen
          width={1.3}
          height={0.78}
          position={[0, 1.42, 0.05]}
          rotation={[-0.25, 0, 0]}
          drawKey="lab-console"
          draw={(ctx, w, h) => {
            ctx.fillStyle = "#0D1117"
            ctx.fillRect(0, 0, w, h)
            ctx.font = `500 26px ${fontFamily("--font-mono")}`
            ctx.fillStyle = COLORS.lavender
            ctx.fillText("guardrail.check(input)", 28, 60)
            ctx.fillStyle = "#8B949E"
            ctx.fillText("rule-based phrases", 28, 120)
            ctx.fillStyle = "#E6EDF3"
            ctx.fillText("→ LLM classifier", 28, 165)
            ctx.fillStyle = COLORS.green
            ctx.fillText('{ "verdict": "safe" }', 28, 230)
            ctx.fillStyle = "#8B949E"
            ctx.font = `400 20px ${fontFamily("--font-mono")}`
            ctx.fillText("16 content-safety categories", 28, h - 30)
          }}
        />
      </group>

      <DistrictSign id="gdp-labs" />
    </DistrictFrame>
  )
}
