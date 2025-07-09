"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RegisterContent } from "@/app/(auth)/components/register-content"

export default function RegisterModal() {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background relative w-full max-w-md rounded-lg p-6 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={() => router.back()}
        >
          <X className="size-4" />
        </Button>

        <RegisterContent onNavigate={(path) => router.push(path)} />
      </div>
    </div>
  )
}
