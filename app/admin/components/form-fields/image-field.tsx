"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Media } from "@prisma/client"
import { ImageIcon, X } from "lucide-react"
import { Control } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MediaSelector } from "@/app/admin/media/components/media-selector"

interface ImageFieldProps {
  control: Control<any>
  name: string
  label?: string
  description?: string
  width?: number
  height?: number
  onMediaSelected?: (media: Media) => void
}

export function ImageField({
  control,
  name,
  label = "Image URL",
  description = "URL to the image",
  width = 32,
  height = 32,
  onMediaSelected,
}: ImageFieldProps) {
  const [timestamp, setTimestamp] = useState(Date.now())

  const handleMediaSelect = useCallback(
    (media: Media) => {
      if (typeof onMediaSelected === "function") {
        onMediaSelected(media)
      }
    },
    [onMediaSelected]
  )

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Extract media ID from URL if possible
        const mediaId =
          field.value && typeof field.value === "string"
            ? parseInt(
                field.value.split("/").pop()?.split("?")[0] || "0",
                10
              ) || undefined
            : undefined

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="flex items-end space-x-2">
              {/* Preview of selected image */}
              {field.value && (
                <div
                  className="relative rounded-md border"
                  style={{ height: `${height * 4}px`, width: `${width * 4}px` }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={`${field.value}${field.value.includes("?") ? "&" : "?"}_t=${timestamp}`}
                      sizes={`${width}x${height}`}
                      alt="Selected image"
                      fill
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 cursor-pointer rounded-full backdrop-blur-sm"
                      onClick={() => {
                        field.onChange("")
                        setTimestamp(Date.now())
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <MediaSelector
                  onSelect={(media) => {
                    if (
                      !media.mimeType ||
                      !media.mimeType.startsWith("image/")
                    ) {
                      toast.error("Please select an image.")
                      return
                    }
                    field.onChange(media.url)

                    handleMediaSelect(media)

                    setTimestamp(Date.now())
                  }}
                  selectedMediaId={mediaId}
                  triggerComponent={
                    <Button type="button" variant="outline">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Select from media library
                    </Button>
                  }
                />
              </div>
            </div>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
