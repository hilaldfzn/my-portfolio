// Builds the optimized GLB packs used by the playable 3D portfolio (/3d).
//
// Source assets are NOT committed. Download them first (all CC0):
//   Kenney Space Kit      https://kenney.nl/assets/space-kit
//   Kenney Furniture Kit  https://kenney.nl/assets/furniture-kit
//   Kenney Nature Kit     https://kenney.nl/assets/nature-kit
//   Kenney Factory Kit    https://kenney.nl/assets/factory-kit
//   Kenney Food Kit       https://kenney.nl/assets/food-kit
//   RobotExpressive       https://github.com/mrdoob/three.js/tree/r170/examples/models/gltf/RobotExpressive
// and unzip each kit into <src>/<kit-name>/ (keeping the "Models/..." folders).
//
// The script needs glTF-Transform, which is intentionally not a project dependency:
//   mkdir /tmp/gt && cd /tmp/gt && npm init -y && npm pkg set type=module &&
//   npm i @gltf-transform/core@4.1.1 @gltf-transform/functions@4.1.1 @gltf-transform/extensions@4.1.1 meshoptimizer@0.22.0
//   cp <repo>/scripts/build-world-assets.mjs /tmp/gt/ &&
//   node /tmp/gt/build-world-assets.mjs --src <kits dir> --robot <RobotExpressive.glb> --out <repo>/public/3d/models
//
// Output: one GLB per pack. Every model becomes a top-level node named after its source
// file, re-pivoted to its base center (x/z centered, y = 0 at the bottom), so the runtime
// can clone models by name. Unlit materials are converted to lit PBR materials.

import { NodeIO, Document, getBounds } from "@gltf-transform/core"
import { ALL_EXTENSIONS } from "@gltf-transform/extensions"
import { dedup, prune, weld, meshopt, mergeDocuments, unpartition, resample } from "@gltf-transform/functions"
import { MeshoptEncoder } from "meshoptimizer"
import fs from "node:fs"
import path from "node:path"

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, all) => {
    if (value.startsWith("--")) pairs.push([value.slice(2), all[index + 1]])
    return pairs
  }, []),
)
if (!args.src || !args.robot || !args.out) {
  console.error("usage: node build-world-assets.mjs --src <kits dir> --robot <RobotExpressive.glb> --out <dir>")
  process.exit(1)
}

const KENNEY_LICENSE = { license: "CC0-1.0", author: "Kenney (www.kenney.nl)" }

const PACKS = {
  nature: {
    kit: "nature-kit",
    title: "Kenney Nature Kit (2.0)",
    sourceUrl: "https://kenney.nl/assets/nature-kit",
    dir: "Models/GLTF format",
    ext: ".glb",
    use: "Island flora (recolored as alien plants), lunar rocks, campus columns and the awards obelisk",
    models: [
      "tree_default", "tree_oak", "tree_pineRoundA", "tree_pineTallA", "tree_cone", "tree_plateau",
      "tree_fat", "tree_default_fall", "tree_oak_fall", "tree_cone_fall", "rock_largeA", "rock_largeB",
      "rock_smallC", "grass", "grass_large", "flower_purpleA", "flower_yellowA", "flower_redA",
      "plant_bush", "plant_bushLarge", "statue_obelisk", "statue_column",
    ],
  },
  tech: {
    kit: "space-kit",
    title: "Kenney Space Kit (2.0)",
    sourceUrl: "https://kenney.nl/assets/space-kit",
    dir: "Models/GLTF format",
    ext: ".glb",
    use: "Space park: lab dome, dishes, crystals, rocket, monorail train, astronaut guests, craters, spacecraft",
    models: [
      "hangar_roundGlass", "satelliteDish_large", "machine_wireless", "machine_generatorLarge",
      "rock_crystalsLargeA", "rock_crystals", "gate_complex", "craft_speederA", "rocket_baseA",
      "rocket_fuelA", "rocket_sidesA", "rocket_topA", "monorail_trainFront", "monorail_trainPassenger",
      "monorail_trainEnd", "astronautA", "astronautB", "alien", "crater", "craterLarge", "meteor",
      "craft_racer",
    ],
  },
  factory: {
    kit: "factory-kit",
    title: "Kenney Factory Kit (3.0)",
    sourceUrl: "https://kenney.nl/assets/factory-kit",
    dir: "Models/GLB format",
    ext: ".glb",
    use: "bitcorp. assembly bay: conveyors, robot arms, face-scan gate, screens, crates",
    models: [
      "robot-arm-a", "robot-arm-b", "scanner-high", "conveyor-long", "box-small", "box-large",
      "box-wide", "machine", "machine-window", "screen-panel-wide", "cog-a", "hopper-round",
      "warning-traffic",
    ],
  },
  furniture: {
    kit: "furniture-kit",
    title: "Kenney Furniture Kit (1.0)",
    sourceUrl: "https://kenney.nl/assets/furniture-kit",
    dir: "Models/GLTF format",
    ext: ".glb",
    use: "Library writing desks, campus classroom, plaza planters, library topic props",
    models: [
      "desk", "laptop", "computerScreen", "chairDesk", "chair", "pottedPlant", "plantSmall1",
    ],
  },
  food: {
    kit: "food-kit",
    title: "Kenney Food Kit (2.0)",
    sourceUrl: "https://kenney.nl/assets/food-kit",
    dir: "Models/GLB format",
    ext: ".glb",
    use: "Main Street snack stalls: the food on each counter and the giant roof signs",
    models: [
      "donut-sprinkles", "donut-chocolate", "donut", "cup-coffee",
      "burger-cheese", "burger", "fries", "hot-dog", "soda-can",
      "ice-cream", "ice-cream-cup", "sundae", "popsicle",
      "soda", "frappe", "cocktail",
      "cupcake", "muffin", "cookie-chocolate", "lollypop",
    ],
  },
}

const ROBOT_ANIMATIONS = new Set(["Idle", "Walking", "Running", "Jump", "Wave", "ThumbsUp", "Dance", "Yes"])

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.encoder": MeshoptEncoder })
await MeshoptEncoder.ready

function normalizeMaterials(doc) {
  for (const ext of doc.getRoot().listExtensionsUsed()) {
    if (ext.extensionName === "KHR_materials_unlit") ext.dispose()
  }
  for (const material of doc.getRoot().listMaterials()) {
    const name = (material.getName() || "").toLowerCase()
    const metal = name.includes("metal")
    material.setMetallicFactor(metal ? 0.25 : 0)
    material.setRoughnessFactor(metal ? 0.55 : 0.85)
  }
}

async function buildPack(name, pack) {
  const target = new Document()
  target.createBuffer()
  const scene = target.createScene(name)
  const entries = []
  for (const model of pack.models) {
    const file = path.join(args.src, pack.kit, pack.dir, model + pack.ext)
    const doc = await io.read(file)
    normalizeMaterials(doc)
    const sourceScene = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0]
    const { min, max } = getBounds(sourceScene)
    const size = max.map((value, i) => +(value - min[i]).toFixed(3))
    const offset = [-(min[0] + max[0]) / 2, -min[1], -(min[2] + max[2]) / 2]

    const map = mergeDocuments(target, doc)
    const mergedScene = map.get(sourceScene)
    const root = target.createNode(model).setTranslation(offset)
    const wrapper = target.createNode(model + "_root").addChild(root)
    for (const child of mergedScene.listChildren()) root.addChild(child)
    mergedScene.dispose()
    scene.addChild(wrapper)
    entries.push({ name: model, file: path.join(pack.dir, model + pack.ext), size })
  }
  await target.transform(unpartition(), dedup(), prune(), weld(), meshopt({ encoder: MeshoptEncoder, level: "medium" }))
  const outFile = path.join(args.out, name + ".glb")
  await io.write(outFile, target)
  return { entries, bytes: fs.statSync(outFile).size }
}

async function buildRobot() {
  const doc = await io.read(args.robot)
  for (const animation of doc.getRoot().listAnimations()) {
    if (!ROBOT_ANIMATIONS.has(animation.getName())) animation.dispose()
  }
  await doc.transform(resample(), dedup(), prune(), meshopt({ encoder: MeshoptEncoder, level: "medium" }))
  const outFile = path.join(args.out, "robot.glb")
  await io.write(outFile, doc)
  const { min, max } = getBounds(doc.getRoot().listScenes()[0])
  return {
    bytes: fs.statSync(outFile).size,
    animations: doc.getRoot().listAnimations().map((a) => a.getName()),
    size: max.map((value, i) => +(value - min[i]).toFixed(3)),
  }
}

fs.mkdirSync(args.out, { recursive: true })
const manifest = {
  generatedBy: "scripts/build-world-assets.mjs",
  note: "All models are CC0 1.0 (public domain). Credit is appreciated but not required.",
  packs: {},
}
for (const [name, pack] of Object.entries(PACKS)) {
  const { entries, bytes } = await buildPack(name, pack)
  manifest.packs[name] = {
    file: `/3d/models/${name}.glb`,
    bytes,
    source: pack.title,
    sourceUrl: pack.sourceUrl,
    ...KENNEY_LICENSE,
    intendedUse: pack.use,
    models: entries,
  }
  console.log(`${name}.glb`, (bytes / 1024).toFixed(1), "KiB", entries.length, "models")
}
const robot = await buildRobot()
manifest.packs.robot = {
  file: "/3d/models/robot.glb",
  bytes: robot.bytes,
  source: "RobotExpressive (three.js examples, r170)",
  sourceUrl: "https://github.com/mrdoob/three.js/tree/r170/examples/models/gltf/RobotExpressive",
  license: "CC0-1.0",
  author: "Tomás Laulhé (Quaternius); modifications by Don McCurdy",
  intendedUse: "Player avatar (guest agent)",
  animations: robot.animations,
  size: robot.size,
}
console.log("robot.glb", (robot.bytes / 1024).toFixed(1), "KiB", robot.animations.join(","))
fs.writeFileSync(path.join(args.out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n")
