// import "@/assets/styles/mdx.css"

import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allPosts } from "content-collections"

import { BLOG_CATEGORIES } from "@/config/blog"
import { siteConfig } from "@/config/site"
import {
  cn,
  constructMetadata,
  formatDate,
  getBlurDataURL,
  placeholderBlurhash,
} from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import BlurImage from "@/components/shared/blur-image"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

import Author from "@/components/content/author"
import { Mdx } from "@/components/content/mdx-components"
import TableOfContents from "@/components/content/table-of-contents"

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post._meta.path,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  const paramsData = await params
  const post = allPosts.find((post) => post._meta.path === paramsData.slug)
  if (!post) {
    return
  }

  const { title, description, image } = post

  let ogImage = image
  if (!ogImage) {
    ogImage = `${siteConfig.url}/blog/${paramsData.slug}/og`
  }

  return constructMetadata({
    title: `${title}`,
    description: description,
    image,
  })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const paramsData = await params
  const post = allPosts.find((post) => post._meta.path === paramsData.slug)

  if (!post) {
    notFound()
  }

  const ogImage = `${siteConfig.url}/blog/${paramsData.slug}/og`

  const category = BLOG_CATEGORIES.find(
    (category) => category.slug === post.categories[0]
  )!

  const relatedArticles =
    (post.related &&
      post.related.map(
        (slug) => allPosts.find((post) => post._meta.path === slug)!
      )) ||
    []

  const [thumbnailBlurhash, images] = await Promise.all([
    getBlurDataURL(post.image ?? null),
    await Promise.all(
      post.images.map(async (src: string) => ({
        src,
        blurDataURL: await getBlurDataURL(src),
      }))
    ),
  ])

  return (
    <>
      <MaxWidthWrapper className="pt-6 md:pt-10">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Link
              href={`/blog/category/${category.slug}`}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                }),
                "h-8 rounded-lg"
              )}
            >
              {category.title}
            </Link>
            <time
              dateTime={post.date}
              className="text-muted-foreground text-sm font-medium"
            >
              {formatDate(post.date)}
            </time>
          </div>
          <h1 className="font-heading text-foreground text-3xl sm:text-4xl">
            {post.title}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            {post.description}
          </p>
          <div className="flex flex-nowrap items-center space-x-5 pt-1 md:space-x-8">
            {post.authors.map((author) => (
              <Author username={author} key={post.slug + author} />
            ))}
          </div>
        </div>
      </MaxWidthWrapper>

      <div className="relative">
        {/* <div className="absolute top-52 w-full border-t" /> */}

        <MaxWidthWrapper className="grid grid-cols-4 gap-10 pt-8 max-md:px-0">
          {/* md:border border-y */}
          <div className="bg-background relative col-span-4 mb-10 flex flex-col items-center space-y-8 md:rounded-xl lg:col-span-3">
            <BlurImage
              alt={post.title}
              blurDataURL={thumbnailBlurhash ?? placeholderBlurhash}
              className="border-b object-cover"
              width={1200}
              height={600}
              priority
              placeholder="blur"
              src={post.image ?? ogImage}
              sizes="(max-width: 768px) 770px, 1000px"
            />
            <div className="px-[.8rem] pb-10 md:px-8">
              <Mdx content={post.mdx} images={images} />
            </div>
          </div>
          <div className="divide-muted sticky top-20 col-span-1 hidden flex-col divide-y self-start pb-24 lg:flex">
            <TableOfContents toc={post.toc} />
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        {relatedArticles.length > 0 && (
          <div className="flex flex-col space-y-4 pb-16">
            <p className="font-heading text-foreground text-2xl">
              More Articles
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-6">
              {relatedArticles.map((post) => (
                <Link
                  key={post.slug}
                  href={post.slug}
                  className="hover:bg-muted/80 flex flex-col space-y-2 rounded-xl border p-5 transition-colors duration-300"
                >
                  <h3 className="font-heading text-foreground text-xl">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-[15px]">
                    {post.description}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(post.date)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </>
  )
}
