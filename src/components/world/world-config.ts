// Layout of Inference Island: a hub-and-spoke island where the center plaza is "home"
// and each lobe is a district. Everything spatial (positions, colliders, tokens) lives here.
//
// Conventions: y is up, north is -z. A district's local frame has +z pointing back toward
// the island center (the side the player arrives from).

import { projects } from "../../content/projects"
import { skillCategories } from "../../content/skills"

export type DistrictId = "home" | "lab" | "workshop" | "projects" | "skills" | "awards" | "contact"

export type PanelRef =
  | { type: "about" }
  | { type: "experience"; id: "gdp-labs" | "bitcorp" }
  | { type: "project"; slug: string }
  | { type: "projects" }
  | { type: "skills" }
  | { type: "awards" }
  | { type: "contact" }
  | { type: "writing" }
  | { type: "exit" }

export interface District {
  id: DistrictId
  path: string
  title: string
  subtitle: string
  summary: string
  angle: number
  radius: number
  /** Radius of the district's ground pad; zones, clearances and signs derive from it. */
  padRadius: number
  color: string
  panel: PanelRef
}

export type Vec2 = [number, number]

export interface Interactable {
  id: string
  district: DistrictId
  label: string
  position: Vec2
  radius: number
  panel: PanelRef
}

export type Collider =
  | { kind: "circle"; x: number; z: number; r: number }
  | { kind: "box"; x: number; z: number; hw: number; hd: number; rot: number }

export const COLORS = {
  ink: "#0D1117",
  coral: "#F78166",
  lavender: "#D2A8FF",
  green: "#3FB950",
  yellow: "#E3B341",
  blue: "#79C0FF",
  orange: "#FFA657",
  slate: "#3A4250",
  grass: "#4DBF9A",
  cliff: "#D27A55",
}

const deg = (value: number) => (value * Math.PI) / 180

export const DISTRICTS: District[] = [
  {
    id: "home",
    path: "~/home",
    title: "Home Base",
    subtitle: "About me",
    summary: "Who I am, what I study, and where I'm heading.",
    angle: 0,
    radius: 0,
    padRadius: 7.2,
    color: COLORS.coral,
    panel: { type: "about" },
  },
  {
    id: "awards",
    path: "awards/",
    title: "Hall of Achievements",
    subtitle: "Honors & awards",
    summary: "Scholarship and competition awards.",
    angle: deg(0),
    radius: 22,
    padRadius: 7.0,
    color: COLORS.yellow,
    panel: { type: "awards" },
  },
  {
    id: "workshop",
    path: "workshop/",
    title: "Engineering Workshop",
    subtitle: "bitcorp. · Software Engineer Intern",
    summary: "Backend systems, facial recognition attendance, and approval workflows.",
    angle: deg(60),
    radius: 22,
    padRadius: 8.6,
    color: COLORS.coral,
    panel: { type: "experience", id: "bitcorp" },
  },
  {
    id: "projects",
    path: "projects/",
    title: "Project Gallery",
    subtitle: "Selected technical projects",
    summary: "AI/ML, backend, and full-stack projects with source and demos.",
    angle: deg(120),
    radius: 22,
    padRadius: 8.2,
    color: COLORS.green,
    panel: { type: "projects" },
  },
  {
    id: "contact",
    path: "contact/",
    title: "Signal Tower",
    subtitle: "Contact & resume",
    summary: "Resume, email, GitHub, and LinkedIn.",
    angle: deg(180),
    radius: 22,
    padRadius: 7.2,
    color: COLORS.coral,
    panel: { type: "contact" },
  },
  {
    id: "skills",
    path: "skills/",
    title: "Token Well",
    subtitle: "Skills & technologies",
    summary: "Languages, AI/ML, backend, frontend, databases, and cloud tools.",
    angle: deg(240),
    radius: 22,
    padRadius: 7.2,
    color: COLORS.lavender,
    panel: { type: "skills" },
  },
  {
    id: "lab",
    path: "lab/",
    title: "AI Research Lab",
    subtitle: "GDP Labs · AI Engineer Intern",
    summary: "LLM guardrails, chat pipeline services, and guardrail research.",
    angle: deg(300),
    radius: 22,
    padRadius: 8.6,
    color: COLORS.lavender,
    panel: { type: "experience", id: "gdp-labs" },
  },
]

export const DISTRICT_BY_ID = Object.fromEntries(DISTRICTS.map((d) => [d.id, d])) as Record<DistrictId, District>

/** Entering this radius counts as visiting the district. */
export const zoneRadius = (district: District) => district.padRadius + 0.4
/** Decoration stays outside this radius. */
export const clearRadius = (district: District) => district.padRadius + 1.4

export function districtCenter(district: District): Vec2 {
  return [Math.sin(district.angle) * district.radius, -Math.cos(district.angle) * district.radius]
}

/** Group rotation that points the district's local +z toward the island center. */
export function districtRotation(district: District) {
  return district.radius === 0 ? 0 : -district.angle
}

/** Converts a point in a district's local frame to world x/z. */
export function toWorld(district: District, local: Vec2): Vec2 {
  const [cx, cz] = districtCenter(district)
  const theta = districtRotation(district)
  const [x, z] = local
  return [cx + x * Math.cos(theta) + z * Math.sin(theta), cz - x * Math.sin(theta) + z * Math.cos(theta)]
}

/** Where the player lands when fast-travelling to a district, and the yaw facing into it. */
export function arrivalPoint(district: District): { position: Vec2; yaw: number } {
  if (district.radius === 0) return { position: [0, 4.2], yaw: Math.PI }
  const position = toWorld(district, [0, 6.3])
  return { position, yaw: districtRotation(district) + Math.PI }
}

// ---------------------------------------------------------------------------
// Island shape
// ---------------------------------------------------------------------------

const LOBE_WIDTH = 0.4

function wrapAngle(value: number) {
  return Math.atan2(Math.sin(value), Math.cos(value))
}

/** Island edge radius for a polar angle measured clockwise from north. */
export function islandRadius(theta: number) {
  let lobe = 0
  for (const district of DISTRICTS) {
    if (district.radius === 0) continue
    const delta = wrapAngle(theta - district.angle)
    lobe = Math.max(lobe, Math.exp(-(delta * delta) / (2 * LOBE_WIDTH * LOBE_WIDTH)))
  }
  return 19 + 15.5 * lobe + 0.45 * Math.sin(theta * 5 + 0.7) + 0.3 * Math.sin(theta * 11 + 1.3)
}

export function polarAngle(x: number, z: number) {
  return Math.atan2(x, -z)
}

export function insideIsland(x: number, z: number, margin = 0) {
  return Math.hypot(x, z) < islandRadius(polarAngle(x, z)) - margin
}

// ---------------------------------------------------------------------------
// Paths (spokes from the plaza to each district)
// ---------------------------------------------------------------------------

export const PLAZA_RADIUS = 7.2

export interface Spoke {
  district: DistrictId
  points: Vec2[]
}

export const SPOKES: Spoke[] = DISTRICTS.filter((d) => d.radius > 0).map((district) => {
  const bend = deg(5)
  const at = (angle: number, radius: number): Vec2 => [Math.sin(angle) * radius, -Math.cos(angle) * radius]
  return {
    district: district.id,
    points: [
      at(district.angle, PLAZA_RADIUS - 0.4),
      at(district.angle + bend, 10.2),
      at(district.angle - bend * 0.5, 13.4),
      toWorld(district, [0, 5.2]),
    ],
  }
})

/** Samples a point along a spoke's polyline (t in 0..1) with a sideways offset. */
export function spokePoint(spoke: Spoke, t: number, side = 0): Vec2 {
  const segments = spoke.points.length - 1
  const scaled = Math.min(Math.max(t, 0), 0.9999) * segments
  const index = Math.floor(scaled)
  const local = scaled - index
  const [ax, az] = spoke.points[index]
  const [bx, bz] = spoke.points[index + 1]
  const x = ax + (bx - ax) * local
  const z = az + (bz - az) * local
  const length = Math.hypot(bx - ax, bz - az) || 1
  return [x + (-(bz - az) / length) * side, z + ((bx - ax) / length) * side]
}

/** Point on a spoke at a given distance from the island center (spokes run outward monotonically). */
export function spokePointAtRadius(spoke: Spoke, radius: number, side = 0): Vec2 {
  let low = 0
  let high = 1
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2
    const [x, z] = spokePoint(spoke, mid)
    if (Math.hypot(x, z) < radius) low = mid
    else high = mid
  }
  return spokePoint(spoke, (low + high) / 2, side)
}

export function distanceToSpokes(x: number, z: number) {
  let best = Infinity
  for (const spoke of SPOKES) {
    for (let i = 0; i < spoke.points.length - 1; i++) {
      const [ax, az] = spoke.points[i]
      const [bx, bz] = spoke.points[i + 1]
      const dx = bx - ax
      const dz = bz - az
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)))
      best = Math.min(best, Math.hypot(x - (ax + dx * t), z - (az + dz * t)))
    }
  }
  return best
}

// ---------------------------------------------------------------------------
// Project gallery arc
// ---------------------------------------------------------------------------

export const GALLERY_SLUGS = [
  "maams",
  "mario-object-detection",
  "apap-medika",
  "natural-language-inference",
  "dc-sentiment-analysis",
  "database-backup-utility",
  "crawlkit-api",
  "lembarpena",
]

export const GALLERY_RADIUS = 6.3

export const GALLERY_KIOSKS = GALLERY_SLUGS.map((slug, index) => {
  const spread = 1.38
  const a = -spread + (2 * spread * index) / (GALLERY_SLUGS.length - 1)
  const local: Vec2 = [Math.sin(a) * GALLERY_RADIUS, -Math.cos(a) * GALLERY_RADIUS + 0.6]
  const rotation = Math.atan2(-local[0], -(local[1] - 0.6))
  const front: Vec2 = [local[0] - Math.sin(a) * 1.35, local[1] + Math.cos(a) * 1.35]
  return { slug, local, rotation, front, project: projects.find((p) => p.slug === slug)! }
})

// ---------------------------------------------------------------------------
// Interactables
// ---------------------------------------------------------------------------

type LocalInteractable = Omit<Interactable, "position"> & { local: Vec2 }

const localInteractables: LocalInteractable[] = [
  { id: "home-monolith", district: "home", label: "About me", local: [0, -1.4], radius: 2.4, panel: { type: "about" } },
  { id: "home-bookcase", district: "home", label: "Writing & articles", local: [4.2, 0], radius: 1.5, panel: { type: "writing" } },
  { id: "lab-door", district: "lab", label: "GDP Labs · AI Engineer", local: [0, 2.6], radius: 2.6, panel: { type: "experience", id: "gdp-labs" } },
  { id: "workshop-terminal", district: "workshop", label: "bitcorp. · Software Engineer", local: [0, 0.4], radius: 2.4, panel: { type: "experience", id: "bitcorp" } },
  { id: "projects-index", district: "projects", label: "All projects", local: [0, 1.4], radius: 1.8, panel: { type: "projects" } },
  ...GALLERY_KIOSKS.map<LocalInteractable>((kiosk) => ({
    id: `kiosk-${kiosk.slug}`,
    district: "projects",
    label: kiosk.project.title.length > 34 ? kiosk.project.shortTitle ?? kiosk.project.title : kiosk.project.title,
    local: kiosk.front,
    radius: 1.25,
    panel: { type: "project", slug: kiosk.slug },
  })),
  { id: "skills-terminal", district: "skills", label: "Skills & technologies", local: [0, 1.6], radius: 2.2, panel: { type: "skills" } },
  { id: "awards-hall", district: "awards", label: "Honors & awards", local: [0, 1.2], radius: 2.4, panel: { type: "awards" } },
  { id: "contact-terminal", district: "contact", label: "Contact & resume", local: [-3.2, 2.0], radius: 1.9, panel: { type: "contact" } },
  { id: "contact-portal", district: "contact", label: "Back to main portfolio", local: [3.2, 1.9], radius: 1.6, panel: { type: "exit" } },
]

export const INTERACTABLES: Interactable[] = localInteractables.map(({ local, ...item }) => ({
  ...item,
  position: toWorld(DISTRICT_BY_ID[item.district], local),
}))

// ---------------------------------------------------------------------------
// Colliders (district-local definitions converted to world space)
// ---------------------------------------------------------------------------

type LocalCollider =
  | { kind: "circle"; at: Vec2; r: number }
  | { kind: "box"; at: Vec2; hw: number; hd: number; rot?: number }

// Home plaza: furniture sits in the six slots between the path mouths (30°, 90°, ... 330°).
export const HOME_LAYOUT = {
  lamps: [polarLocal(30, 5.8), polarLocal(330, 5.8)],
  desk: polarLocal(270, 5.0),
  bookcase: polarLocal(90, 5.4),
  benches: [polarLocal(150, 5.4), polarLocal(210, 5.4)],
  plants: [[-2.1, -3.0], [2.1, -3.0]] as Vec2[],
}

function polarLocal(degrees: number, radius: number): Vec2 {
  return [Math.sin(deg(degrees)) * radius, -Math.cos(deg(degrees)) * radius]
}

/** Rotation that turns a prop's front (+z) toward the plaza center. */
export function faceCenter([x, z]: Vec2) {
  return Math.atan2(-x, -z)
}

const localColliders: Partial<Record<DistrictId, LocalCollider[]>> = {
  home: [
    { kind: "box", at: [0, -3.1], hw: 1.35, hd: 0.45 },
    ...HOME_LAYOUT.plants.map((at): LocalCollider => ({ kind: "circle", at, r: 0.35 })),
    ...HOME_LAYOUT.lamps.map((at): LocalCollider => ({ kind: "circle", at, r: 0.4 })),
    ...HOME_LAYOUT.benches.map((at): LocalCollider => ({ kind: "circle", at, r: 0.6 })),
    // Desk + chair: the chair sits on the plaza side of the desk.
    { kind: "box", at: [HOME_LAYOUT.desk[0] + 0.45, HOME_LAYOUT.desk[1]], hw: 0.85, hd: 0.95, rot: faceCenter(HOME_LAYOUT.desk) },
    { kind: "box", at: HOME_LAYOUT.bookcase, hw: 0.95, hd: 0.35, rot: faceCenter(HOME_LAYOUT.bookcase) },
  ],
  lab: [
    { kind: "box", at: [0, -2.4], hw: 4.7, hd: 3.9 },
    { kind: "circle", at: [-5.8, 0.8], r: 1.2 },
    { kind: "circle", at: [5.8, 0.8], r: 1.2 },
    { kind: "circle", at: [-5.0, -4.9], r: 1.0 },
    { kind: "circle", at: [5.0, -4.9], r: 1.0 },
    { kind: "circle", at: [-6.9, -1.6], r: 0.9 },
    { kind: "circle", at: [6.9, -1.6], r: 0.9 },
    { kind: "circle", at: [-3.6, 5.0], r: 0.7 },
    { kind: "circle", at: [3.6, 5.0], r: 0.7 },
    { kind: "box", at: [2.4, 2.4], hw: 0.65, hd: 0.35, rot: -0.35 },
  ],
  workshop: [
    { kind: "box", at: [0, -2.2], hw: 4.6, hd: 0.8 },
    { kind: "circle", at: [-5.5, -2.2], r: 0.9 },
    { kind: "circle", at: [5.5, -2.2], r: 0.9 },
    { kind: "box", at: [-4.6, 1.3], hw: 1.05, hd: 0.85 },
    { kind: "box", at: [4.6, 1.3], hw: 1.05, hd: 0.85 },
    { kind: "box", at: [0, -0.5], hw: 0.8, hd: 0.45 },
    { kind: "circle", at: [-1.4, 3.6], r: 0.35 },
    { kind: "circle", at: [1.4, 3.6], r: 0.35 },
    { kind: "circle", at: [-2.25, 3.9], r: 0.25 },
    { kind: "circle", at: [2.25, 3.9], r: 0.25 },
    { kind: "circle", at: [-4.6, -4.4], r: 0.8 },
    { kind: "box", at: [4.6, -4.4], hw: 0.8, hd: 0.7 },
    { kind: "box", at: [0, -4.7], hw: 2.5, hd: 0.25 },
  ],
  projects: [{ kind: "circle", at: [0, 0.2], r: 0.9 }],
  skills: [
    { kind: "circle", at: [0, -0.4], r: 1.6 },
    { kind: "box", at: [0, -3.4], hw: 1.9, hd: 0.2 },
    { kind: "circle", at: [-4.3, -2.2], r: 0.9 },
    { kind: "circle", at: [4.3, -2.2], r: 0.9 },
  ],
  awards: [
    { kind: "circle", at: [0, -2.9], r: 0.9 },
    { kind: "circle", at: [-3.7, -0.4], r: 0.5 },
    { kind: "circle", at: [3.7, -0.4], r: 0.5 },
    { kind: "circle", at: [-2.2, -1.3], r: 0.6 },
    { kind: "circle", at: [0, -0.6], r: 0.6 },
    { kind: "circle", at: [2.2, -1.3], r: 0.6 },
  ],
  contact: [
    { kind: "box", at: [0, -2.2], hw: 1.5, hd: 1.5 },
    { kind: "box", at: [-3.2, 0.8], hw: 0.5, hd: 0.4 },
    { kind: "circle", at: [2.2, 0.8], r: 0.35 },
    { kind: "circle", at: [4.2, 0.8], r: 0.35 },
  ],
}

// ---------------------------------------------------------------------------
// Signs: every district's sign stands in the same spot, left of the entrance path,
// angled toward visitors arriving from the plaza.
// ---------------------------------------------------------------------------

export const SIGN_WIDTH = 3.4
export const SIGN_ROTATION = 0.35

export function signPlacement(district: District): { local: Vec2; rotation: number } {
  return { local: [-3.1, district.padRadius - 1.25], rotation: SIGN_ROTATION }
}

function galleryColliders(): LocalCollider[] {
  return GALLERY_KIOSKS.map((kiosk) => ({ kind: "box", at: kiosk.local, hw: 0.95, hd: 0.35, rot: kiosk.rotation }))
}

export function buildStaticColliders(): Collider[] {
  const colliders: Collider[] = []
  for (const district of DISTRICTS) {
    const sign = signPlacement(district)
    const signCollider: LocalCollider[] =
      district.radius > 0 ? [{ kind: "box", at: sign.local, hw: SIGN_WIDTH / 2, hd: 0.2, rot: sign.rotation }] : []
    const list = [
      ...(localColliders[district.id] ?? []),
      ...(district.id === "projects" ? galleryColliders() : []),
      ...signCollider,
    ]
    for (const collider of list) {
      const [x, z] = toWorld(district, collider.at)
      if (collider.kind === "circle") colliders.push({ kind: "circle", x, z, r: collider.r })
      else colliders.push({ kind: "box", x, z, hw: collider.hw, hd: collider.hd, rot: (collider.rot ?? 0) + districtRotation(district) })
    }
  }
  return colliders
}

// ---------------------------------------------------------------------------
// Skill tokens
// ---------------------------------------------------------------------------

export const TOKEN_COLORS: Record<string, string> = {
  languages: COLORS.coral,
  "ai/ml": COLORS.lavender,
  backend: COLORS.green,
  "frontend & mobile": COLORS.yellow,
  databases: COLORS.blue,
  "cloud & tools": COLORS.orange,
}

// Languages ring the home plaza; every other category lines the path to a related district.
const RING_ANGLES = [30, 330, 150, 210]
const tokenRoutes: { spoke: DistrictId | "ring"; skills: string[] }[] = [
  { spoke: "ring", skills: ["Python", "TypeScript", "Java", "Go"] },
  { spoke: "lab", skills: ["PyTorch", "TensorFlow", "LangChain", "LangGraph"] },
  { spoke: "skills", skills: ["NeMo Guardrails", "n8n", "OpenCV", "YOLO", "Hugging Face Transformers"] },
  { spoke: "workshop", skills: ["FastAPI", "Django", "NestJS", "Spring Boot"] },
  { spoke: "projects", skills: ["Next.js", "React.js", "Vue.js", "Tailwind CSS", "Flutter"] },
  { spoke: "awards", skills: ["PostgreSQL", "MySQL", "MongoDB"] },
  { spoke: "contact", skills: ["Docker", "Google Cloud", "AWS"] },
]

export interface TokenSpot {
  skill: string
  category: string
  color: string
  position: Vec2
}

const categoryOf = Object.fromEntries(
  skillCategories.flatMap((category) => category.skills.map((skill) => [skill.name, category.label])),
)

export const TOKENS: TokenSpot[] = tokenRoutes.flatMap((route) => {
  if (route.spoke === "ring") {
    return route.skills.map((skill, index) => {
      const angle = deg(RING_ANGLES[index])
      return { skill, position: [Math.sin(angle) * 9.6, -Math.cos(angle) * 9.6] as Vec2 }
    })
  }
  // Evenly spaced along the open stretch of the path, between the plaza and the district pad.
  const spoke = SPOKES.find((item) => item.district === route.spoke)!
  const district = DISTRICT_BY_ID[route.spoke]
  const start = PLAZA_RADIUS + 1.2
  const end = district.radius - district.padRadius - 1.0
  const count = route.skills.length
  return route.skills.map((skill, index) => ({
    skill,
    position: spokePointAtRadius(spoke, start + ((end - start) * index) / Math.max(count - 1, 1), index % 2 === 0 ? 0.55 : -0.55),
  }))
}).map((token) => ({
  ...token,
  category: categoryOf[token.skill],
  color: TOKEN_COLORS[categoryOf[token.skill]],
}))

export const SPAWN = { position: [0, 4.2] as Vec2, yaw: Math.PI }

// ---------------------------------------------------------------------------
// Story triggers: walking through a spot shows a one-time flavor toast.
// They illustrate the systems Hilal worked on; they are not measurements.
// ---------------------------------------------------------------------------

export interface Trigger {
  id: string
  position: Vec2
  radius: number
  title: string
  detail: string
}

export const TRIGGERS: Trigger[] = [
  {
    id: "face-scan-gate",
    position: toWorld(DISTRICT_BY_ID.workshop, [0, 3.6]),
    radius: 1.1,
    title: "Face match · anti-spoofing · GPS: clocked in",
    detail: "The attendance flow Hilal built at bitcorp., in miniature",
  },
  {
    id: "guardrail-ring",
    position: toWorld(DISTRICT_BY_ID.lab, [0, 5.6]),
    radius: 1.5,
    title: "Guardrail check: verdict SAFE",
    detail: "Every visitor passes an LLM safety classifier here",
  },
]
