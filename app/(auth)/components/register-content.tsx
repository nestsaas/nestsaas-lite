import { Suspense } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"

import { UserAuthForm } from "./user-auth-form"

interface RegisterContentProps {
  onNavigate?: (path: string) => void
}

export function RegisterContent({ onNavigate }: RegisterContentProps) {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <img
          src="/logo.png"
          alt={siteConfig.name}
          className="mx-auto h-12 w-12"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email below to create your account
        </p>
      </div>

      <Suspense>
        <UserAuthForm type="register" />
      </Suspense>

      <p className="text-muted-foreground px-8 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="hover:text-brand underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="hover:text-brand underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-muted-foreground text-center text-sm">
        {onNavigate ? (
          <button
            className="hover:text-brand underline underline-offset-4"
            onClick={() => onNavigate("/login")}
          >
            Already have an account? Sign in
          </button>
        ) : (
          <Link
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Already have an account? Sign in
          </Link>
        )}
      </p>
    </div>
  )
}
