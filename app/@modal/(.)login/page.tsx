"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LoginContent } from "@/app/(auth)/components/login-content"

export default function LoginModal() {
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

        <LoginContent onNavigate={(path) => router.push(path)} />
      </div>
    </div>
  )
}
