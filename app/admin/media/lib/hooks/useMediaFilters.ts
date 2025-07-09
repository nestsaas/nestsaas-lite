"use client"

import { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { MediaListQuery } from "../schema"

export function useMediaFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [mimeTypeFilter, setMimeTypeFilter] = useState(
    searchParams.get("type") || ""
  )
  const [sizeFilter, setSizeFilter] = useState(searchParams.get("size") || "")
  const [fromDateFilter, setFromDateFilter] = useState(
    searchParams.get("from") || ""
  )
  const [toDateFilter, setToDateFilter] = useState(searchParams.get("to") || "")

  const applyFilters = useCallback(
    (filters: MediaListQuery["filter"] | undefined) => {
      const params = new URLSearchParams(searchParams.toString())

      if (filters?.type) {
        params.set("type", filters.type)
        setMimeTypeFilter(filters.type)
      } else {
        params.delete("type")
        setMimeTypeFilter("")
      }

      if (filters?.size) {
        params.set("size", filters.size)
        setSizeFilter(filters.size)
      } else {
        params.delete("size")
        setSizeFilter("")
      }

      if (filters?.from) {
        params.set("from", filters.from)
        setFromDateFilter(filters.from)
      } else {
        params.delete("from")
        setFromDateFilter("")
      }

      if (filters?.to) {
        params.set("to", filters.to)
        setToDateFilter(filters.to)
      } else {
        params.delete("to")
        setToDateFilter("")
      }

      params.set("page", "1")
      router.push(`?${params.toString()}`, { scroll: false })
      return true
    },
    [router, searchParams]
  )

  return {
    filters: {
      type: mimeTypeFilter || undefined,
      size: sizeFilter || undefined,
      from: fromDateFilter || undefined,
      to: toDateFilter || undefined,
    },
    setters: {
      setMimeTypeFilter,
      setSizeFilter,
      setFromDateFilter,
      setToDateFilter,
    },
    applyFilters,
  }
}
