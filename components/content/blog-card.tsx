import Link from "next/link"
import { Post } from "content-collections"

import { cn, formatDate, placeholderBlurhash } from "@/lib/utils"
import BlurImage from "@/components/shared/blur-image"

import Author from "./author"

export function BlogCard({
  data,
  priority,
  horizontale = false,
}: {
  data: Post & { blurDataURL: string }
  priority?: boolean
  horizontale?: boolean
}) {
  return (
    <article
      className={cn(
        "group relative",
        horizontale
          ? "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6"
          : "flex flex-col space-y-2"
      )}
    >
      {data.image && (
        <div
          className={cn(
            "w-full overflow-hidden rounded-xl border",
            horizontale ? "" : "aspect-video"
          )}
        >
          <BlurImage
            alt={data.title}
            blurDataURL={data.blurDataURL ?? placeholderBlurhash}
            className={cn(
              "size-full object-fill object-center",
              horizontale ? "lg:h-72" : null
            )}
            width={1200}
            height={675}
            priority={priority}
            placeholder="blur"
            src={data.image}
            sizes="(max-width: 768px) 750px, 600px"
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-1 flex-col",
          horizontale ? "justify-center" : "justify-between"
        )}
      >
        <div className="w-full">
          <h2 className="font-heading my-1.5 line-clamp-2 text-2xl">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-muted-foreground line-clamp-2">
              {data.description}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-3">
          <div className="flex items-center -space-x-2">
            {data.authors.map((author) => (
              <Author username={author} key={data.slug + author} imageOnly />
            ))}
          </div>

          {data.date && (
            <p className="text-muted-foreground text-sm">
              {formatDate(data.date)}
            </p>
          )}
        </div>
      </div>

      <Link href={data.slug ? data.slug : "#"} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  )
}
