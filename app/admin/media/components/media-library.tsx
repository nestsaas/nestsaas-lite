"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Media } from "@prisma/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { GridIcon, ListIcon, Search, Upload } from "lucide-react"
import { toast } from "sonner"
import { useDebounce } from "use-debounce"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { deleteMedia, getMediaList } from "../actions"
import { useMediaFilters } from "../lib/hooks/useMediaFilters"
import { MediaListQuery } from "../lib/schema"
import { MediaGrid } from "./media-grid"
import { MediaInlineFilters } from "./media-inline-filters"
import { MediaList } from "./media-list"
import { MediaUploader } from "./media-uploader"
import { PaginationWithEllipsis } from "./pagination-with-ellipsis"

export type ViewMode = "grid" | "list"

export function MediaLibrary() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // Get view mode from URL or default to grid
  const viewParam = searchParams.get("view") as ViewMode | null
  const [viewMode, setViewMode] = useState<ViewMode>(viewParam || "grid")
  const currentPage = Number(searchParams.get("page")) || 1
  const pageSize = Number(searchParams.get("pageSize")) || 20

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300) // 300ms debounce delay

  const { filters, applyFilters } = useMediaFilters()

  const [uploadOpen, setUploadOpen] = useState(false)
  // Filter state is now handled in the inline filter component
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch media data using TanStack Query with optimized query key
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "media-list",
      {
        page: currentPage,
        pageSize,
        search: debouncedSearchQuery,
        filters,
      },
    ],
    queryFn: async () => {
      const response = await getMediaList({
        page: currentPage,
        pageSize,
        search: debouncedSearchQuery || undefined,
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

  const handleViewChange = useCallback(
    (value: string) => {
      setViewMode(value as ViewMode)

      const params = new URLSearchParams(searchParams.toString())
      params.set("view", value)
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  // Apply search query when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchParams.get("q")) {
      const params = new URLSearchParams(searchParams.toString())
      if (debouncedSearchQuery) {
        params.set("q", debouncedSearchQuery)
      } else {
        params.delete("q")
      }
      params.set("page", "1")
      router.push(`?${params.toString()}`, { scroll: false })
    }
  }, [debouncedSearchQuery, router, searchParams])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery) {
        params.set("q", searchQuery)
      } else {
        params.delete("q")
      }
      params.set("page", "1")
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams, searchQuery]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", page.toString())
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handlePageSizeChange = useCallback(
    (size: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("pageSize", size)
      params.set("page", "1")
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handleApplyFilters = useCallback(
    (filterParams: MediaListQuery["filter"] | undefined) => {
      applyFilters(filterParams)
    },
    [applyFilters]
  )

  const handleDeleteMedia = useCallback((media: Media) => {
    setMediaToDelete(media)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!mediaToDelete || !mediaToDelete.id) return

    try {
      setIsDeleting(true)
      const result = await deleteMedia({ id: Number(mediaToDelete.id) })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("File deleted successfully")
        // Invalidate and refetch media list data
        await queryClient.invalidateQueries({ queryKey: ["media-list"] })
        router.refresh()
      }
    } catch (error) {
      toast.error("Failed to delete file")
      console.error(error)
    } finally {
      setIsDeleting(false)
      setMediaToDelete(null)
    }
  }, [mediaToDelete, queryClient, router])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search media..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={handleViewChange}>
              <TabsList className="grid w-[120px] grid-cols-2">
                <TabsTrigger value="grid" aria-label="Grid view">
                  <GridIcon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" aria-label="List view">
                  <ListIcon className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
        
        {/* Inline filters */}
        <MediaInlineFilters onApplyFilters={applyFilters} />
      </div>

      {/* Media content */}
      <div className="bg-card rounded-md border">
        {isLoading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="aspect-square w-full">
                  <Skeleton className="h-full w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <Skeleton className="h-[300px] w-full rounded-md" />
            </div>
          )
        ) : isError ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-destructive">Error loading media files</p>
          </div>
        ) : viewMode === "grid" ? (
          <MediaGrid media={media} onDeleteMedia={handleDeleteMedia} />
        ) : (
          <MediaList media={media} onDeleteMedia={handleDeleteMedia} />
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex shrink-0 items-center gap-2">
            <p className="text-muted-foreground text-sm">
              Showing {media.length} of {totalItems} items
            </p>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-sm">per page</span>
          </div>

          <PaginationWithEllipsis
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Upload dialog */}
      <MediaUploader open={uploadOpen} onOpenChange={setUploadOpen} />

      {/* Inline filters are now used instead of dialog */}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!mediaToDelete}
        onOpenChange={(open) => !open && setMediaToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this file?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              file
              {mediaToDelete?.fileName && (
                <strong> "{mediaToDelete.fileName}"</strong>
              )}{" "}
              from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDelete()
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
