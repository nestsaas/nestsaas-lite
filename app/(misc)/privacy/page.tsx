import { Metadata } from "next"
import { notFound } from "next/navigation"
import { allPages } from "content-collections"

import { siteConfig } from "@/config/site"
import { constructMetadata, getBlurDataURL } from "@/lib/utils"
import { Mdx } from "@/components/content/mdx-components"

export async function generateStaticParams() {
  return [
    {
      slug: "privacy",
    },
  ]
}

export async function generateMetadata(): Promise<Metadata | undefined> {
  const slug = "privacy"
  const page = allPages.find((page) => page._meta.path === slug)
  if (!page) {
    return
  }

  const { title, description } = page

  return constructMetadata({
    title: `${title} – ${siteConfig.name}`,
    description: description,
  })
}

export default async function PagePage() {
  const slug = "privacy"
  const page = allPages.find((page) => page._meta.path === slug)

  if (!page) {
    notFound()
  }

  const images = await Promise.all(
    page.images.map(async (src: string) => ({
      src,
      blurDataURL: await getBlurDataURL(src),
    }))
  )

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="font-heading inline-block text-4xl lg:text-5xl">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-muted-foreground text-xl">{page.description}</p>
        )}
      </div>
      <hr className="my-4" />
      <Mdx content={page.mdx} images={images} />
    </article>
  )
}