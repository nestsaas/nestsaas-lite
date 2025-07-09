import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { RegisterContent } from "../components/register-content"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 right-4 md:top-8 md:right-8"
        )}
      >
        Login
      </Link>
      <div className="bg-muted hidden h-full lg:block" />
      <div className="lg:p-8">
        <RegisterContent />
      </div>
    </div>
  )
}
