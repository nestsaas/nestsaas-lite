"use client"

import { useCallback, useMemo, useState } from "react"
import Image from "next/image"
// import { Media } from "@/types"
import { Media } from "@prisma/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Filter, Plus, Search, X } from "lucide-react"
import { useDebounce } from "use-debounce"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

import { getMediaList } from "../actions"
import { useMediaSelectFilters } from "../lib/hooks/useMediaSelectFilters"
import { MediaListQuery } from "../lib/schema"
import { MediaFilters } from "./media-filters"
import { MediaUploader } from "./media-uploader"
import { PaginationWithEllipsis } from "./pagination-with-ellipsis"

interface MediaSelectorProps {
  onSelect: (media: Media) => void
  selectedMediaId?: number
  triggerComponent?: React.ReactNode
}

export function MediaSelector({
  onSelect,
  selectedMediaId,
  triggerComponent,
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 24

  const queryClient = useQueryClient()

  // Use the media select filters hook (doesn't affect URL)
  const { filters, applyFilters } = useMediaSelectFilters()

  // Query for media list
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "media-list",
      { page, pageSize, search: debouncedSearchTerm, filters },
    ],
    queryFn: async () => {
      const response = await getMediaList({
        page,
        pageSize,
        search: debouncedSearchTerm || undefined,
        filter: filters,
      })

      if ("error" in response) {
        throw new Error(response.error || "Failed to fetch media")
      }

      return response
    },
  })

  // Extract data from query result with useMemo for better performance
  const media = useMemo(() => data?.items || [], [data?.items])
  const totalItems = useMemo(() => data?.total || 0, [data?.total])
  const totalPages = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize]
  )

  const handleSelect = useCallback(
    (media: Media) => {
      onSelect(media)
      setOpen(false)
    },
    [onSelect]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1) // Reset to first page when search changes
  }

  const handleFilterChange = (
    newFilters: MediaListQuery["filter"] | undefined
  ) => {
    if (newFilters) {
      applyFilters(newFilters)
      setPage(1) // Reset to first page when filters change
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const toggleFilters = () => {
    setShowFilters((prev) => !prev)
  }

  const handleUploadComplete = () => {
    setIsUploadOpen(false)
    // Refresh the media list
    queryClient.invalidateQueries({ queryKey: ["media-list"] })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerComponent || (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Select Media
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-h-[80vh] sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <DialogDescription>
            Choose an image from your media library or upload a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search media..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFilters}
              className={cn(showFilters && "bg-accent")}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>

          {/* Filters */}
          <MediaFilters
            open={showFilters}
            onOpenChange={setShowFilters}
            onApplyFilters={handleFilterChange}
          />

          {/* Media grid */}
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square h-auto w-full rounded-md" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Error loading media</p>
              </div>
            ) : media && media.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "group hover:border-primary relative cursor-pointer overflow-hidden rounded-md border transition-colors",
                      selectedMediaId === item.id &&
                        "border-primary ring-primary ring-2"
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    <div className="image-scale relative aspect-square overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.title || item.fileName}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-contain transition-transform"
                      />
                    </div>
                    {/* <div className="p-2">
                      <p className="truncate text-xs font-medium">
                        {item.title || item.fileName}
                      </p>
                    </div> */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  No media found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </ScrollArea>

          <PaginationWithEllipsis
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </DialogContent>

      {/* Media uploader dialog */}
      <MediaUploader
        open={isUploadOpen}
        onOpenChange={(open) => {
          setIsUploadOpen(open)
          if (!open) {
            // Refresh the media list when the uploader is closed
            queryClient.invalidateQueries({ queryKey: ["media-list"] })
          }
        }}
      />
    </Dialog>
  )
}
