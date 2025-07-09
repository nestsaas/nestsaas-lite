import { siteConfig } from "./site"

export const BLOG_CATEGORIES: {
  title: string
  slug: "news" | "design"
  description: string
}[] = [
  {
    title: "News",
    slug: "news",
    description: `Updates and announcements from ${siteConfig.name}.`,
  },
  {
    title: "Design & Tech",
    slug: "design",
    description: `Design and Tech content about ${siteConfig.name}.`,
  },
]

export const BLOG_AUTHORS = {
  ShawnHacks: {
    name: "ShawnHacks",
    image: "/avatars/shawnhacks.jpg",
    twitter: "ShawnHacks",
  },
}
