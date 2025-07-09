import Link from "next/link"
import { Doc } from "content-collections"

import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DocsPagerProps {
  doc: Doc
}

export function DocsPager({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc)

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev && (
        <Link
          href={pager.prev.href}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ChevronLeft className="mr-2 size-4" />
          {pager.prev.title}
        </Link>
      )}
      {pager?.next && (
        <Link
          href={pager.next.href}
          className={cn(buttonVariants({ variant: "outline" }), "ml-auto")}
        >
          {pager.next.title}
          <ChevronRight className="ml-2 size-4" />
        </Link>
      )}
    </div>
  )
}

export function getPagerForDoc(doc: Doc) {
  const flattenedLinks = [null, ...flatten(docsConfig.sidebarNav), null]
  
  const activeIndex = flattenedLinks.findIndex(
    (link) => {
      const href = link?.href?.split("/").slice(2).join("/")
      if (doc._meta.path === "index" && href === "") {
        return true
      }
      return `${doc._meta.path}` === href
    }
  )
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null
  return {
    prev,
    next,
  }
}

export function flatten(links: { children?: { title: string; href: string }[] }[]): any {
  return links.reduce((flat: any, link: any) => {
    return flat.concat(link.children ? flatten(link.children) : link)
  }, [])
}