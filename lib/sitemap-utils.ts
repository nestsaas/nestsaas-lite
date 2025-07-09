
import { siteConfig } from "@/config/site"

export const MAX_URLS_PER_SITEMAP = 1000

/**
 * Generate a sitemap URL entry
 */
export function generateSitemapUrl({
  url,
  lastModified,
  changeFrequency = "weekly",
  priority = 0.5,
}: {
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never"
  priority?: number
}) {
  return {
    url,
    lastModified: lastModified
      ? new Date(lastModified).toISOString()
      : undefined,
    changeFrequency,
    priority,
  }
}

/**
 * Generate sitemap URLs for static pages
 */
export function generateStaticPagesSitemapUrls() {
  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "pricing", priority: 0.9 },
    { url: "blog", priority: 0.8 },
    { url: "docs", priority: 0.8 },
    { url: "about", priority: 0.8 },
    { url: "privacy", priority: 0.3 },
    { url: "terms", priority: 0.3 },
  ]

  return staticPages.map((page) =>
    generateSitemapUrl({
      url: page.url ? `${siteConfig.url}/${page.url}` : siteConfig.url,
      priority: page.priority,
      changeFrequency: "monthly",
    })
  )
}

// fumadocs sitemap generation
export function generateDocsSitemapUrls(docs: any[]) {
  return docs.map((doc) => {
    let docPath = doc._meta.path
    // Remove '/index' from the end of the path if it exists
    if (docPath.endsWith("/index")) {
      docPath = docPath.substring(0, docPath.length - 6)
    }
    return generateSitemapUrl({
      url: `${siteConfig.url}/docs/${docPath}`,
      lastModified: doc._meta.date,
      priority: 0.7,
    })
  })
}

export function generatePostsSitemapUrls(posts: any[]) {
  return posts.map((post) =>
    generateSitemapUrl({
      url: `${siteConfig.url}/blog/${post._meta.path}`,
      lastModified: post._meta.date,
      priority: 0.7,
    })
  )
}
