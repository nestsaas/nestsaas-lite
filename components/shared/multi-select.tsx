"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  searchPlaceholder?: string
  maxDisplayItems?: number
  pageSize?: number
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items",
  emptyMessage = "No items found.",
  className,
  searchPlaceholder = "Search...",
  maxDisplayItems = 3,
  pageSize = 20,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  // Filter options based on search
  const allFilteredOptions = React.useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  // Paginate filtered options
  const filteredOptions = React.useMemo(() => {
    return allFilteredOptions.slice(0, page * pageSize)
  }, [allFilteredOptions, page, pageSize])

  // Check if there are more options to load
  const hasMore = filteredOptions.length < allFilteredOptions.length

  // Handle scroll event to load more items
  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (loading || !hasMore) return

      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget

      if (scrollHeight - scrollTop - clientHeight < 20) {
        setLoading(true)
        setTimeout(() => {
          setPage((prevPage) => prevPage + 1)
          setLoading(false)
        }, 100)
      }
    },
    [loading, hasMore]
  )

  // Get selected item labels
  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label)

  // Setup intersection observer for infinite scrolling
  React.useEffect(() => {
    // Reset pagination when search changes
    setPage(1)
  }, [searchValue])

  React.useEffect(() => {
    // Reset pagination when dropdown opens
    if (open) {
      setPage(1)
    }
  }, [open])

  React.useEffect(() => {
    if (open) {
      // delay to make sure dom update
      setTimeout(() => {
        setPage(1)
      }, 0)
    }
  }, [open, searchValue])

  // Remove single selected item
  const removeItem = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }

  // Clear all selected items
  const clearAll = () => {
    onChange([])
  }

  // Toggle selected item
  const toggleItem = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  // Number of displayed selected items
  const displayCount = Math.min(selected.length, maxDisplayItems)
  const hasMoreSelected = selected.length > maxDisplayItems

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {/* flex-1  */}
          <div className="flex items-center gap-1">
            {selected.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selected.length > 0 && (
              <>
                {selectedLabels.slice(0, displayCount).map((label) => (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                    key={label}
                  >
                    {label}
                    <span
                      role="button"
                      tabIndex={0}
                      className="ring-offset-background focus:ring-ring cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          e.stopPropagation()
                          removeItem(
                            options.find((option) => option.label === label)
                              ?.value || ""
                          )
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeItem(
                          options.find((option) => option.label === label)
                            ?.value || ""
                        )
                      }}
                    >
                      <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                    </span>
                  </Badge>
                ))}
                {hasMoreSelected && (
                  <Badge variant="secondary">
                    + {selected.length - displayCount} more
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-[min(300px, var(--radix-popper-anchor-width))] p-0"
        align="start"
        alignOffset={0}
      >
        <Command className="">
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          {selected.length > 0 && (
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="text-muted-foreground text-sm">
                {selected.length} selected
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs"
                onClick={clearAll}
              >
                Clear all
              </Button>
            </div>
          )}
          <CommandList
            className="max-h-[300px] overflow-auto"
            onScroll={handleScroll}
          >
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggleItem(option.value)}
                  >
                    <div
                      className={cn(
                        "border-muted-foreground mr-2 flex h-4 w-4 items-center justify-center rounded-xs border",
                        isSelected ? "border-primary bg-primary" : "opacity-50"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {hasMore && (
              <div className="flex items-center justify-center py-2">
                <Loader2
                  className={cn(
                    "text-muted-foreground h-4 w-4",
                    loading ? "animate-spin" : "opacity-0"
                  )}
                />
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
