"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Check, List } from "lucide-react"
import { Drawer } from "vaul"

import { BLOG_CATEGORIES } from "@/config/blog"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

export function BlogHeaderLayout() {
  const [open, setOpen] = useState(false)
  const { slug } = useParams() as { slug?: string }
  const data = BLOG_CATEGORIES.find((category) => category.slug === slug)

  const closeDrawer = () => {
    setOpen(false)
  }

  return (
    <>
      <MaxWidthWrapper className="py-6 md:pt-10 md:pb-8">
        <div className="max-w-screen-sm">
          <h1 className="font-heading text-3xl md:text-4xl">
            {data?.title || "Blog"}
          </h1>
          <p className="text-muted-foreground mt-3.5 text-base md:text-lg">
            {data?.description ||
              `Latest news and updates from ${siteConfig.name}.`}
          </p>
        </div>

        <nav className="mt-8 hidden w-full md:flex">
          <ul
            role="list"
            className="text-muted-foreground flex w-full flex-1 gap-x-2 border-b text-[15px]"
          >
            <CategoryLink title="All" href="/blog" active={!slug} />
            {BLOG_CATEGORIES.map((category) => (
              <CategoryLink
                key={category.slug}
                title={category.title}
                href={`/blog/category/${category.slug}`}
                active={category.slug === slug}
              />
            ))}
            {/* <CategoryLink title="Guides" href="/guides" active={false} /> */}
          </ul>
        </nav>
      </MaxWidthWrapper>

      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="text-foreground/90 mb-8 flex w-full items-center border-y p-3 md:hidden"
        >
          <List className="size-[18px]" />
          <p className="ml-2.5 text-sm font-medium">Categories</p>
        </Drawer.Trigger>
        <Drawer.Overlay
          className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm"
          onClick={closeDrawer}
        />
        <Drawer.Portal>
          <Drawer.Content className="bg-background fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="bg-muted-foreground/20 my-3 h-1.5 w-16 rounded-full" />
            </div>
            <ul role="list" className="text-muted-foreground mb-14 w-full p-3">
              <CategoryLink
                title="All"
                href="/blog"
                active={!slug}
                clickAction={closeDrawer}
                mobile
              />
              {BLOG_CATEGORIES.map((category) => (
                <CategoryLink
                  key={category.slug}
                  title={category.title}
                  href={`/blog/category/${category.slug}`}
                  active={category.slug === slug}
                  clickAction={closeDrawer}
                  mobile
                />
              ))}
              <CategoryLink
                title="Guides"
                href="/guides"
                active={false}
                mobile
              />
            </ul>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}

const CategoryLink = ({
  title,
  href,
  active,
  mobile = false,
  clickAction,
}: {
  title: string
  href: string
  active: boolean
  mobile?: boolean
  clickAction?: () => void
}) => {
  return (
    <Link href={href} onClick={clickAction}>
      {mobile ? (
        <li className="text-foreground hover:bg-muted rounded-lg">
          <div className="flex items-center justify-between px-3 py-2 text-sm">
            <span>{title}</span>
            {active && <Check className="size-4" />}
          </div>
        </li>
      ) : (
        <li
          className={cn(
            "text-muted-foreground hover:text-foreground -mb-px border-b-2 border-transparent font-medium",
            {
              "text-foreground border-purple-600 dark:border-purple-400/80":
                active,
            }
          )}
        >
          <div className="px-3 pb-3">{title}</div>
        </li>
      )}
    </Link>
  )
}
