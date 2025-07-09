import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import GithubSlugger from "github-slugger"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode, { type Options } from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import { createHighlighter } from "shiki"

const prettyCodeOptions: Options = {
  theme: "github-dark",
  keepBackground: false,
  getHighlighter: (options) =>
    createHighlighter({
      ...options,
    }),
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }]
    }
  },
  onVisitHighlightedLine(node) {
    if (!node.properties.className) {
      node.properties.className = []
    }
    node.properties.className.push("line--highlighted")
  },
  onVisitHighlightedChars(node) {
    if (!node.properties.className) {
      node.properties.className = []
    }
    node.properties.className = ["word--highlighted"]
  },
}

const computedFields = (type: "blog" | "changelog" | "docs" | "page") => ({
  slug: (document: any) => {
    const slugger = new GithubSlugger()
    const fileslug =
      document._meta?.path || document.slug || slugger.slug(document.title)
    return `/${type}/${fileslug}`
  },
  images: (document: any) => {
    if (!document.body?.raw) return []
    return (
      document.body.raw.match(/(?<=<Image[^>]*\bsrc=")[^"]+(?="[^>]*\/>)/g) ||
      []
    )
  },
  tweetIds: (document: any) => {
    if (!document.body?.raw) return []
    const tweetMatches = document.body.raw.match(/<Tweet\sid="[0-9]+"\s\/>/g)
    return tweetMatches?.map((tweet: any) => tweet.match(/[0-9]+/g)[0]) || []
  },
  githubRepos: (document: any) => {
    if (!document.body?.raw) return []
    return (
      document.body.raw.match(
        /(?<=<GithubRepo[^>]*\burl=")[^"]+(?="[^>]*\/>)/g
      ) || []
    )
  },
})

const authors = defineCollection({
  name: "authors",
  directory: "content/authors",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    avatar: z.string(),
    twitter: z.string(),
  }),
})

const docs = defineCollection({
  name: "docs",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    published: z.boolean().default(true),
    image: z.string().optional(),
    date: z.string().optional(),
    authors: z.array(z.string()).optional(),
  }),
  transform: async (document, context) => {
    const headings: { level: number; text: string; id: string }[] = []

    const mdx = await compileMDX(context, document, {
      rehypePlugins: [
        rehypeSlug,
        [rehypePrettyCode, prettyCodeOptions],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["subheading-anchor"],
              ariaLabel: "Link to section",
            },
          },
        ],
        () => (tree) => {
          function visit(node: any) {
            if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
              const text = node.children
                .filter((child: any) => child.type === "text")
                .map((child: any) => child.value)
                .join("")
              const level = parseInt(node.tagName.replace("h", ""), 10)
              const id = text.toLowerCase().replace(/\s+/g, "-")
              headings.push({ level, text, id })
              node.properties.id = id
            }
            if (node.children) node.children.forEach(visit)
          }
          visit(tree)
        },
      ],
    })

    const computed = computedFields("docs")

    return {
      ...document,
      toc: headings,
      mdx,
      images: computed.images({ ...document, body: { raw: mdx } }),
      // tweetIds: computed.tweetIds({ ...document, body: { raw: mdx } }),
      // githubRepos: computed.githubRepos({
      //   ...document,
      //   body: { raw: mdx },
      // }),
    }
  },
})

const pages = defineCollection({
  name: "pages",
  directory: "content/pages",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      rehypePlugins: [
        rehypeSlug,
        [rehypePrettyCode, prettyCodeOptions],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["subheading-anchor"],
              ariaLabel: "Link to section",
            },
          },
        ],
      ],
    })
    const computed = computedFields("page")
    return {
      ...document,
      mdx,
      images: computed.images({ ...document, body: { raw: mdx } }),
    }
  },
})

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    authors: z.array(z.string()),
    description: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    published: z.boolean().default(true),
    categories: z.array(z.enum(["design", "news"])).default(["news"]),
    featured: z.boolean().default(false).optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    related: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    githubRepos: z.array(z.string()).optional(),
    tweetIds: z.array(z.string()).optional(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const headings: { level: number; text: string; id: string }[] = []
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, prettyCodeOptions],
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ["subheading-anchor"],
                ariaLabel: "Link to section",
              },
            },
          ],
          () => (tree) => {
            function visit(node: any) {
              if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
                const text = node.children
                  .filter((child: any) => child.type === "text")
                  .map((child: any) => child.value)
                  .join("")
                const level = parseInt(node.tagName.replace("h", ""), 10)
                const id = text.toLowerCase().replace(/\s+/g, "-")
                headings.push({ level, text, id })
                node.properties.id = id
              }
              if (node.children) node.children.forEach(visit)
            }
            visit(tree)
          },
        ],
        remarkPlugins: [remarkGfm],
      })
      const computed = computedFields("blog")
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        related: document.related || [],
        toc: headings,
        images: computed.images({ ...document, body: { raw: mdx } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx },
        }),
      }
    } catch (error: any) {
      console.error("Error compiling MDX for:", document.title, error)
      console.error("Error details:", error.stack)
      throw error
    }
  },
})

export default defineConfig({
  collections: [docs, authors, pages, posts],
})
