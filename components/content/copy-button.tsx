"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  const handleCopyValue = (value: string) => {
    navigator.clipboard.writeText(value)
    setHasCopied(true)
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className={cn(
        "text-primary-foreground hover:text-foreground dark:text-foreground z-10 size-[30px] border border-white/25 bg-zinc-900 p-1.5",
        className
      )}
      onClick={() => handleCopyValue(value)}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <Icons.Check className="size-4" />
      ) : (
        <Icons.Copy className="size-4" />
      )}
    </Button>
  )
}
