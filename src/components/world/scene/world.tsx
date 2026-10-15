"use client"

import { useEffect, useMemo } from "react"
import { buildStaticColliders } from "../world-config"
import { useWorldStore } from "../store"
import { Island } from "./island"
import { InstancedModel } from "./models"
import { buildScatter } from "./scatter"
import { Player } from "./player"
import { InteractionHitboxes, InteractionMarkers, SkillTokens } from "./tokens"
import { HomeDistrict } from "./districts/home"
import { LabDistrict } from "./districts/lab"
import { WorkshopDistrict } from "./districts/workshop"
import { GalleryDistrict } from "./districts/gallery"
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
        <InstancedModel key={group.name} pack={group.pack} name={group.name} transforms={group.transforms} />
      ))}
      <HomeDistrict />
      <LabDistrict animate={animate} />
      <WorkshopDistrict animate={animate} />
      <GalleryDistrict animate={animate} />
      <SkillsDistrict animate={animate} />
      <AwardsDistrict animate={animate} />
      <ContactDistrict animate={animate} />
      <SkillTokens animate={animate} />
      <InteractionMarkers animate={animate} />
      <InteractionHitboxes />
      <Player colliders={colliders} />
    </group>
  )
}
