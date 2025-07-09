import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

export type ItemNotFoundProps = {
  title: string
  description: string
  backUrl: string
}

export function ItemNotFound({
  title,
  description,
  backUrl,
}: ItemNotFoundProps) {
  const router = useRouter()
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="text-muted-foreground h-8 w-8" />
      <h2 className="mt-4 text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-2">{description}</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => router.push(backUrl)}
      >
        Go Back
      </Button>
    </div>
  )
}
