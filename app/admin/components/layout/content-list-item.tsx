"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface ContentListItemProps {
  title: string
  description?: string | React.ReactNode
  isActive?: boolean
  onClick?: () => void
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

export const ContentListItem = React.memo(
  ({
    title,
    description,
    isActive = false,
    onClick,
    icon,
    rightElement,
  }: ContentListItemProps) => {
    return (
      <div
        className={cn(
          "flex h-[52px] w-full cursor-pointer items-center gap-3 rounded-md p-2 transition-colors",
          isActive
            ? "bg-primary/10 text-primary hover:bg-primary/15"
            : "hover:bg-muted"
        )}
        onClick={onClick}
        style={{ display: 'grid', gridTemplateColumns: icon ? 'auto 1fr auto' : '1fr auto' }}
      >
        {icon && (
          <div className="bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-md border">
            {icon}
          </div>
        )}
        <div className="mx-3 flex flex-col justify-center overflow-hidden">
          <div className="max-w-full truncate text-sm font-medium leading-none">
            {title}
          </div>
          {description && (
            <div className="text-muted-foreground mt-1 max-w-full truncate text-xs">
              {description}
            </div>
          )}
        </div>
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>
    )
  },
  (prev, next) =>
    prev.title === next.title &&
    prev.description === next.description &&
    prev.isActive === next.isActive &&
    prev.onClick === next.onClick &&
    prev.icon === next.icon &&
    prev.rightElement === next.rightElement
)

ContentListItem.displayName = "ContentListItem"
