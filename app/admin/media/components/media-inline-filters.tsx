"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { MediaListQuery } from "../lib/schema"

interface MediaInlineFiltersProps {
  onApplyFilters?: (filters: MediaListQuery["filter"]) => void
}

export function MediaInlineFilters({
  onApplyFilters,
}: MediaInlineFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const typeParam = searchParams.get("type")
  const sizeParam = searchParams.get("size")
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

  const formattedFromDate = useMemo(
    () => (fromDate ? format(fromDate, "PP") : "From"),
    [fromDate]
  )

  const formattedToDate = useMemo(
    () => (toDate ? format(toDate, "PP") : "To"),
    [toDate]
  )

  const applyFilters = useCallback(
    (
      typeValue: string,
      sizeValue: string,
      fromDateValue?: Date,
      toDateValue?: Date
    ) => {
      if (fromDateValue && toDateValue && fromDateValue > toDateValue) {
        // Invalid date range, don't apply
        return
      }

      const filters: MediaListQuery["filter"] = {}

      if (typeValue && typeValue !== "all") {
        filters.type = typeValue
      }

      if (sizeValue && sizeValue !== "all") {
        filters.size = sizeValue
      }

      if (fromDateValue) {
        filters.from = fromDateValue.toISOString().split("T")[0]
      }

      if (toDateValue) {
        filters.to = toDateValue.toISOString().split("T")[0]
      }

      if (onApplyFilters) {
        onApplyFilters(filters)
      } else {
        const params = new URLSearchParams(searchParams.toString())

        if (typeValue && typeValue !== "all") {
          params.set("type", typeValue)
        } else {
          params.delete("type")
        }

        if (sizeValue && sizeValue !== "all") {
          params.set("size", sizeValue)
        } else {
          params.delete("size")
        }

        if (fromDateValue) {
          params.set("from", fromDateValue.toISOString().split("T")[0])
        } else {
          params.delete("from")
        }

        if (toDateValue) {
          params.set("to", toDateValue.toISOString().split("T")[0])
        } else {
          params.delete("to")
        }

        params.set("page", "1") // Reset to first page when filters change
        router.push(`?${params.toString()}`, { scroll: false })
      }
    },
    [router, searchParams, onApplyFilters]
  )

  const handleTypeChange = useCallback(
    (value: string) => {
      setType(value)
      applyFilters(value, size, fromDate, toDate)
    },
    [size, fromDate, toDate, applyFilters]
  )

  const handleSizeChange = useCallback(
    (value: string) => {
      setSize(value)
      applyFilters(type, value, fromDate, toDate)
    },
    [type, fromDate, toDate, applyFilters]
  )

  const handleFromDateChange = useCallback(
    (date: Date | undefined) => {
      setFromDate(date)
      applyFilters(type, size, date, toDate)
    },
    [type, size, toDate, applyFilters]
  )

  const handleToDateChange = useCallback(
    (date: Date | undefined) => {
      setToDate(date)
      applyFilters(type, size, fromDate, date)
    },
    [type, size, fromDate, applyFilters]
  )

  const resetFilters = useCallback(() => {
    // Reset local state
    setType("all")
    setSize("all")
    setFromDate(undefined)
    setToDate(undefined)

    // Use onApplyFilters to reset filters in the parent component
    if (onApplyFilters) {
      onApplyFilters(undefined)
    }
  }, [onApplyFilters])

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Type filter */}
      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="image">Images</SelectItem>
          <SelectItem value="document">Documents</SelectItem>
          <SelectItem value="video">Videos</SelectItem>
          <SelectItem value="audio">Audio</SelectItem>
        </SelectContent>
      </Select>

      {/* Size filter */}
      <Select value={size} onValueChange={handleSizeChange}>
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="All sizes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sizes</SelectItem>
          <SelectItem value="small">Small (&lt; 1MB)</SelectItem>
          <SelectItem value="medium">Medium (1-10MB)</SelectItem>
          <SelectItem value="large">Large (&gt; 10MB)</SelectItem>
        </SelectContent>
      </Select>

      {/* Date range */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex h-9 items-center justify-between"
              style={{ width: "160px" }}
            >
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {formattedFromDate}
              </div>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={handleFromDateChange}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex h-9 items-center justify-between"
              style={{ width: "160px" }}
            >
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {formattedToDate}
              </div>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={handleToDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Reset button */}
      <Button variant="ghost" size="sm" className="h-9" onClick={resetFilters}>
        Reset
      </Button>
    </div>
  )
}
