"use client"

import { useCallback, useState } from "react"

import { MediaListQuery } from "../schema"

export function useMediaSelectFilters() {
  const [mimeTypeFilter, setMimeTypeFilter] = useState("")
  const [sizeFilter, setSizeFilter] = useState("")
  const [fromDateFilter, setFromDateFilter] = useState("")
  const [toDateFilter, setToDateFilter] = useState("")

  const applyFilters = useCallback(
    (filters: MediaListQuery["filter"] | undefined) => {
      if (filters?.type) {
        setMimeTypeFilter(filters.type)
      } else {
        setMimeTypeFilter("")
      }

      if (filters?.size) {
        setSizeFilter(filters.size)
      } else {
        setSizeFilter("")
      }

      if (filters?.from) {
        setFromDateFilter(filters.from)
      } else {
        setFromDateFilter("")
      }

      if (filters?.to) {
        setToDateFilter(filters.to)
      } else {
        setToDateFilter("")
      }

      return true
    },
    []
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
