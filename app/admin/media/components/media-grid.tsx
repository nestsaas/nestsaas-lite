"use client"

import { useState } from "react"
import Image from "next/image"
import { Media } from "@prisma/client"
import { FileIcon, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MediaDetailDialog } from "./media-detail-dialog"

interface MediaGridProps {
  media: Media[]
  onDeleteMedia?: (media: Media) => void
}

export function MediaGrid({ media, onDeleteMedia }: MediaGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  const isImage = (mimeType: string) => mimeType.startsWith("image/")

  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
        {media.length === 0 ? (
          <div className="col-span-full flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No media files found</p>
          </div>
        ) : (
          media.map((item) => (
            <div
              key={item.id}
              className="group bg-background hover:bg-accent relative aspect-square overflow-hidden rounded-md border transition-colors"
            >
              {isImage(item.mimeType) ? (
                <div className="relative h-full w-full">
                  <Image
                    src={item.url}
                    alt={item.fileName}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16.6vw, 16.6vw"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-4">
                  <FileIcon className="text-muted-foreground h-12 w-12" />
                  <span className="mt-2 max-w-full truncate text-xs">
                    {item.fileName}
                  </span>
                </div>
              )}
              <div
                className="absolute inset-0 flex cursor-pointer items-center justify-center"
                onClick={() => setSelectedMedia(item)}
              >
                <div className="h-full w-full"></div>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs text-white">{item.fileName}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      className="h-6 w-6 p-0 text-white hover:bg-black/20"
                      aria-label="Open menu"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedMedia(item)
                      }}
                    >
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(item.url)
                      }}
                    >
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteMedia?.(item)
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedMedia && (
        <MediaDetailDialog
          media={selectedMedia}
          open={!!selectedMedia}
          onOpenChange={(open: boolean) => !open && setSelectedMedia(null)}
          onDeleteMedia={onDeleteMedia}
        />
      )}
    </>
  )
}
