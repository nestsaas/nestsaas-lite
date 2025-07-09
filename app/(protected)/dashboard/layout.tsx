import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser()

  if (!user) redirect("/login")

  return (
    <div className="relative flex w-full">
      <main className="flex-1 p-4 xl:px-8">
        <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
          {children}
        </MaxWidthWrapper>
      </main>
    </div>
  )
}
