"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "motion/react"

import { ScrollArea } from "@/components/ui/scroll-area"

interface Heading {
  level: number
  text: string
  id: string
}

interface TOCProps {
  toc: Heading[]
}

export default function TableOfContents({ toc }: TOCProps) {
  const [activeId, setActiveId] = useState<string>("")
  const headings = useMemo(() => toc ?? [], [toc])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -50% 0px" }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <div className="space-y-2">
      <p className="text-[15px] font-medium">On This Page</p>
      <ScrollArea className="min-h-[20rem]">
        <ul className="border-border relative grid gap-2 space-y-2 border-l-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`relative ${
                heading.level === 1
                  ? "pl-0"
                  : heading.level === 2
                    ? "pl-4"
                    : "pl-8"
              }`}
            >
              {activeId === heading.id && (
                <motion.div
                  layoutId="active-indicator"
                  className="border-foreground absolute -left-0.5 h-full border-l-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <a
                href={`#${heading.id}`}
                className={`text-muted-foreground hover:text-foreground -ml-0.5 block text-sm transition-colors ${
                  activeId === heading.id
                    ? "text-primary dark:text-primary-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
