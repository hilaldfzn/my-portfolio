// Mutable per-frame state shared by the scene, input handlers, and HUD widgets.
// Kept outside React so 60 fps updates never trigger re-renders.

import type { Vec2 } from "../world-config"

export interface RuntimeState {
  player: {
    x: number
    y: number
    z: number
    vx: number
    vy: number
    vz: number
    yaw: number
    speed: number
    grounded: boolean
  }
  camera: {
    yaw: number
    pitch: number
    distance: number
    /** Set when the camera should jump to its target instead of easing (teleports). */
    snap: boolean
  }
  input: {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
    run: boolean
    jumpQueued: boolean
    joystickX: number
    joystickY: number
  }
  walkTarget: Vec2 | null
  /** Interactable to open once the player reaches it (click-to-walk on an object). */
  pendingInteract: string | null
  teleport: { position: Vec2; yaw: number } | null
}

export const runtime: RuntimeState = createRuntime()

function createRuntime(): RuntimeState {
  return {
    player: { x: 0, y: 0, z: 4.2, vx: 0, vy: 0, vz: 0, yaw: Math.PI, speed: 0, grounded: true },
    camera: { yaw: 0, pitch: 0.84, distance: 14, snap: true },
    input: { up: false, down: false, left: false, right: false, run: false, jumpQueued: false, joystickX: 0, joystickY: 0 },
    walkTarget: null,
    pendingInteract: null,
    teleport: null,
  }
}

export function resetRuntime(spawn: Vec2, yaw: number) {
  Object.assign(runtime, createRuntime())
  runtime.player.x = spawn[0]
  runtime.player.z = spawn[1]
  runtime.player.yaw = yaw
  runtime.camera.yaw = yaw + Math.PI
}

export function clearMovementInput() {
  const input = runtime.input
  input.up = input.down = input.left = input.right = input.run = input.jumpQueued = false
  input.joystickX = input.joystickY = 0
  runtime.walkTarget = null
  runtime.pendingInteract = null
}
