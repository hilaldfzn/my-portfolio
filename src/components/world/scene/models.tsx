"use client"

import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

// Optimized packs produced by scripts/build-world-assets.mjs (see public/3d/models/manifest.json).
export const PACK_URLS = {
  nature: "/3d/models/nature.glb",
  tech: "/3d/models/tech.glb",
  factory: "/3d/models/factory.glb",
  furniture: "/3d/models/furniture.glb",
  food: "/3d/models/food.glb",
  robot: "/3d/models/robot.glb",
} as const

export type PackName = Exclude<keyof typeof PACK_URLS, "robot">

const prepared = new WeakSet<THREE.Object3D>()

// Recolors that turn Kenney's earthly nature kit into alien flora and lunar rock.
const RECOLOR: Record<string, { color: string; emissive?: number }> = {
  leafsGreen: { color: "#57C4B8", emissive: 0.1 },
  leafsDark: { color: "#7F6FD6", emissive: 0.12 },
  leafsFall: { color: "#E98AA6", emissive: 0.1 },
  grass: { color: "#7FD6C6", emissive: 0.08 },
  woodBark: { color: "#6B5A8E" },
  woodBarkDark: { color: "#56487A" },
  stone: { color: "#9B98C4" },
  stoneDark: { color: "#7E7AA8" },
  rock: { color: "#9B98C4" },
  rockTrack: { color: "#7F7BAA" },
  rockDark: { color: "#6E6A99" },
}

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
      const recolor = RECOLOR[standard.name]
      if (recolor) {
        standard.color.set(recolor.color)
        if (recolor.emissive) {
          standard.emissive.set(recolor.color)
          standard.emissiveIntensity = recolor.emissive
        }
      }
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

// ---------------------------------------------------------------------------
// Static batching
// ---------------------------------------------------------------------------

const BATCH_ATTRIBUTES = ["position", "normal", "uv"] as const

/**
 * Copies the attributes batching needs into plain float arrays (meshopt data is quantized).
 * Position and normal are required; uv is kept when present.
 */
function toFloatGeometry(source: THREE.BufferGeometry) {
  const geometry = new THREE.BufferGeometry()
  for (const name of BATCH_ATTRIBUTES) {
    const attribute = source.getAttribute(name) as THREE.BufferAttribute | THREE.InterleavedBufferAttribute | undefined
    if (!attribute) {
      if (name === "uv") continue
      return null
    }
    const array = new Float32Array(attribute.count * attribute.itemSize)
    for (let i = 0; i < attribute.count; i++) {
      for (let c = 0; c < attribute.itemSize; c++) array[i * attribute.itemSize + c] = attribute.getComponent(i, c)
    }
    geometry.setAttribute(name, new THREE.BufferAttribute(array, attribute.itemSize))
  }
  if (source.index) geometry.setIndex(Array.from(source.index.array as ArrayLike<number>))
  else return null
  return geometry
}

/**
 * Merges static meshes that share a material into one mesh per material, cutting draw calls.
 * Anything under an object with `userData.dynamic` (animated parts) is left untouched, as are
 * instanced meshes, multi-material meshes and transparent materials.
 */
export function StaticBatch({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null)
  useLayoutEffect(() => {
    const group = root.current
    if (!group) return
    group.updateWorldMatrix(true, true)
    const inverse = new THREE.Matrix4().copy(group.matrixWorld).invert()
    // Meshes merge only with others that share both the material and the attribute layout.
    const buckets = new Map<string, { material: THREE.Material; meshes: THREE.Mesh[]; geometries: THREE.BufferGeometry[] }>()
    const visit = (object: THREE.Object3D) => {
      if (object.userData.dynamic) return
      const mesh = object as THREE.Mesh
      if (mesh.isMesh && !(mesh as THREE.InstancedMesh).isInstancedMesh && mesh.visible && !Array.isArray(mesh.material)) {
        const material = mesh.material as THREE.Material
        if (!material.transparent && !(material as THREE.ShaderMaterial).isShaderMaterial) {
          const geometry = toFloatGeometry(mesh.geometry)
          if (geometry) {
            geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld))
            const key = `${material.uuid}:${geometry.getAttribute("uv") ? "uv" : "plain"}`
            if (!buckets.has(key)) buckets.set(key, { material, meshes: [], geometries: [] })
            buckets.get(key)!.meshes.push(mesh)
            buckets.get(key)!.geometries.push(geometry)
          }
        }
      }
      for (const child of object.children) visit(child)
    }
    for (const child of group.children) visit(child)

    const merged: THREE.Mesh[] = []
    const hidden: THREE.Mesh[] = []
    buckets.forEach(({ material, meshes, geometries }) => {
      if (meshes.length < 2) return
      const geometry = mergeGeometries(geometries)
      if (!geometry) return
      const batch = new THREE.Mesh(geometry, material)
      batch.castShadow = meshes.some((m) => m.castShadow)
      batch.receiveShadow = true
      batch.userData.dynamic = true
      group.add(batch)
      merged.push(batch)
      for (const mesh of meshes) {
        mesh.visible = false
        hidden.push(mesh)
      }
    })
    return () => {
      for (const batch of merged) {
        group.remove(batch)
        batch.geometry.dispose()
      }
      for (const mesh of hidden) mesh.visible = true
    }
  }, [])
  return <group ref={root}>{children}</group>
}
