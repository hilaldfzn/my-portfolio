"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

// Optimized packs produced by scripts/build-world-assets.mjs (see public/3d/models/manifest.json).
export const PACK_URLS = {
  nature: "/3d/models/nature.glb",
  tech: "/3d/models/tech.glb",
  factory: "/3d/models/factory.glb",
  furniture: "/3d/models/furniture.glb",
  robot: "/3d/models/robot.glb",
} as const

export type PackName = Exclude<keyof typeof PACK_URLS, "robot">

const prepared = new WeakSet<THREE.Object3D>()

/** One-time material and shadow setup per loaded pack. */
function preparePack(scene: THREE.Object3D) {
  if (prepared.has(scene)) return
  prepared.add(scene)
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = true
    mesh.receiveShadow = true
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const material of materials) {
      const standard = material as THREE.MeshStandardMaterial
      if (!standard.isMeshStandardMaterial) continue
      if (standard.name === "crystal") {
        standard.color.set("#C9A2FF")
        standard.emissive.set("#8E5BE8")
        standard.emissiveIntensity = 0.55
        standard.roughness = 0.35
      } else if (standard.name === "lamp") {
        standard.emissive.set("#FFE7B0")
        standard.emissiveIntensity = 0.9
      } else if (standard.name === "material-glass") {
        standard.opacity = 0.35
        standard.roughness = 0.1
        mesh.castShadow = false
      }
      standard.flatShading = true
      standard.needsUpdate = true
    }
  })
}

export function usePack(pack: PackName) {
  const gltf = useGLTF(PACK_URLS[pack], false, true)
  preparePack(gltf.scene)
  return gltf.scene
}

function getTemplate(scene: THREE.Object3D, name: string) {
  const template = scene.getObjectByName(`${name}_root`)
  if (!template) throw new Error(`Model "${name}" not found in pack`)
  return template
}

export type Vec3 = [number, number, number]

interface ModelProps {
  pack: PackName
  name: string
  position?: Vec3
  rotation?: number
  scale?: number | Vec3
  shadows?: boolean
}

/** A single cloned model (geometry and materials are shared with the pack). */
export function Model({ pack, name, position = [0, 0, 0], rotation = 0, scale = 1, shadows = true }: ModelProps) {
  const scene = usePack(pack)
  const object = useMemo(() => {
    const clone = getTemplate(scene, name).clone(true)
    if (!shadows) clone.traverse((child) => ((child as THREE.Mesh).castShadow = false))
    return clone
  }, [scene, name, shadows])
  return <primitive object={object} position={position} rotation-y={rotation} scale={scale} />
}

export interface InstanceTransform {
  position: Vec3
  rotation?: number
  scale?: number
}

interface InstancedModelProps {
  pack: PackName
  name: string
  transforms: InstanceTransform[]
  castShadow?: boolean
}

/** Renders many copies of a model with one InstancedMesh per sub-mesh. */
export function InstancedModel({ pack, name, transforms, castShadow = true }: InstancedModelProps) {
  const scene = usePack(pack)
  const parts = useMemo(() => {
    const template = getTemplate(scene, name)
    template.updateWorldMatrix(true, true)
    const inverseRoot = new THREE.Matrix4().copy(template.matrixWorld).invert()
    const result: { geometry: THREE.BufferGeometry; material: THREE.Material; matrix: THREE.Matrix4 }[] = []
    template.traverse((object) => {
      const mesh = object as THREE.Mesh
      if (!mesh.isMesh) return
      result.push({
        geometry: mesh.geometry,
        material: mesh.material as THREE.Material,
        matrix: new THREE.Matrix4().multiplyMatrices(inverseRoot, mesh.matrixWorld),
      })
    })
    return result
  }, [scene, name])

  return (
    <group>
      {parts.map((part, index) => (
        <InstancedPart key={index} {...part} transforms={transforms} castShadow={castShadow} />
      ))}
    </group>
  )
}

function InstancedPart({
  geometry,
  material,
  matrix,
  transforms,
  castShadow,
}: {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  matrix: THREE.Matrix4
  transforms: InstanceTransform[]
  castShadow: boolean
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const instance = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    transforms.forEach((transform, index) => {
      position.set(...transform.position)
      quaternion.setFromAxisAngle(up, transform.rotation ?? 0)
      scale.setScalar(transform.scale ?? 1)
      instance.compose(position, quaternion, scale).multiply(matrix)
      mesh.setMatrixAt(index, instance)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [transforms, matrix])

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, transforms.length]}
      castShadow={castShadow}
      receiveShadow
      frustumCulled={false}
    />
  )
}

export function preloadPacks() {
  for (const url of Object.values(PACK_URLS)) useGLTF.preload(url, false, true)
}
