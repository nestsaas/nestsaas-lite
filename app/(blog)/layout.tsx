import { SiteLayout } from "@/components/layouts/site-layout"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <SiteLayout>
      <MaxWidthWrapper className="min-h-screen" large>
        {children}
      </MaxWidthWrapper>
    </SiteLayout>
  )
}
