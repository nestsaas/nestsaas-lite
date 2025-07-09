import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { SiteLayout } from "@/components/layouts/site-layout"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser()

  if (!user) redirect("/login")

  return (
    <SiteLayout>
      <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 py-8 lg:gap-6">
        {children}
      </MaxWidthWrapper>
    </SiteLayout>
  )
}
