import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"

import { getCurrentUser } from "@/lib/session"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/app/admin/components/layout/site-header"
import { Providers } from "@/app/admin/components/providers"
import { AppSidebar } from "@/app/admin/components/sidebar"

// import "@/assets/styles/themes.css"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login?redirect=/admin")
  }

  // Redirect to home if not an admin
  if (user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const cookieStore = await cookies()
  const state = cookieStore.get("sidebar_state")?.value
  const defaultOpen = state ? state === "true" : true

  return (
    <Providers>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
          } as React.CSSProperties
        }
      >
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar className="hidden md:flex" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex-1 overflow-auto">
              <main className="h-full flex-1">{children}</main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </Providers>
  )
}
