import { Suspense } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"

import { UserAuthForm } from "./user-auth-form"

interface LoginContentProps {
  onNavigate?: (path: string) => void
}

export function LoginContent({ onNavigate }: LoginContentProps) {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <img
          src="/logo.png"
          alt={siteConfig.name}
          className="mx-auto h-12 w-12"
        />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email to sign in to your account
        </p>
      </div>

      <Suspense>
        <UserAuthForm />
      </Suspense>

      <p className="text-muted-foreground px-8 text-center text-sm">
        {onNavigate ? (
          <button
            className="hover:text-brand underline underline-offset-4"
            onClick={() => onNavigate("/register")}
          >
            Don&apos;t have an account? Sign Up
          </button>
        ) : (
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        )}
      </p>
    </div>
  )
}
