import { MetadataRoute } from "next"
import { allPosts, allDocs } from "content-collections"

import {
  generateDocsSitemapUrls,
  generatePostsSitemapUrls,
  generateStaticPagesSitemapUrls,
} from "@/lib/sitemap-utils"


/**
 * Generate sitemap for the application
 * This is automatically picked up by Next.js and served at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generate sitemap entries for each type of content
  const staticUrls = await generateStaticPagesSitemapUrls()
  const docsUrls = await generateDocsSitemapUrls(allDocs)
  const postsUrls = await generatePostsSitemapUrls(allPosts)

  // Combine all URLs into a single sitemap
  return [
    ...staticUrls,
    ...docsUrls,
    ...postsUrls,
  ]
}