"use client"

import { useState } from "react"
import Image from "next/image"
import { Media } from "@prisma/client"
import { format } from "date-fns"
import { FileIcon, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { MediaDetailDialog } from "./media-detail-dialog"

interface MediaListProps {
  media: Media[]
  onDeleteMedia?: (media: Media) => void
}

export function MediaList({ media, onDeleteMedia }: MediaListProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  const isImage = (mimeType: string) => mimeType.startsWith("image/")

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[300px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {media.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No media files found
                </TableCell>
              </TableRow>
            ) : (
              media.map((item) => (
                <TableRow key={item.id}>
                  <TableCell
                    className="max-w-[400px] min-w-[240px] cursor-pointer font-medium hover:underline"
                    onClick={() => setSelectedMedia(item)}
                  >
                    <div className="flex items-center gap-2">
                      {isImage(item.mimeType) ? (
                        <Image
                          src={item.url}
                          alt={item.fileName}
                          width={50}
                          height={50}
                          className="object-cover"
                        />
                      ) : (
                        <FileIcon className="text-muted-foreground h-4 w-4" />
                      )}
                      <p className="overflow-hidden text-ellipsis">
                        {item.fileName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{item.mimeType}</TableCell>
                  <TableCell>{formatFileSize(item.fileSize)}</TableCell>
                  <TableCell>
                    {item.width && item.height
                      ? `${item.width} × ${item.height}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label="Open menu"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedMedia(item)}
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // Copy URL to clipboard
                            navigator.clipboard.writeText(item.url)
                          }}
                        >
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDeleteMedia?.(item)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedMedia && (
        <MediaDetailDialog
          media={selectedMedia}
          open={!!selectedMedia}
          onOpenChange={(open) => !open && setSelectedMedia(null)}
          onDeleteMedia={onDeleteMedia}
        />
      )}
    </>
  )
}
