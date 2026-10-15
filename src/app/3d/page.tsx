import type { Metadata } from "next"
import Link from "next/link"
import { PlayablePortfolio } from "../../components/world/playable-portfolio"

export const metadata: Metadata = {
  title: "Orbit Park · Playable 3D Portfolio | Muhammad Hilal Darul Fauzan",
  description:
    "Explore Muhammad Hilal Darul Fauzan's work as a playable space theme park: internships at GDP Labs and bitcorp., Universitas Indonesia, a project hangar, a tech stack, an article library, honors, and contact.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hilaldfzn.vercel.app/3d",
    title: "Orbit Park · Playable 3D Portfolio",
    description: "A playable 3D portfolio by Muhammad Hilal Darul Fauzan, AI Engineer and backend-focused software engineer.",
    siteName: "Portfolio | Muhammad Hilal Darul Fauzan",
  },
}

export default function PlayablePortfolioPage() {
  return (
    <>
      <PlayablePortfolio />
      <noscript>
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#0D1117", color: "#E6EDF3", padding: 32, fontFamily: "monospace" }}>
          <p>The playable 3D portfolio needs JavaScript.</p>
          <p>
            <Link href="/" style={{ color: "#F78166" }}>
              Open the main portfolio
            </Link>
          </p>
        </div>
      </noscript>
    </>
  )
}
