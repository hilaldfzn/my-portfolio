"use client"

import { useEffect, useMemo } from "react"
import { buildStaticColliders } from "../world-config"
import { useWorldStore } from "../store"
import { Island } from "./island"
import { InstancedModel } from "./models"
import { buildScatter } from "./scatter"
import { Player } from "./player"
import { InteractionHitboxes, InteractionMarkers, SkillTokens } from "./tokens"
import { Asteroids } from "./environment"
import { AstroOrbiter, Guests, LampPosts, LaunchPad, MainStreet, Monorail, OrbitalWheel, ParkBenches, ParkGate } from "./park"
import { HomeDistrict } from "./districts/home"
import { GdpLabsDistrict } from "./districts/gdp-labs"
import { BitcorpDistrict } from "./districts/bitcorp"
import { CampusDistrict } from "./districts/campus"
import { HangarDistrict } from "./districts/hangar"
import { LibraryDistrict } from "./districts/library"
import { AwardsDistrict, ContactDistrict, SkillsDistrict } from "./districts/landmarks"

export function World({ animate }: { animate: boolean }) {
  const { scatter, colliders: scatterColliders } = useMemo(buildScatter, [])
  const colliders = useMemo(() => [...buildStaticColliders(), ...scatterColliders], [scatterColliders])

  // Runs once every model and texture inside the Suspense boundary has loaded.
  useEffect(() => {
    useWorldStore.getState().setLoadProgress(100)
    useWorldStore.getState().setEngine("ready")
  }, [])

  return (
    <group>
      <Island />
      {scatter.map((group) => (
        <InstancedModel
          key={group.name}
          pack={group.pack}
          name={group.name}
          transforms={group.transforms}
          castShadow={group.name.startsWith("tree") || group.name.startsWith("rock_large")}
        />
      ))}

      {/* Park attractions */}
      <ParkGate animate={animate} />
      <MainStreet />
      <LaunchPad animate={animate} />
      <OrbitalWheel animate={animate} />
      <AstroOrbiter animate={animate} />
      <Monorail animate={animate} />
      <LampPosts />
      <ParkBenches />
      <Guests />
      <Asteroids animate={animate} />

      {/* Lands */}
      <HomeDistrict animate={animate} />
      <GdpLabsDistrict animate={animate} />
      <BitcorpDistrict animate={animate} />
      <CampusDistrict animate={animate} />
      <HangarDistrict animate={animate} />
      <SkillsDistrict animate={animate} />
      <LibraryDistrict animate={animate} />
      <AwardsDistrict animate={animate} />
      <ContactDistrict animate={animate} />

      <SkillTokens animate={animate} />
      <InteractionMarkers animate={animate} />
      <InteractionHitboxes />
      <Player colliders={colliders} />
    </group>
  )
}
