// Layout of Orbit Park: a space theme park floating in the void. Mission Control (home) sits in
// the middle, eight lands ring it, the park gate is in the south, and a giant rocket marks the north.
// Everything spatial (positions, colliders, tokens) lives here.
//
// Conventions: y is up, north is -z, angles are degrees clockwise from north. A district's local
// frame has +z pointing back toward the park center (the side visitors arrive from).

import { articles } from "../../content/articles"
import { projects } from "../../content/projects"
import { skillCategories } from "../../content/skills"

export type DistrictId =
  | "home"
  | "gdp-labs"
  | "bitcorp"
  | "campus"
  | "projects"
  | "skills"
  | "articles"
  | "awards"
  | "contact"

export type CampusSection = "education" | "teaching" | "organizations"

export type PanelRef =
  | { type: "about" }
  | { type: "experience"; id: "gdp-labs" | "bitcorp" }
  | { type: "campus"; section?: CampusSection }
  | { type: "project"; slug: string }
  | { type: "projects" }
  | { type: "skills" }
  | { type: "articles" }
  | { type: "article"; slug: string }
  | { type: "awards" }
  | { type: "contact" }
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
  regolith: "#8B8CB8",
  cliff: "#5C4F7D",
}

export const PARK_NAME = "Orbit Park"

const rad = (degrees: number) => (degrees * Math.PI) / 180

/** World x/z for a polar position (degrees clockwise from north). */
export function polar(degrees: number, radius: number): Vec2 {
  return [Math.sin(rad(degrees)) * radius, -Math.cos(rad(degrees)) * radius]
}

const DISTRICT_RING = 44

export const DISTRICTS: District[] = [
  {
    id: "home",
    path: "~/home",
    title: "Mission Control",
    subtitle: "About me",
    summary: "Who I am, what I build, and where I'm heading.",
    angle: 0,
    radius: 0,
    padRadius: 12,
    color: COLORS.coral,
    panel: { type: "about" },
  },
  {
    id: "gdp-labs",
    path: "gdp-labs/",
    title: "GDP Labs",
    subtitle: "AI Engineer Intern",
    summary: "LLM guardrails, chat pipeline services, and guardrail research.",
    angle: 340,
    radius: DISTRICT_RING,
    padRadius: 11,
    color: COLORS.lavender,
    panel: { type: "experience", id: "gdp-labs" },
  },
  {
    id: "bitcorp",
    path: "bitcorp/",
    title: "PT Bringin Inti Teknologi (bitcorp.)",
    subtitle: "Software Engineer Intern",
    summary: "Backend systems, facial recognition attendance, and approval workflows.",
    angle: 20,
    radius: DISTRICT_RING,
    padRadius: 11,
    color: COLORS.coral,
    panel: { type: "experience", id: "bitcorp" },
  },
  {
    id: "campus",
    path: "campus/",
    title: "Universitas Indonesia",
    subtitle: "Teaching Assistant · Organizations",
    summary: "Computer Science studies, teaching assistantships, and student organizations.",
    angle: 260,
    radius: DISTRICT_RING,
    padRadius: 11,
    color: COLORS.yellow,
    panel: { type: "campus" },
  },
  {
    id: "projects",
    path: "projects/",
    title: "Project Hangar",
    subtitle: "Selected technical projects",
    summary: "AI/ML, backend, and full-stack projects with source and demos.",
    angle: 60,
    radius: DISTRICT_RING,
    padRadius: 11,
    color: COLORS.green,
    panel: { type: "projects" },
  },
  {
    id: "skills",
    path: "skills/",
    title: "Tech Stack",
    subtitle: "Skills & technologies",
    summary: "Languages, AI/ML, backend, frontend, databases, and cloud tools.",
    angle: 100,
    radius: DISTRICT_RING,
    padRadius: 9.5,
    color: COLORS.blue,
    panel: { type: "skills" },
  },
  {
    id: "articles",
    path: "articles/",
    title: "Article Library",
    subtitle: "Writing on Medium",
    summary: "Articles on deployment, testing, databases, clean code, and security.",
    angle: 140,
    radius: DISTRICT_RING,
    padRadius: 10.5,
    color: COLORS.lavender,
    panel: { type: "articles" },
  },
  {
    id: "awards",
    path: "awards/",
    title: "Hall of Achievements",
    subtitle: "Honors & awards",
    summary: "Scholarship and competition awards.",
    angle: 300,
    radius: DISTRICT_RING,
    padRadius: 9.5,
    color: COLORS.orange,
    panel: { type: "awards" },
  },
  {
    id: "contact",
    path: "contact/",
    title: "Contact Hub",
    subtitle: "Contact & resume",
    summary: "Resume, email, GitHub, and LinkedIn.",
    angle: 220,
    radius: DISTRICT_RING,
    padRadius: 9.5,
    color: COLORS.coral,
    panel: { type: "contact" },
  },
]

export const DISTRICT_BY_ID = Object.fromEntries(DISTRICTS.map((d) => [d.id, d])) as Record<DistrictId, District>
const RING_DISTRICTS = DISTRICTS.filter((d) => d.radius > 0).sort((a, b) => a.angle - b.angle)

/** Entering this radius counts as visiting the district. */
export const zoneRadius = (district: District) => district.padRadius + 0.4
/** Decoration stays outside this radius. */
export const clearRadius = (district: District) => district.padRadius + 1.4

export function districtCenter(district: District): Vec2 {
  return polar(district.angle, district.radius)
}

/** Group rotation that points the district's local +z toward the park center. */
export function districtRotation(district: District) {
  return district.radius === 0 ? 0 : -rad(district.angle)
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
  if (district.radius === 0) return { position: [0, 9.5], yaw: Math.PI }
  const position = toWorld(district, [0, district.padRadius - 1.6])
  return { position, yaw: districtRotation(district) + Math.PI }
}

/** Rotation that turns a prop's front (+z) toward the origin of its frame. */
export function faceCenter([x, z]: Vec2) {
  return Math.atan2(-x, -z)
}

// ---------------------------------------------------------------------------
// Island shape: lobes under each land, a wide notch in the south for the entrance
// ---------------------------------------------------------------------------

const ISLAND_BASE = 39
const ISLAND_LOBE = 21
const LOBE_WIDTH = 0.27

function wrapAngle(value: number) {
  return Math.atan2(Math.sin(value), Math.cos(value))
}

// A short peninsula in the south holds the entrance plaza in front of the park gate.
const ENTRANCE_BUMP = 7
const ENTRANCE_WIDTH = 0.14

/** Island edge radius for a polar angle (radians, clockwise from north). */
export function islandRadius(theta: number) {
  let lobe = 0
  for (const district of RING_DISTRICTS) {
    const delta = wrapAngle(theta - rad(district.angle))
    lobe = Math.max(lobe, Math.exp(-(delta * delta) / (2 * LOBE_WIDTH * LOBE_WIDTH)))
  }
  const south = wrapAngle(theta - Math.PI)
  const entrance = ENTRANCE_BUMP * Math.exp(-(south * south) / (2 * ENTRANCE_WIDTH * ENTRANCE_WIDTH))
  return ISLAND_BASE + ISLAND_LOBE * lobe + entrance + 0.45 * Math.sin(theta * 5 + 0.7) + 0.3 * Math.sin(theta * 11 + 1.3)
}

export const ISLAND_MAX_RADIUS = ISLAND_BASE + ISLAND_LOBE + 1

export function polarAngle(x: number, z: number) {
  return Math.atan2(x, -z)
}

export function insideIsland(x: number, z: number, margin = 0) {
  return Math.hypot(x, z) < islandRadius(polarAngle(x, z)) - margin
}

// ---------------------------------------------------------------------------
// Paths: spokes from Mission Control to each land, the entrance avenue, and a promenade
// that links neighbouring lands around the outside.
// ---------------------------------------------------------------------------

export const PLAZA_RADIUS = 12

export interface PathLine {
  id: string
  kind: "spoke" | "avenue" | "promenade"
  district?: DistrictId
  points: Vec2[]
  width: number
}

export const SPOKES: PathLine[] = RING_DISTRICTS.map((district) => ({
  id: `spoke-${district.id}`,
  kind: "spoke",
  district: district.id,
  width: 3,
  points: [
    polar(district.angle, PLAZA_RADIUS - 0.5),
    polar(district.angle + 3, 19.5),
    polar(district.angle - 1.5, 26.5),
    toWorld(district, [0, district.padRadius - 1.5]),
  ],
}))

export const GATE_Z = 36
export const AVENUE: PathLine = {
  id: "avenue",
  kind: "avenue",
  width: 5,
  points: [
    [0, 44.6],
    [0, PLAZA_RADIUS - 0.5],
  ],
}

const PROMENADE_RADIUS = 42
function promenadeArc(a: District, b: District): PathLine {
  const gap = (district: District) => {
    const r = district.padRadius - 1.5
    const cos = (PROMENADE_RADIUS ** 2 + DISTRICT_RING ** 2 - r * r) / (2 * PROMENADE_RADIUS * DISTRICT_RING)
    return (Math.acos(Math.min(1, cos)) * 180) / Math.PI
  }
  let end = b.angle
  if (end < a.angle) end += 360
  const from = a.angle + gap(a)
  const to = end - gap(b)
  const steps = Math.max(2, Math.ceil((to - from) / 2.5))
  return {
    id: `promenade-${a.id}-${b.id}`,
    kind: "promenade",
    width: 3,
    points: Array.from({ length: steps + 1 }, (_, i) => polar(from + ((to - from) * i) / steps, PROMENADE_RADIUS)),
  }
}

// The south between Article Library and Contact Hub is the entrance, so no promenade crosses it.
export const PROMENADES: PathLine[] = RING_DISTRICTS.map((district, index) => ({
  district,
  next: RING_DISTRICTS[(index + 1) % RING_DISTRICTS.length],
}))
  .filter(({ district, next }) => !(district.id === "articles" && next.id === "contact"))
  .map(({ district, next }) => promenadeArc(district, next))

export const PATHS: PathLine[] = [...SPOKES, AVENUE, ...PROMENADES]

/** Samples a point along a polyline (t in 0..1) with a sideways offset. */
export function linePoint(line: PathLine, t: number, side = 0): Vec2 {
  const segments = line.points.length - 1
  const scaled = Math.min(Math.max(t, 0), 0.9999) * segments
  const index = Math.floor(scaled)
  const local = scaled - index
  const [ax, az] = line.points[index]
  const [bx, bz] = line.points[index + 1]
  const x = ax + (bx - ax) * local
  const z = az + (bz - az) * local
  const length = Math.hypot(bx - ax, bz - az) || 1
  return [x + (-(bz - az) / length) * side, z + ((bx - ax) / length) * side]
}

/** Point on a spoke at a given distance from the park center (spokes run outward monotonically). */
export function spokePointAtRadius(spoke: PathLine, radius: number, side = 0): Vec2 {
  let low = 0
  let high = 1
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2
    const [x, z] = linePoint(spoke, mid)
    if (Math.hypot(x, z) < radius) low = mid
    else high = mid
  }
  return linePoint(spoke, (low + high) / 2, side)
}

/** Distance from a point to the nearest path edge (negative = on a path). */
export function distanceToPaths(x: number, z: number) {
  let best = Infinity
  for (const line of PATHS) {
    for (let i = 0; i < line.points.length - 1; i++) {
      const [ax, az] = line.points[i]
      const [bx, bz] = line.points[i + 1]
      const dx = bx - ax
      const dz = bz - az
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)))
      best = Math.min(best, Math.hypot(x - (ax + dx * t), z - (az + dz * t)) - line.width / 2)
    }
  }
  return best
}

// ---------------------------------------------------------------------------
// Park attractions (decorative rides and landmarks between the lands)
// ---------------------------------------------------------------------------

// Main Street: snack stalls face the avenue from both sides, between the gate and the plaza.
const STREET_X = 8.2

export type StallKind = "donuts" | "burgers" | "cones" | "drinks" | "bakery" | "souvenirs"

export interface Stall {
  position: Vec2
  rotation: number
  name: string
  kind: StallKind
  color: string
  vendor: GuestModel
}

export const FEATURES = {
  rocket: { position: polar(0, 22.5), radius: 5.2 },
  wheel: { position: polar(80, 22), angle: 80, radius: 6.2, axleHeight: 7.4 },
  orbiter: { position: polar(280, 22), radius: 5 },
  gate: { position: [0, GATE_Z] as Vec2, halfWidth: 4.2 },
  stalls: [
    { position: [STREET_X, 17.5], rotation: -Math.PI / 2, name: "Space Donuts", kind: "donuts", color: COLORS.coral, vendor: "astronautA" },
    { position: [STREET_X, 23.5], rotation: -Math.PI / 2, name: "Orbit Burgers", kind: "burgers", color: COLORS.orange, vendor: "alien" },
    { position: [STREET_X, 29.5], rotation: -Math.PI / 2, name: "Cosmic Cones", kind: "cones", color: COLORS.blue, vendor: "astronautB" },
    { position: [-STREET_X, 17.5], rotation: Math.PI / 2, name: "Rocket Fuel", kind: "drinks", color: COLORS.green, vendor: "astronautB" },
    { position: [-STREET_X, 23.5], rotation: Math.PI / 2, name: "Moon Bakery", kind: "bakery", color: COLORS.yellow, vendor: "astronautA" },
    { position: [-STREET_X, 29.5], rotation: Math.PI / 2, name: "Souvenirs", kind: "souvenirs", color: COLORS.lavender, vendor: "alien" },
  ] as Stall[],
  /** Staffed booths either side of the gate, facing visitors arriving from outside. */
  booths: [
    { x: -7.2, label: "tickets", vendor: "astronautB" },
    { x: 7.2, label: "info", vendor: "astronautA" },
  ] as { x: number; label: string; vendor: GuestModel }[],
}

/** Park benches around the plaza (between path mouths) and in the gaps between Main Street stalls. */
export const BENCHES: { position: Vec2; rotation: number }[] = [
  ...[80, 160, 200, 280].map((degrees) => {
    const position = polar(degrees, 9.3)
    return { position, rotation: faceCenter(position) }
  }),
  ...[20.5, 26.5].flatMap((z) => [
    { position: [STREET_X + 0.3, z] as Vec2, rotation: -Math.PI / 2 },
    { position: [-STREET_X - 0.3, z] as Vec2, rotation: Math.PI / 2 },
  ]),
]

/** Footprints decoration and monorail pillars keep clear of. */
const FEATURE_FOOTPRINTS: { position: Vec2; radius: number }[] = [
  { position: FEATURES.rocket.position, radius: FEATURES.rocket.radius + 1.5 },
  { position: FEATURES.wheel.position, radius: 6 },
  { position: FEATURES.orbiter.position, radius: FEATURES.orbiter.radius + 1 },
  { position: FEATURES.gate.position, radius: 8.5 },
  ...FEATURES.stalls.map((stall) => ({ position: stall.position, radius: 2.8 })),
  ...BENCHES.map((bench) => ({ position: bench.position, radius: 1.4 })),
]

export function distanceToFeatures(x: number, z: number) {
  let best = Infinity
  for (const feature of FEATURE_FOOTPRINTS) {
    best = Math.min(best, Math.hypot(x - feature.position[0], z - feature.position[1]) - feature.radius)
  }
  return best
}

// Orbit Express: a monorail on a ring that floats around the whole park, outside the island,
// so it frames the park without ever getting between the camera and the visitor.
export const MONORAIL = {
  radius: 68,
  height: 3.5,
  tilt: 0.06,
}

// Lamp posts: around the plaza, along both sides of the avenue and alternating sides of every spoke.
export const LAMPS: Vec2[] = [
  ...[40, 120, 240, 320].map((degrees) => polar(degrees, 10.6)),
  ...Array.from({ length: 6 }, (_, i) => 14.5 + i * 4.2).flatMap((z): Vec2[] => [
    [3.5, z],
    [-3.5, z],
  ]),
  ...SPOKES.flatMap((spoke) =>
    [16, 22.5, 29].map((r, i) => spokePointAtRadius(spoke, r, i % 2 === 0 ? 2.2 : -2.2)),
  ),
].filter(([x, z]) => distanceToFeatures(x, z) > 0.3)

// ---------------------------------------------------------------------------
// Project hangar arc and article exhibits
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

function arcSlots(count: number, radius: number, spread: number, offsetZ: number) {
  return Array.from({ length: count }, (_, index) => {
    const a = -spread + (2 * spread * index) / (count - 1)
    const local: Vec2 = [Math.sin(a) * radius, -Math.cos(a) * radius + offsetZ]
    const rotation = Math.atan2(-local[0], -(local[1] - offsetZ))
    const front: Vec2 = [local[0] - Math.sin(a) * 1.35, local[1] + Math.cos(a) * 1.35]
    return { local, rotation, front }
  })
}

export const GALLERY_KIOSKS = arcSlots(GALLERY_SLUGS.length, 7.8, 1.38, 0.8).map((slot, index) => ({
  ...slot,
  slug: GALLERY_SLUGS[index],
  project: projects.find((p) => p.slug === GALLERY_SLUGS[index])!,
}))

/** Spacecraft on display plinths in the open front of the hangar, clear of the kiosk screens. */
export const HANGAR_CRAFTS: { name: string; local: Vec2; scale: number }[] = [
  { name: "craft_speederA", local: [-5.2, 5.2], scale: 1.5 },
  { name: "craft_racer", local: [5.2, 5.2], scale: 1.8 },
]

export type ExhibitTopic = "deploy" | "mock" | "database" | "tdd" | "solid" | "security"

const EXHIBIT_TOPICS: { slug: string; topic: ExhibitTopic }[] = [
  { slug: "deployment-evolution", topic: "deploy" },
  { slug: "mock-objects-stubs", topic: "mock" },
  { slug: "database-seeding-migration", topic: "database" },
  { slug: "test-driven-development", topic: "tdd" },
  { slug: "solid-principles", topic: "solid" },
  { slug: "owasp-secure-programming", topic: "security" },
]

/** Writing desks at the front of the Article Library, where the articles get written. */
export const LIBRARY_DESKS: Vec2[] = [
  [-5.6, 4.6],
  [5.6, 4.6],
]

export const BOOKCASE = { width: 3.2, height: 2.9, depth: 0.6, levels: 5 }

/** Bookcases forming the Article Library's back wall, facing the exhibits. */
export const LIBRARY_SHELVES = [-50, -25, 0, 25, 50].map((degrees) => {
  const a = (degrees * Math.PI) / 180
  const local: Vec2 = [Math.sin(a) * 9.95, -Math.cos(a) * 9.95 + 0.6]
  return { local, rotation: -a }
})

export const ARTICLE_EXHIBITS = arcSlots(EXHIBIT_TOPICS.length, 6.8, 1.25, 0.6).map((slot, index) => ({
  ...slot,
  ...EXHIBIT_TOPICS[index],
  article: articles.find((a) => a.slug === EXHIBIT_TOPICS[index].slug)!,
}))

// ---------------------------------------------------------------------------
// Mission Control plaza layout (its lamps and benches are listed with the park's, above).
// ---------------------------------------------------------------------------

export const HOME_LAYOUT = {
  monolith: [0, -7] as Vec2,
  plants: [
    [-2.4, -6.8],
    [2.4, -6.8],
  ] as Vec2[],
  fountainRadius: 1.8,
}

// ---------------------------------------------------------------------------
// Interactables
// ---------------------------------------------------------------------------

type LocalInteractable = Omit<Interactable, "position"> & { local: Vec2 }

const localInteractables: LocalInteractable[] = [
  { id: "home-monolith", district: "home", label: "About me", local: [0, -4.9], radius: 2.6, panel: { type: "about" } },
  { id: "gdp-labs-door", district: "gdp-labs", label: "GDP Labs · AI Engineer", local: [0, 2.6], radius: 2.8, panel: { type: "experience", id: "gdp-labs" } },
  { id: "bitcorp-terminal", district: "bitcorp", label: "bitcorp. · Software Engineer", local: [0, 0.7], radius: 2.6, panel: { type: "experience", id: "bitcorp" } },
  { id: "campus-education", district: "campus", label: "Education · Computer Science", local: [0, 2.2], radius: 2.2, panel: { type: "campus", section: "education" } },
  { id: "campus-classroom", district: "campus", label: "Teaching Assistant", local: [-5.2, 3.0], radius: 2.2, panel: { type: "campus", section: "teaching" } },
  { id: "campus-booths", district: "campus", label: "Organizations · OKK UI & COMPFEST", local: [4.0, 0.3], radius: 2.4, panel: { type: "campus", section: "organizations" } },
  { id: "projects-index", district: "projects", label: "All projects", local: [0, 1.8], radius: 2, panel: { type: "projects" } },
  ...GALLERY_KIOSKS.map<LocalInteractable>((kiosk) => ({
    id: `kiosk-${kiosk.slug}`,
    district: "projects",
    label: kiosk.project.title.length > 34 ? kiosk.project.shortTitle ?? kiosk.project.title : kiosk.project.title,
    local: kiosk.front,
    radius: 1.25,
    panel: { type: "project", slug: kiosk.slug },
  })),
  { id: "skills-tower", district: "skills", label: "Skills & technologies", local: [0, 2.6], radius: 2.4, panel: { type: "skills" } },
  { id: "articles-index", district: "articles", label: "All articles", local: [0, 1.6], radius: 1.9, panel: { type: "articles" } },
  ...ARTICLE_EXHIBITS.map<LocalInteractable>((exhibit) => ({
    id: `exhibit-${exhibit.slug}`,
    district: "articles",
    label: exhibit.article.title.split(":")[0],
    local: exhibit.front,
    radius: 1.3,
    panel: { type: "article", slug: exhibit.slug },
  })),
  { id: "awards-hall", district: "awards", label: "Honors & awards", local: [0, 1.6], radius: 2.4, panel: { type: "awards" } },
  { id: "contact-terminal", district: "contact", label: "Contact & resume", local: [-3.4, 2.2], radius: 1.9, panel: { type: "contact" } },
  { id: "contact-portal", district: "contact", label: "Back to main portfolio", local: [3.4, 2.1], radius: 1.6, panel: { type: "exit" } },
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

const mirrored = (list: LocalCollider[]): LocalCollider[] =>
  list.flatMap((collider) => [
    collider,
    collider.kind === "circle"
      ? { ...collider, at: [-collider.at[0], collider.at[1]] as Vec2 }
      : { ...collider, at: [-collider.at[0], collider.at[1]] as Vec2, rot: -(collider.rot ?? 0) },
  ])

const localColliders: Partial<Record<DistrictId, LocalCollider[]>> = {
  home: [
    { kind: "box", at: HOME_LAYOUT.monolith, hw: 1.6, hd: 0.5 },
    { kind: "circle", at: [0, 0], r: HOME_LAYOUT.fountainRadius + 0.2 },
    ...HOME_LAYOUT.plants.map((at): LocalCollider => ({ kind: "circle", at, r: 0.35 })),
  ],
  "gdp-labs": [
    { kind: "box", at: [0, -3.6], hw: 5.6, hd: 4.8 },
    ...mirrored([
      { kind: "circle", at: [7.2, 1.2], r: 1.4 },
      { kind: "circle", at: [6.2, -6.0], r: 1.1 },
      { kind: "circle", at: [8.6, -2.0], r: 1.0 },
      { kind: "circle", at: [4.6, 6.6], r: 0.8 },
    ]),
    { kind: "box", at: [3.0, 3.0], hw: 0.7, hd: 0.4, rot: -0.35 },
    { kind: "circle", at: [-2.6, 3.4], r: 0.4 },
  ],
  bitcorp: [
    { kind: "box", at: [0, -2.6], hw: 5.6, hd: 0.8 },
    ...mirrored([
      { kind: "circle", at: [6.8, -2.6], r: 0.9 },
      { kind: "box", at: [5.6, 1.6], hw: 1.05, hd: 0.85 },
      { kind: "box", at: [5.6, -5.6], hw: 0.9, hd: 0.8 },
      { kind: "circle", at: [1.4, 4.3], r: 0.35 },
      { kind: "circle", at: [2.3, 4.6], r: 0.25 },
    ]),
    { kind: "box", at: [0, -0.6], hw: 0.8, hd: 0.45 },
    { kind: "box", at: [0, -6.4], hw: 2.9, hd: 0.25 },
    { kind: "circle", at: [-2.8, 1.2], r: 0.4 },
  ],
  campus: [
    { kind: "box", at: [0, -7.2], hw: 5.4, hd: 1.4 },
    { kind: "box", at: [0, -7.2], hw: 1.5, hd: 1.6 },
    ...mirrored([
      { kind: "circle", at: [4.6, -5.4], r: 0.35 },
      { kind: "circle", at: [3.0, -5.4], r: 0.35 },
      { kind: "circle", at: [8.4, -3.5], r: 0.2 },
    ]),
    { kind: "box", at: [-5.2, -2.4], hw: 2.0, hd: 0.2 },
    { kind: "box", at: [-5.2, 0.5], hw: 2.0, hd: 1.1 },
    { kind: "box", at: [5.4, -2.0], hw: 0.7, hd: 1.3 },
    { kind: "box", at: [5.4, 2.6], hw: 0.7, hd: 1.3 },
    { kind: "circle", at: [0, 0.4], r: 0.9 },
    { kind: "circle", at: [3.2, -0.2], r: 0.4 },
    { kind: "circle", at: [-3.0, 2.6], r: 0.4 },
  ],
  projects: [
    { kind: "circle", at: [0, 0.2], r: 0.9 },
    ...HANGAR_CRAFTS.map((craft): LocalCollider => ({ kind: "circle", at: craft.local, r: 1.4 })),
  ],
  skills: [
    { kind: "circle", at: [0, -1.2], r: 2.3 },
    { kind: "box", at: [0, -6.0], hw: 2.0, hd: 0.2 },
    ...mirrored([{ kind: "circle", at: [5.0, -3.2], r: 0.9 }]),
  ],
  articles: [
    { kind: "circle", at: [0, -0.4], r: 0.85 },
    ...LIBRARY_SHELVES.map((shelf): LocalCollider => ({ kind: "box", at: shelf.local, hw: BOOKCASE.width / 2 + 0.05, hd: 0.4, rot: shelf.rotation })),
    ...LIBRARY_DESKS.map((at): LocalCollider => ({ kind: "box", at, hw: 1.0, hd: 1.05, rot: faceCenter(at) })),
  ],
  awards: [
    { kind: "circle", at: [0, -3.6], r: 1.1 },
    ...mirrored([
      { kind: "circle", at: [4.4, -0.6], r: 0.5 },
      { kind: "circle", at: [2.6, -1.6], r: 0.6 },
    ]),
    { kind: "circle", at: [0, -0.8], r: 0.6 },
  ],
  contact: [
    { kind: "box", at: [0, -2.6], hw: 1.6, hd: 1.6 },
    { kind: "box", at: [-3.4, 1.0], hw: 0.5, hd: 0.4 },
    { kind: "circle", at: [2.0, 1.0], r: 0.35 },
    { kind: "circle", at: [4.8, 1.0], r: 0.35 },
  ],
}

// ---------------------------------------------------------------------------
// Signs: every land has the same low monument sign, standing well inside its pad (clear of the
// rim) left of the entrance path, turned slightly toward visitors walking in.
// ---------------------------------------------------------------------------

export const SIGN_WIDTH = 3.4
const SIGN_BEARING = rad(28)

export function signPlacement(district: District): { local: Vec2; rotation: number } {
  const r = district.padRadius - 2.4
  return { local: [-Math.sin(SIGN_BEARING) * r, Math.cos(SIGN_BEARING) * r], rotation: 0.3 }
}

function galleryColliders(): LocalCollider[] {
  return GALLERY_KIOSKS.map((kiosk) => ({ kind: "box", at: kiosk.local, hw: 0.95, hd: 0.35, rot: kiosk.rotation }))
}

/** Exhibit lectern plus the topic prop standing behind it (further from the district center). */
export function exhibitPropPosition(exhibit: (typeof ARTICLE_EXHIBITS)[number]): Vec2 {
  return [exhibit.local[0] + Math.sin(exhibit.rotation) * -1.5, exhibit.local[1] + Math.cos(exhibit.rotation) * -1.5]
}

function exhibitColliders(): LocalCollider[] {
  return ARTICLE_EXHIBITS.flatMap((exhibit): LocalCollider[] => [
    { kind: "box", at: exhibit.local, hw: 0.6, hd: 0.35, rot: exhibit.rotation },
    { kind: "circle", at: exhibitPropPosition(exhibit), r: 0.9 },
  ])
}

function featureColliders(): Collider[] {
  const { rocket, wheel, orbiter, gate, stalls, booths } = FEATURES
  const [wx, wz] = wheel.position
  const along = polar(wheel.angle, 1)
  const across: Vec2 = [-along[1], along[0]]
  const wheelFeet = [-4.4, 4.4].flatMap((d) =>
    [-1.3, 1.3].map((s): Collider => ({
      kind: "circle",
      x: wx + along[0] * d + across[0] * s,
      z: wz + along[1] * d + across[1] * s,
      r: 0.45,
    })),
  )
  return [
    { kind: "circle", x: rocket.position[0], z: rocket.position[1], r: 3.4 },
    { kind: "box", x: rocket.position[0] + 4.2, z: rocket.position[1], hw: 1.4, hd: 1.4, rot: 0 },
    ...wheelFeet,
    { kind: "circle", x: wx, z: wz, r: 1.4 },
    { kind: "circle", x: orbiter.position[0], z: orbiter.position[1], r: orbiter.radius },
    { kind: "box", x: -gate.halfWidth, z: gate.position[1], hw: 0.55, hd: 0.55, rot: 0 },
    { kind: "box", x: gate.halfWidth, z: gate.position[1], hw: 0.55, hd: 0.55, rot: 0 },
    ...booths.map((booth): Collider => ({ kind: "box", x: booth.x, z: gate.position[1], hw: 1.25, hd: 1.0, rot: 0 })),
    ...stalls.map((stall): Collider => ({ kind: "box", x: stall.position[0], z: stall.position[1], hw: 1.6, hd: 0.95, rot: stall.rotation })),
    ...BENCHES.map((bench): Collider => ({ kind: "box", x: bench.position[0], z: bench.position[1], hw: 1.15, hd: 0.4, rot: bench.rotation })),
    ...LAMPS.map(([x, z]): Collider => ({ kind: "circle", x, z, r: 0.18 })),
  ]
}

export function buildStaticColliders(): Collider[] {
  const colliders: Collider[] = featureColliders()
  for (const district of DISTRICTS) {
    const sign = signPlacement(district)
    const signCollider: LocalCollider[] =
      district.radius > 0 ? [{ kind: "box", at: sign.local, hw: SIGN_WIDTH / 2 + 0.15, hd: 0.32, rot: sign.rotation }] : []
    const list = [
      ...(localColliders[district.id] ?? []),
      ...(district.id === "projects" ? galleryColliders() : []),
      ...(district.id === "articles" ? exhibitColliders() : []),
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
// Skill tokens: languages line the entrance avenue; each other category lines the path
// to a related land.
// ---------------------------------------------------------------------------

export const TOKEN_COLORS: Record<string, string> = {
  languages: COLORS.coral,
  "ai/ml": COLORS.lavender,
  backend: COLORS.green,
  "frontend & mobile": COLORS.yellow,
  databases: COLORS.blue,
  "cloud & tools": COLORS.orange,
}

const tokenRoutes: { route: DistrictId | "avenue"; skills: string[] }[] = [
  { route: "avenue", skills: ["Python", "TypeScript", "Java", "Go"] },
  { route: "gdp-labs", skills: ["PyTorch", "TensorFlow", "LangChain", "LangGraph", "NeMo Guardrails"] },
  { route: "skills", skills: ["n8n", "OpenCV", "YOLO", "Hugging Face Transformers"] },
  { route: "bitcorp", skills: ["FastAPI", "Django", "NestJS", "Spring Boot"] },
  { route: "projects", skills: ["Next.js", "React.js", "Vue.js", "Tailwind CSS", "Flutter"] },
  { route: "articles", skills: ["PostgreSQL", "MySQL", "MongoDB"] },
  { route: "contact", skills: ["Docker", "Google Cloud", "AWS"] },
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

export const TOKENS: TokenSpot[] = tokenRoutes
  .flatMap(({ route, skills }) => {
    if (route === "avenue") {
      return skills.map((skill, index) => ({ skill, position: [index % 2 === 0 ? 0.6 : -0.6, 30 - index * 4.5] as Vec2 }))
    }
    // Evenly spaced along the open stretch of the spoke, between the plaza and the land's pad.
    const spoke = SPOKES.find((item) => item.district === route)!
    const district = DISTRICT_BY_ID[route]
    const start = PLAZA_RADIUS + 1.5
    const end = district.radius - district.padRadius - 1.2
    return skills.map((skill, index) => ({
      skill,
      position: spokePointAtRadius(spoke, start + ((end - start) * index) / Math.max(skills.length - 1, 1), index % 2 === 0 ? 0.55 : -0.55),
    }))
  })
  .map((token) => ({
    ...token,
    category: categoryOf[token.skill],
    color: TOKEN_COLORS[categoryOf[token.skill]],
  }))

/** Visitors arrive just outside the park gate, facing in, with a low camera that frames the gate. */
export const SPAWN = { position: [0, 41.5] as Vec2, yaw: Math.PI, pitch: 0.36, distance: 15 }

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
    id: "park-gate",
    position: [0, GATE_Z - 1.5],
    radius: 2.4,
    title: `Welcome to ${PARK_NAME}`,
    detail: "Every land here is built from Hilal's real work",
  },
  {
    id: "face-scan-gate",
    position: toWorld(DISTRICT_BY_ID.bitcorp, [0, 4.3]),
    radius: 1.1,
    title: "Face match · anti-spoofing · GPS: clocked in",
    detail: "The attendance flow Hilal built at bitcorp., in miniature",
  },
  {
    id: "guardrail-ring",
    position: toWorld(DISTRICT_BY_ID["gdp-labs"], [0, DISTRICT_BY_ID["gdp-labs"].padRadius - 0.6]),
    radius: 1.5,
    title: "Guardrail check: verdict SAFE",
    detail: "Every visitor passes an LLM safety classifier here",
  },
]

// ---------------------------------------------------------------------------
// Guests: astronauts (and one alien) standing around the park. Static, instanced.
// ---------------------------------------------------------------------------

export type GuestModel = "astronautA" | "astronautB" | "alien"

export const GUESTS: { model: GuestModel; position: Vec2; rotation: number }[] = [
  { model: "astronautA", position: [3.2, 3.4], rotation: -2.4 },
  { model: "astronautB", position: [-3.0, 3.8], rotation: 2.6 },
  // Customers at the Main Street counters (Kenney's characters face -z)
  { model: "astronautB", position: [6.4, 17.9], rotation: -Math.PI / 2 },
  { model: "astronautA", position: [6.5, 23.0], rotation: -Math.PI / 2 - 0.3 },
  { model: "alien", position: [-6.4, 17.1], rotation: Math.PI / 2 },
  { model: "astronautB", position: [-6.5, 29.9], rotation: Math.PI / 2 + 0.2 },
  { model: "astronautA", position: [-2.4, 27.6], rotation: 0.4 },
  { model: "astronautB", position: polar(80, 14.6), rotation: -1.6 },
  { model: "astronautA", position: polar(76, 14.8), rotation: -1.9 },
  { model: "astronautB", position: polar(280, 15.2), rotation: 1.6 },
  { model: "astronautA", position: polar(6, 15.6), rotation: 3.0 },
]
