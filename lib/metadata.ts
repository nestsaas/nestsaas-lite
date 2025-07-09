
import { siteConfig } from "@/config/site"

import { constructMetadata } from "./utils"

export function generateGeneralMetadata(params?: { canonical?: string }) {
  const baseMetadata = constructMetadata({
    title: siteConfig.title,
    description: siteConfig.description,
  })

  return {
    ...baseMetadata,
    alternates: {
      ...(params?.canonical ? { canonical: params.canonical } : {}),
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url: params?.canonical || `${siteConfig.url}`,
    } as any,
  }
}
