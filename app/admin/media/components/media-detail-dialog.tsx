"use client"

import { useState } from "react"
import Image from "next/image"
import { Media } from "@prisma/client"
import { format } from "date-fns"
import { Copy, Download, FileIcon, Trash } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MediaDetailDialogProps {
  media: Media
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteMedia?: (media: Media) => void
}

export function MediaDetailDialog({
  media,
  open,
  onOpenChange,
  onDeleteMedia,
}: MediaDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("preview")

  const isImage = media.mimeType.startsWith("image/")

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  function handleCopyUrl(url: string): void {
    try {
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : ""
      let parsedUrl = url
      if (url.startsWith("/uploads/")) {
        parsedUrl = `${baseUrl}${url}`
      }
      navigator.clipboard.writeText(parsedUrl)
      toast.success("URL copied to clipboard")
    } catch (error) {
      console.error("Failed to copy URL:", error)
      toast.error("Failed to copy URL")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{media.fileName}</DialogTitle>
          <DialogDescription>
            Uploaded on {format(new Date(media.createdAt), "PPP")}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="bg-background flex justify-center rounded-lg border p-4">
              {isImage ? (
                <div className="relative h-[300px] w-full">
                  <Image
                    src={media.url}
                    alt={media.fileName}
                    fill
                    sizes="100%"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-[300px] w-full flex-col items-center justify-center">
                  <FileIcon className="text-muted-foreground h-20 w-20" />
                  <span className="mt-4 text-lg">{media.fileName}</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="filename">Filename</Label>
                <Input
                  id="filename"
                  value={media.fileName}
                  readOnly
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="mime-type">MIME Type</Label>
                <Input
                  id="mime-type"
                  value={media.mimeType}
                  readOnly
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size">File Size</Label>
                <Input
                  id="size"
                  value={formatFileSize(media.fileSize)}
                  readOnly
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={
                    media.width && media.height
                      ? `${media.width} × ${media.height}`
                      : "N/A"
                  }
                  readOnly
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <div className="mt-1 flex">
                <Input
                  id="url"
                  value={media.url}
                  readOnly
                  className="rounded-r-none"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-l-none"
                  onClick={() => handleCopyUrl(media.url)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (onDeleteMedia) {
                  onDeleteMedia(media)
                  onOpenChange(false)
                }
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={() => handleCopyUrl(media.url)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
            <Button
              size="sm"
              onClick={() => {
                fetch(media.url)
                  .then((res) => res.blob())
                  .then((blob) => {
                    const blobUrl = window.URL.createObjectURL(blob)

                    const link = document.createElement("a")
                    link.href = blobUrl
                    link.target = "_blank"
                    link.download = media.fileName
                    link.click()
                  })
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
