import type { ReactNode } from "react"

import { SiteLayout } from "@/components/layouts/site-layout"

export default function Layout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>
}
