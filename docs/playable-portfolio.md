# Inference Island: the playable 3D portfolio

`/3d` is an optional, playable version of the portfolio. The conventional site at `/` stays the primary,
professional experience; the 3D route complements it and never replaces it.

- Main portfolio: `/` (unchanged content, plus an "Explore My 3D Portfolio" entry point)
- Playable portfolio: `/3d`

---

## 1. Investigation report

### Existing site (verified in this repo)

| Area | Finding |
| --- | --- |
| Stack | Next.js 14.2.30 (App Router), React 18.3.1, TypeScript, Tailwind 3.4, framer-motion, next-themes |
| Next config | `next.config.js`. A second `next.config.mjs` (with `optimizeCss`, image formats, `removeConsole`) was never loaded, because Next 14 resolves `.js` first; it has been removed. |
| TypeScript | VS Code bundles TypeScript 6.0, which rejected the old `tsconfig.json` (`target: ES5` and `baseUrl` are deprecated). The config now uses `target: ES2017`, `esnext` libs, no `baseUrl`, and `@/*` → `src/*` (matching `components.json`). `src/types/css.d.ts` covers the global CSS import that TS 6 checks. Both TS 5.8 (project) and TS 6.0.3 report 0 errors. |
| Build | `next build` passes; type and lint errors are ignored during builds by config. |
| Lint | `next lint` does not pick up the flat `eslint.config.mjs`, and the config extends `next/typescript`, which does not exist in the installed `eslint-config-next@14.0.0`. Linting was not runnable before this work. |
| Content | Hard-coded arrays inside section components. Experience, awards and skills now live in `src/content/` (see §3). |
| Hero CTA placement | Hero (`src/components/sections/hero.tsx`), below the existing "Get in touch" / "Resume" buttons. |

### Reference: glorioussatria.my.id ("Satria's Kingdom")

Observed in headless Chrome 155 (desktop 1440×900 and mobile 390×844 with touch), driven with Playwright,
plus REA captures. **Verified observations:**

- Next.js + React app (REA bundle fingerprint, high confidence). The renderer is three.js: console shows
  `THREE.WebGLRenderer` and the bundle contains three's WebGL extension list.
- No `.glb` files were requested on load or during play; the world appears to be built procedurally in code.
  The only textures fetched were small WebP company logos. *(Assumption: geometry is code-built; not confirmed
  from source.)*
- Loading screen: parchment card, % progress bar, rotating tip.
- Entry card over a live aerial view of the world: title, role, control legend, **Play** and **Quick View**.
- Quick View goes to `/classic`, a conventional profile page with an AI "Ask Satria" chat.
- The DOM also contains a complete semantic HTML profile (all experiences, projects, links) alongside the canvas.
- Gameplay: third-person chibi avatar with a name tag, high follow camera, drag to orbit, scroll to zoom, WASD,
  Shift run, Space jump, E interact, click-to-walk, M map, N night, C avatar, J sword.
- HUD: profile chip, quest tracker ("Places 0/9", "Skills 0/27"), Map / avatar / night / sound / fullscreen /
  Quick View buttons, minimap.
- A 3-step onboarding dialogue from a companion NPC (EN/ID toggle).
- Map modal lists every location with **Go** (teleport) and **Read** (teleport into the building and open a side
  drawer with a timeline of expandable cards). Esc closes the drawer, and a "Leave" pill exits the interior.
- Mobile: virtual joystick, sword and jump buttons, compact HUD.
- In this headless session, pressing Escape did not close the map modal. This may be focus-dependent; the close button was not tested.

**What was adapted:** content-first panels over a live world, Go/Read fast travel, a non-game reading mode,
collectible skills, brief onboarding, and touch controls. **What is original:** the world concept
(a floating diorama in the site's ink-dark "editor void"), the hub-and-spoke layout, the circuit-trace paths,
the robot "guest agent", the Terminal Folio UI (VS Code-style status bar, `//` labels), all copy, and all
code. No reference code, branding, content or assets were copied.

### REA (Reverse Engineer Anything)

The linked repo (`NabilRFG12/Reverse-Engineer-anything`) is a non-fork copy of `morluto/rea` v6.0.0, published as
`rea-agents` on npm. REA was run as a CLI from a scratch directory (`rea-agents@6.0.0`, Node 22.22). `rea setup`
was **not** run, so no agent or MCP configuration was changed. REA's browser provider is passive: it attaches
to a Chrome started with a loopback-only debugging port and never drives input. Playwright was used against
the same browser for interaction.

Commands used: `list-browser-targets`, `capture-web-screenshot`, `analyze-web-bundle` (27 scripts parsed,
Next.js/React fingerprints, `/api/chat` endpoint candidate), and `inspect-web-page` (DOM/accessibility
structure, resources, console). Limitation: REA records network activity only after it attaches, so model and
texture loading was measured with Playwright from a fresh page load instead. The same REA commands were also run
against this project's production build of `/3d`: no console events, and the accessibility tree exposes the
application region, heading, entry buttons and back link.

### Content alignment with the CV

The CV in `public/assets/CV/` was replaced with a newer version during this work, and the content in `src/content/`
was then updated to match it. Both experiences read that content, so they show the same information:

| Item | Now on the site and in 3D | Source |
| --- | --- | --- |
| GDP Labs | The CV's four bullets: GLChat guardrail migration (16 content-safety categories, ~30% fewer false positives), SDK extensions, External Pipeline Services, guardrail research with a 175-case bilingual evaluation dataset | CV |
| Teaching Assistant | Aug 2024 - Oct 2025 | CV |
| Education | Aug 2022 - Aug 2026, CGPA 3.65/4.00, the CV's coursework list | CV |
| Skills | The CV's 28 skills in its six groups: languages, AI/ML, backend, frontend & mobile, databases, cloud & tools | CV |
| LinkedIn | `linkedin.com/in/hilaldfzn` everywhere (hero, contact, footer, 3D), from `src/content/profile.ts` | CV, confirmed by the owner |

Kept as they were, because the CV omits them without contradicting them: the third IYIS #15 award ("3rd Best
Presentation"), OKK UI 2024 and COMPFEST 15, HoomGroom and Marmut Music, and the About stats. KSN 2020 (on the CV)
is still not shown, matching the site's three curated awards. Certifications are no longer on the CV and are not
shown. The Facial Recognition Attendance System is part of the bitcorp. internship, so it appears in the
Engineering Workshop rather than as a standalone project.

---

## 2. Changes to the main portfolio

- **Hero CTA**: "Explore My 3D Portfolio" (lavender accent, cube icon) with the line "Want to explore my work
  differently? Walk through it in a playable 3D world." It is a plain `<Link prefetch={false}>`: no 3D code or
  assets load on `/`.
- **Navbar**: "3D World" link (≥ 1024 px) and "Explore in 3D" in the mobile menu. At 768–1023 px the nav is
  already at its width limit, so the hero CTA is the entry point there.
- **Command bar**: `goto 3d` and `play` open `/3d`; `goto 3d` joins the rotating placeholder hints.
- **Shared content** (`src/content/`): profile/links/bio/stats/education, experience, projects, achievements,
  skills. Sections import from it (the hero, contact section and footer take their links from `profile.ts`), so
  the main site and the 3D world cannot drift apart. Apart from the CV updates in §1, the rendered output matches
  the original build except two normalized labels: "Back End" → "Back End Development" (two home cards, to match
  the `/projects` filters) and "Fast API" → "FastAPI".
- **Skills section**: logos come from Devicon; the new AI/ML brands Devicon lacks (LangChain, LangGraph, NVIDIA
  NeMo, n8n, Ultralytics YOLO, Hugging Face) use Simple Icons pinned to v16.30.0, inverted in dark mode.
- **Bundle impact on `/`**: +3.5 kB gzip of JavaScript (167.7 → 171.2 kB), mostly from chunk-boundary changes
  (content and icons are now shared with `/3d`). No three.js or 3D code is in any `/` chunk (verified by scanning
  the chunks and the network log). The engine (three.js, ~170 kB gzip) and scene (~65 kB gzip) chunks load only
  on `/3d`.

---

## 3. The playable experience

### World

**Inference Island** floats in the same `#0D1117` void as the main site, over a faint dot grid. The center plaza
(`~/home`) connects to six lobes by circuit-trace paths, like services around a gateway.

| District | Content | Landmarks |
| --- | --- | --- |
| `~/home` (Home Base) | About, career direction, education, coursework, TA / OKK / COMPFEST background, writing | Monolith with the real portrait, desk setup, bookcase (articles) |
| `lab/` (AI Research Lab) | GDP Labs: GLChat guardrail migration (16 categories, ~30% fewer false positives), SDK extensions, pipeline config service, 175-case evaluation set | Glass dome, satellite dishes, crystals, a "guardrail" shield you walk through, classifier console |
| `workshop/` (Engineering Workshop) | bitcorp. / TogetherApps: face recognition attendance, approvals, metrics | Conveyor line, robot arms, face-scan gate, approvals dashboard |
| `projects/` (Project Gallery) | 8 kiosks with real screenshots plus an index of all 11 projects (overview, CV highlights, stack, links) | Kiosk arc, hologram index table |
| `skills/` (Token Well) | All 28 skills by category, with collection status | Well, orbiting tokens, `ls skills/` terminal |
| `awards/` (Hall of Achievements) | Scholarship and competition awards | Obelisk, trophies with plaques |
| `contact/` (Signal Tower) | Resume, email, GitHub, LinkedIn, Medium, contact form link | Lattice tower, terminal, portal back to `/` |

Gameplay: visit 7 districts and collect 28 skill tokens (one per skill on the main site). Progress persists in
`localStorage` (`inference-island:v1`); reset it from the map or the menu. Two one-time flavor toasts (the
face-scan gate and the guardrail ring) illustrate the systems; they are labelled as illustrations, not
measurements.

### Controls

| Desktop | Touch |
| --- | --- |
| WASD / arrows move (camera-relative), Shift run, Space jump | Joystick (push further to run), Jump button |
| Drag to orbit, wheel to zoom, click ground or an object to walk there | Drag to orbit, pinch to zoom, tap ground to walk |
| E (or Enter) open nearby, M map, Esc close / menu | "Open" button on the prompt, Map and Menu buttons |

Movement keys are ignored while a panel or overlay is open (arrow keys scroll panels), and while focus is in a
text field. Space does not jump while a button or link has focus.

### Getting to content without playing

- **Browse without playing** on the entry screen opens a directory of every section as plain dialogs; the
  3D world never has to start.
- In game, **Map → Read** opens any section instantly (and moves the player there).
- Every panel links back to the main portfolio. The HUD always shows "← Main portfolio".

### Fallbacks

- No WebGL: detected before loading anything; the entry screen explains it and offers the directory. No models
  are downloaded.
- Load or render error: an error boundary shows Retry, Browse, and Back.
- GPU context lost: an overlay offers Reload or the main portfolio.
- Data Saver (`navigator.connection.saveData`): nothing downloads until the visitor chooses "Load 3D world".
- No JavaScript: a `<noscript>` message links to the main portfolio.
- `prefers-reduced-motion`: no camera fly-in, static attract view, no bobbing/spinning props, no dust, idle pose
  held. Teleports are instant.

---

## 4. Architecture

```
src/app/3d/page.tsx                      Route + metadata; renders <PlayablePortfolio/>
src/content/                             Shared content (main site + 3D)
  profile.ts experience.ts projects.ts achievements.ts skills.ts
  project-details.ts experience-details.ts   Long-form / 3D-only detail (kept out of the home bundle)
src/components/world/
  playable-portfolio.tsx                 Client root: environment detection, keyboard input, overlays, error boundary
  world-config.ts                        Layout data: districts, island shape, paths, interactables, colliders, tokens, triggers
  store.ts                               zustand UI state (phase, panel, overlay, progress, toasts) + persistence
  systems/runtime.ts                     Mutable per-frame state (player, camera, input), outside React
  systems/collision.ts                   Circle/box/edge collision for the player
  systems/webgl.ts                       WebGL support check
  scene/world-canvas.tsx                 <Canvas> (lazy chunk: three, R3F, drei), lights, perf monitor, loader
  scene/world.tsx                        Composes island, districts, scatter, tokens, player
  scene/island.tsx                       Procedural island, cliffs, plaza texture, path ribbons, click-to-walk
  scene/player.tsx                       Robot avatar, movement, jump, animation, proximity/district/trigger detection
  scene/camera-rig.tsx                   Attract orbit, fly-in, follow camera, drag/wheel/pinch
  scene/models.tsx                       GLB pack loading, material setup, cloning, instancing
  scene/scatter.ts                       Seeded vegetation layout and its colliders
  scene/tokens.tsx                       Skill tokens, interaction markers, click hitboxes
  scene/canvas-art.tsx                   Canvas-texture signboards and screens (uses the site's fonts)
  scene/environment.tsx                  Lights, dot-grid void, islets, dust
  scene/districts/*.tsx                  One component per district
  ui/                                    Entry screen, HUD, map/minimap, dialogs, panels, menus, touch controls
```

- **Code splitting**: `world-canvas.tsx` is the only module importing three.js; it loads through `next/dynamic`
  with `ssr: false`. The `/3d` route's first load is the UI shell (~132 kB); the engine chunk and models load
  after it, with progress shown on the Enter button.
- **State**: React state (zustand) holds only UI-level data. Player/camera/input live in `runtime` and are
  read in `useFrame`, so movement never re-renders React. The minimap writes its player marker straight to the
  DOM.
- **Collision**: a lightweight 2D solver (player circle vs. circles, oriented boxes, and the island's polar
  edge) instead of a physics engine; the island is flat, so this is sufficient and cheaper than Rapier.
- **Content**: panels render from `src/content`, so updating the main portfolio updates the island.

---

### Layout conventions

- Districts sit at radius 22 on six lobes; each has a `padRadius`, and its visit zone and decoration clearance
  derive from it (`zoneRadius`, `clearRadius` in `world-config.ts`).
- District props are placed in the district's local frame (+z faces the plaza) and kept mirror-symmetric where
  there are pairs (dishes, generators, crystals, machines, terminal/portal).
- Every entrance sign uses `signPlacement()`: left of the path, just inside the pad, angled toward arriving
  visitors, with a collider.
- Home plaza furniture occupies the six slots between path mouths and faces the center (`HOME_LAYOUT`).
- Skill tokens are evenly spaced along the open stretch of each path (plaza edge to pad edge); languages ring the
  plaza.
- Vegetation (`scatter.ts`, seeded): a pine treeline behind each district, single-species groves in the largest open
  areas with flower/bush fringes, a rock/shrub border along the cliff, and grass edging along paths (never on pads).
- `/3d?debug&view=top` renders the island straight from above on the entry screen for checking placement.

## 5. Assets and licenses

All third-party models are **CC0 1.0** (public domain). Manifests: `public/3d/models/manifest.json` (per-model
source, size, license, intended use) and `public/3d/textures/manifest.json` (texture sources and processing).

| Pack | Source | License | Size |
| --- | --- | --- | --- |
| `nature.glb` (32 models) | Kenney Nature Kit 2.0 | CC0 | 113 KiB |
| `tech.glb` (22) | Kenney Space Kit 2.0 | CC0 | 146 KiB |
| `factory.glb` (19) | Kenney Factory Kit 3.0 | CC0 | 110 KiB |
| `furniture.glb` (18) | Kenney Furniture Kit 1.0 | CC0 | 78 KiB |
| `robot.glb` (8 animations) | RobotExpressive by Tomás Laulhé (Quaternius), modified by Don McCurdy (three.js r170 examples) | CC0 | 209 KiB |
| `textures/projects/*.jpg`, `portrait.jpg` | Downsized copies of this repo's `public/assets` images | Owner's images | 448 KiB |

The packs are built by `scripts/build-world-assets.mjs` (instructions in its header): each model is re-pivoted
to its base center, unlit materials become lit PBR materials, and each kit is merged, deduplicated, welded and
meshopt-compressed. The meshopt decoder ships with three-stdlib (no CDN). Draco is not used.

---

## 6. Verification performed

Production build (`next build && next start`), headless Chrome 155 (ANGLE / Metal, Apple M2):

- **Functional suite: 66/66 checks pass.** It covers the CTA and nav entry, command bar route, back/forward
  navigation, LinkedIn links (all `/in/hilaldfzn`), the entry screen, onboarding, WASD / strafe / run, monolith
  collision, proximity prompt, E to open, focus management, input lock while panels are open, Esc, the map
  (7 districts, Go/Read, fast travel), the GDP Labs (16 categories, ~30%, 175 cases) and bitcorp. metrics, the
  project index (11) and details, live-demo and screenshot loading, Previous/Next, contact links, resume PDF
  served, skills (28), awards, collecting tokens by walking a path, the pause menu and credits, click-to-walk,
  drag orbit, progress persistence across reload, the HUD back link, browse mode, the no-WebGL fallback (and no
  model downloads), reduced motion, mobile joystick movement, the bottom sheet, no horizontal overflow, and zero
  console or network errors across all runs.
- **Accessibility (axe-core 4.10, WCAG 2.1 A/AA + best practice): 0 violations** on the main hero, the 3D entry
  screen, the in-game HUD, the map, a panel, and the pause menu.
- **TypeScript**: 0 errors with both the project's TypeScript 5.8.3 and TypeScript 6.0.3 (the version VS Code
  bundles).
- **Performance**: steady 60 fps while running around, ~130–145 draw calls, ~33K triangles, 27 MB JS heap.
  Cold load of `/3d` transferred about 1.18 MB in total (JS ~457 KiB gzip, models ~287 KiB, images ~337 KiB); the
  world was ready ~0.6 s after navigation on localhost. Use `/3d?debug` to read live stats from
  `window.__islandPerf`.
- Main site: rendered text, links and images were diffed before and after (see §2). Zero console errors.

Not verified: real iOS/Android devices and Safari/Firefox (testing used Chrome with touch emulation); low-end
GPUs; real network throttling; the deployed Vercel URL.

---

## 7. Development, build, deployment

```bash
npm install
npm run dev          # http://localhost:3000 and http://localhost:3000/3d
npm run build        # production build (/3d is statically prerendered)
npm start
```

Deployment needs nothing new: `/3d` is a static route and all assets are in `public/3d/`, so a normal Vercel
deploy publishes it. Optional: `npx tsc --noEmit` for type checking.

Common edits:

- Content: change `src/content/*`; both experiences update.
- Layout: positions, colliders, tokens and triggers are in `world-config.ts` (district-local coordinates; +z faces
  the island center).
- New models: add the file name to a pack in `scripts/build-world-assets.mjs`, rebuild the packs, then use
  `<Model pack="…" name="…" />`.

---

## 8. Known limitations and ideas

- Lint is not runnable with the current ESLint setup (pre-existing; see §1). New code was linted separately with
  `next/core-web-vitals` and is clean.
- The camera does not avoid obstacles; trees are kept away from paths to limit occlusion.
- Keyboard users cannot rotate the camera (movement is camera-relative, so all directions remain reachable).
- No audio by design (no autoplay). An opt-in ambient track would be a natural next step.
- Panel content renders client-side (only the entry screen is server-rendered), so the main portfolio remains the SEO surface.
