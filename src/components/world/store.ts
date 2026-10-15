// UI-level state for the playable portfolio (panels, overlays, progress, toasts).
// Per-frame data (player position, input) lives in systems/runtime.ts instead.

import { create } from "zustand"
import { DISTRICTS, DISTRICT_BY_ID, TOKENS, arrivalPoint, type DistrictId, type PanelRef } from "./world-config"
import { runtime } from "./systems/runtime"

export type EngineState = "checking" | "idle" | "loading" | "ready" | "unsupported" | "error" | "context-lost"
export type Overlay = "map" | "pause" | null

export interface Toast {
  id: number
  tone: "token" | "district" | "info"
  title: string
  detail?: string
}

interface Progress {
  discovered: DistrictId[]
  tokens: string[]
  onboarded: boolean
}

const STORAGE_KEY = "inference-island:v1"

function loadProgress(): Progress {
  const empty: Progress = { discovered: [], tokens: [], onboarded: false }
  if (typeof window === "undefined") return empty
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<Progress>
    const validDistricts = new Set(DISTRICTS.map((d) => d.id))
    const validTokens = new Set(TOKENS.map((t) => t.skill))
    return {
      discovered: (parsed.discovered ?? []).filter((id) => validDistricts.has(id)),
      tokens: (parsed.tokens ?? []).filter((skill) => validTokens.has(skill)),
      onboarded: Boolean(parsed.onboarded),
    }
  } catch {
    return empty
  }
}

function saveProgress(progress: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage can be unavailable (private mode, blocked site data); progress just won't persist.
  }
}

export interface WorldStore {
  engine: EngineState
  loadProgress: number
  phase: "entry" | "playing"
  /** Content-only mode: browse every panel without starting (or while unable to start) the 3D world. */
  browsing: boolean
  overlay: Overlay
  panel: PanelRef | null
  onboardingStep: number | null
  nearby: string | null
  currentDistrict: DistrictId | null
  discovered: DistrictId[]
  tokens: string[]
  onboarded: boolean
  toasts: Toast[]
  reducedMotion: boolean
  touch: boolean
  fading: boolean

  setEngine: (engine: EngineState) => void
  setLoadProgress: (value: number) => void
  setEnvironment: (env: { reducedMotion: boolean; touch: boolean }) => void
  hydrate: () => void
  enterWorld: () => void
  startBrowsing: () => void
  stopBrowsing: () => void
  openPanel: (panel: PanelRef) => void
  closePanel: () => void
  setOverlay: (overlay: Overlay) => void
  toggleMap: () => void
  setNearby: (id: string | null) => void
  enterDistrict: (id: DistrictId | null) => void
  collectToken: (skill: string) => void
  pushToast: (toast: Omit<Toast, "id">) => void
  dismissToast: (id: number) => void
  advanceOnboarding: () => void
  finishOnboarding: () => void
  travelTo: (id: DistrictId, open?: boolean) => void
  resetProgress: () => void
}

let toastId = 0

export const useWorldStore = create<WorldStore>((set, get) => ({
  engine: "checking",
  loadProgress: 0,
  phase: "entry",
  browsing: false,
  overlay: null,
  panel: null,
  onboardingStep: null,
  nearby: null,
  currentDistrict: null,
  discovered: [],
  tokens: [],
  onboarded: false,
  toasts: [],
  reducedMotion: false,
  touch: false,
  fading: false,

  setEngine: (engine) => set({ engine }),
  setLoadProgress: (value) => set({ loadProgress: Math.max(get().loadProgress, value) }),
  setEnvironment: (env) => set(env),
  hydrate: () => set(loadProgress()),

  enterWorld: () => {
    if (get().engine !== "ready") return
    set({ phase: "playing", browsing: false, overlay: null, panel: null, onboardingStep: get().onboarded ? null : 0 })
  },
  startBrowsing: () => set({ browsing: true, overlay: "map", panel: null }),
  stopBrowsing: () => set({ browsing: false, overlay: null, panel: null }),

  openPanel: (panel) => set({ panel, overlay: null }),
  // In browse mode, closing a section returns to the directory.
  closePanel: () => set({ panel: null, overlay: get().browsing ? "map" : null }),
  setOverlay: (overlay) => set({ overlay }),
  toggleMap: () => set((state) => ({ overlay: state.overlay === "map" ? null : "map", panel: null })),

  setNearby: (id) => {
    if (get().nearby !== id) set({ nearby: id })
  },

  enterDistrict: (id) => {
    if (get().currentDistrict === id) return
    set({ currentDistrict: id })
    if (!id || get().discovered.includes(id)) return
    const discovered = [...get().discovered, id]
    set({ discovered })
    persist(get)
    // Home is where every visit starts, so it is marked silently.
    if (id === "home") return
    const district = DISTRICT_BY_ID[id]
    get().pushToast({ tone: "district", title: `Discovered ${district.path}`, detail: district.title })
  },

  collectToken: (skill) => {
    if (get().tokens.includes(skill)) return
    const tokens = [...get().tokens, skill]
    set({ tokens })
    persist(get)
    const token = TOKENS.find((t) => t.skill === skill)
    const done = tokens.length === TOKENS.length
    get().pushToast({
      tone: "token",
      title: done ? "Context window full" : `+1 token · ${skill}`,
      detail: done ? `All ${TOKENS.length} skill tokens collected` : `${token?.category} · ${tokens.length}/${TOKENS.length}`,
    })
  },

  pushToast: (toast) => {
    const id = ++toastId
    set((state) => ({ toasts: [...state.toasts.slice(-2), { ...toast, id }] }))
    window.setTimeout(() => get().dismissToast(id), 3400)
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  advanceOnboarding: () => {
    const step = get().onboardingStep
    if (step === null) return
    if (step >= 2) get().finishOnboarding()
    else set({ onboardingStep: step + 1 })
  },
  finishOnboarding: () => {
    set({ onboardingStep: null, onboarded: true })
    persist(get)
  },

  travelTo: (id, open = false) => {
    const district = DISTRICT_BY_ID[id]
    const { position, yaw } = arrivalPoint(district)
    const apply = () => {
      runtime.teleport = { position, yaw }
      set({ overlay: null, panel: open ? district.panel : null })
    }
    if (get().reducedMotion || get().phase !== "playing") {
      apply()
      return
    }
    set({ fading: true })
    window.setTimeout(() => {
      apply()
      window.setTimeout(() => set({ fading: false }), 120)
    }, 180)
  },

  resetProgress: () => {
    set({ discovered: [], tokens: [], currentDistrict: null })
    persist(get)
    get().pushToast({ tone: "info", title: "Progress reset", detail: "Districts and tokens are back to zero" })
  },
}))

function persist(get: () => WorldStore) {
  const { discovered, tokens, onboarded } = get()
  saveProgress({ discovered, tokens, onboarded })
}
