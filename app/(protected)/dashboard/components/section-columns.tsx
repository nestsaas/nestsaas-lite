import React from "react"

interface SectionColumnsType {
  title: string
  description?: string
  children: React.ReactNode
}

export function SectionColumns({
  title,
  description,
  children,
}: SectionColumnsType) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-4 py-8 md:grid-cols-10">
      <div className="col-span-4 space-y-1.5">
        <h2 className="text-lg leading-none font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm text-balance">
          {description}
        </p>
      </div>
      <div className="col-span-6">{children}</div>
    </div>
  )
}
