import * as THREE from "three"

// Shared materials for repeated procedural parts (cabinets, posts, frames). Sharing lets
// StaticBatch merge them into a few draw calls per land.
export const SHARED = {
  slate: new THREE.MeshStandardMaterial({ color: "#2C333E", roughness: 0.72 }),
  ink: new THREE.MeshStandardMaterial({ color: "#161B22", roughness: 0.55 }),
  steel: new THREE.MeshStandardMaterial({ color: "#3A4250", roughness: 0.65 }),
  pale: new THREE.MeshStandardMaterial({ color: "#B7BBD0", roughness: 0.55 }),
}
