import { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { UnsubscribeForm } from "@/components/newsletter/unsubscribe-form"

export const metadata: Metadata = {
  title: "Unsubscribe from Newsletter",
  description: "Unsubscribe from our newsletter",
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const email = (await searchParams).email || ""

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Unsubscribe from Newsletter
          </h1>
          <p className="text-muted-foreground text-sm">
            We're sorry to see you go. Please confirm your email address to
            unsubscribe.
          </p>
        </div>

        <UnsubscribeForm email={email} />

        <div className="text-center">
          <Link href="/">
            <Button variant="link" className="text-muted-foreground text-sm">
              Return to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
