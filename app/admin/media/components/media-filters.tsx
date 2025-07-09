"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { MediaListQuery } from "../lib/schema"

interface MediaFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters?: (filters: MediaListQuery["filter"]) => void
}

export function MediaFilters({
  open,
  onOpenChange,
  onApplyFilters,
}: MediaFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const typeParam = searchParams.get("type")
  const sizeParam = searchParams.get("size")
  const categoryParam = searchParams.get("category")
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")

  const [type, setType] = useState(typeParam || "all")
  const [size, setSize] = useState(sizeParam || "all")
  const [fromDate, setFromDate] = useState<Date | undefined>(
    fromParam ? new Date(fromParam) : undefined
  )
  const [toDate, setToDate] = useState<Date | undefined>(
    toParam ? new Date(toParam) : undefined
  )

  const [dateRangeError, setDateRangeError] = useState<string | null>(null)

  const formattedFromDate = useMemo(
    () => (fromDate ? format(fromDate, "PPP") : "Select date"),
    [fromDate]
  )

  const formattedToDate = useMemo(
    () => (toDate ? format(toDate, "PPP") : "Select date"),
    [toDate]
  )

  const applyFilters = useCallback(() => {
    if (fromDate && toDate && fromDate > toDate) {
      setDateRangeError("From date cannot be after To date")
      return
    }

    setDateRangeError(null)

    const filters: MediaListQuery["filter"] = {}

    if (type && type !== "all") {
      filters.type = type
    }

    if (size && size !== "all") {
      filters.size = size
    }

    if (fromDate) {
      filters.from = fromDate.toISOString().split("T")[0]
    }

    if (toDate) {
      filters.to = toDate.toISOString().split("T")[0]
    }

    if (onApplyFilters) {
      onApplyFilters(filters)
    } else {
      const params = new URLSearchParams(searchParams.toString())

      if (type && type !== "all") {
        params.set("type", type)
      } else {
        params.delete("type")
      }

      if (size && size !== "all") {
        params.set("size", size)
      } else {
        params.delete("size")
      }

      if (fromDate) {
        params.set("from", fromDate.toISOString().split("T")[0])
      } else {
        params.delete("from")
      }

      if (toDate) {
        params.set("to", toDate.toISOString().split("T")[0])
      } else {
        params.delete("to")
      }

      router.push(`?${params.toString()}`)
    }

    onOpenChange(false)
  }, [
    router,
    searchParams,
    type,
    size,
    fromDate,
    toDate,
    onOpenChange,
    onApplyFilters,
  ])

  const resetFilters = useCallback(() => {
    setType("all")
    setSize("all")
    setFromDate(undefined)
    setToDate(undefined)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open) {
        if (e.key === "Escape") {
          onOpenChange(false)
        } else if (e.key === "Enter" && e.ctrlKey) {
          applyFilters()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange, applyFilters])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter Media</DialogTitle>
          <DialogDescription>
            Filter media files by type, size, and upload date.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">File Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>File Size</Label>
            <RadioGroup value={size} onValueChange={setSize}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="size-all" />
                <Label htmlFor="size-all">All Sizes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="size-small" />
                <Label htmlFor="size-small">Small (&lt; 1MB)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="size-medium" />
                <Label htmlFor="size-medium">Medium (1MB - 10MB)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="size-large" />
                <Label htmlFor="size-large">Large (&gt; 10MB)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Upload Date</Label>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="space-y-1">
                <Label htmlFor="from-date" className="text-xs">
                  From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="from-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formattedFromDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <Label htmlFor="to-date" className="text-xs">
                  To
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="to-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formattedToDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {dateRangeError && (
              <p className="text-destructive mt-1 text-sm">{dateRangeError}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={resetFilters}>
            Reset
          </Button>
          <Button type="button" onClick={applyFilters}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
