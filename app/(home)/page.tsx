// import HomePage from "./home2/page-contentlist"

import { siteConfig } from "@/config/site"
import { generateGeneralMetadata } from "@/lib/metadata"

import HomePage from "./home1/page-landing"

// Generate metadata
export async function generateMetadata() {
  return generateGeneralMetadata({
    canonical: `${siteConfig.url}`,
  })
}

export default HomePage
