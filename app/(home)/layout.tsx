import { SiteLayout } from "@/components/layouts/site-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>
}
