import { allPosts } from "content-collections"

import { siteConfig } from "@/config/site"
import { constructMetadata, getBlurDataURL } from "@/lib/utils"

import { BlogPosts } from "@/components/content/blog-posts"

export const metadata = constructMetadata({
  title: "Blog",
  description: `Latest news and updates from ${siteConfig.name}.`,
})

export default async function BlogPage() {
  const posts = await Promise.all(
    allPosts
      .filter((post) => post.published)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image ?? null),
      }))
  )

  return <BlogPosts posts={posts} />
}
