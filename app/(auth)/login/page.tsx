import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"

import { LoginContent } from "../components/login-content"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "absolute top-4 left-4 md:top-8 md:left-8"
        )}
      >
        <>
          <Icons.ChevronLeft className="mr-2 size-4" />
          Back
        </>
      </Link>
      <LoginContent />
    </div>
  )
}
