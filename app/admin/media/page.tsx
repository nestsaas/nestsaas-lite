import { Metadata } from "next"
import { MediaLibrary } from "./components/media-library"

export const metadata: Metadata = {
  title: "Media Library",
  description: "Upload and manage your media files",
}

export default function MediaPage() {
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">
            Upload and manage your media files
          </p>
        </div>
      </div>
      <MediaLibrary />
    </div>
  )
}
