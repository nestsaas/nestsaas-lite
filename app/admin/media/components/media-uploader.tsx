"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
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

interface MediaUploaderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MediaUploader({ open, onOpenChange }: MediaUploaderProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files)
        setFiles((prevFiles) => [...prevFiles, ...newFiles])
      }
    },
    []
  )

  const removeFile = useCallback((index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)

    try {
      // Import the uploadMedia Server Action
      const { uploadMedia } = await import("../actions")

      // Upload each file using the Server Action
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        // Explicitly add empty strings for optional fields
        formData.append("title", "")

        const result = await uploadMedia(formData)

        if (result.error) {
          throw new Error(result.error)
        }

        return result.media
      })

      // Wait for all uploads to complete
      await Promise.all(uploadPromises)

      toast.success("Upload successful", {
        description: `${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully.`,
      })

      // Close dialog and refresh media list
      onOpenChange(false)
      // Invalidate and refetch media list data
      await queryClient.invalidateQueries({ queryKey: ["media-list"] })
      router.refresh()
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Upload failed", {
        description:
          error instanceof Error
            ? error.message
            : "There was an error uploading your files. Please try again.",
      })
    } finally {
      setIsUploading(false)
      setFiles([])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to browse. Supported formats: JPG, PNG,
            GIF, PDF, and more.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="text-muted-foreground mb-4 h-10 w-10" />
          <p className="mb-2 text-sm font-medium">Drag and drop files here</p>
          <p className="text-muted-foreground mb-4 text-xs">or</p>
          <Label
            htmlFor="file-upload"
            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-md px-4 py-2 text-sm font-medium"
          >
            Browse files
          </Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,application/pdf,video/*,audio/*"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-4 max-h-[200px] overflow-auto rounded-md border p-2">
            <p className="mb-2 text-sm font-medium">
              Selected files ({files.length}):
            </p>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="bg-muted flex items-center justify-between rounded-md p-2 text-sm"
                >
                  <div className="flex items-center overflow-hidden">
                    <span className="truncate">{file.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
