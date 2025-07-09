import * as React from "react"
import Link from "next/link"
import { MDXContent } from "@content-collections/mdx/react"

import { cn } from "@/lib/utils"
import BlurImage from "@/components/shared/blur-image"
import { Callout } from "@/components/content/callout"
import { CopyButton } from "@/components/content/copy-button"
import { MdxCard } from "@/components/content/mdx-card"

// Define MDX components
const components = {
  h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<"h2">) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.ComponentProps<"h5">) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.ComponentProps<"h6">) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.ComponentProps<"a">) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "[&>*]:text-muted-foreground mt-6 border-l-2 pl-6 italic",
        className
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.ComponentProps<"hr">) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("even:bg-muted m-0 border-t p-0", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({
    className,
    __rawString__,
    ...props
  }: React.HTMLAttributes<HTMLPreElement> & { __rawString__?: string }) => (
    <div className="group relative w-full overflow-hidden">
      <pre
        className={cn(
          "max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-900 py-4 dark:bg-zinc-900",
          className
        )}
        {...props}
      />
      {__rawString__ && (
        <CopyButton
          value={__rawString__}
          className={cn(
            "absolute top-4 right-4 z-20",
            "opacity-0 transition-all duration-250 group-hover:opacity-100"
          )}
        />
      )}
    </div>
  ),
  code: ({ className, ...props }: React.ComponentProps<"code">) => (
    <code
      className={cn(
        "text-foreground relative px-[0.4rem] py-1 font-mono text-sm",
        className
      )}
      {...props}
    />
  ),
  Callout,
  Card: MdxCard,
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }: React.ComponentProps<"div">) => (
    <div
      className="[& > h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
      {...props}
    />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "bg-card text-card-foreground hover:bg-muted/50 flex w-full flex-col items-center rounded-xl border p-6 shadow transition-colors sm:p-10",
        className
      )}
      {...props}
    />
  ),
}

interface MdxProps {
  content: string // MDX source content
  images?: { alt: string; src: string; blurDataURL: string }[]
}

export function Mdx({ content, images }: MdxProps) {
  const MDXImage = (props: any) => {
    if (!images) return null
    const blurDataURL = images.find(
      (image) => image.src === props.src
    )?.blurDataURL

    return (
      <div className="mt-5 w-full overflow-hidden rounded-lg border">
        <BlurImage
          {...props}
          blurDataURL={blurDataURL}
          className="size-full object-cover object-center"
        />
      </div>
    )
  }

  return (
    <div className="mdx">
      <MDXContent
        code={content} // MDX source content
        components={{
          ...components,
          Image: MDXImage,
        }}
      />
    </div>
  )
}

export default components // Export components mapping for use in other places
