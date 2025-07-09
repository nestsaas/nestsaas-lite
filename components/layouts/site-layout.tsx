import { NavItem } from "@/types"

import { siteMainNav } from "@/config/site"
import { NavMobile } from "@/components/layouts/mobile-nav"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

interface SiteLayoutProps {
  navItems?: NavItem[]
  children: React.ReactNode
}

export function SiteLayout({ children, navItems }: SiteLayoutProps) {
  const finalNavItems = navItems || siteMainNav
  return (
    <div className="flex min-h-screen flex-col">
      <NavMobile navItems={finalNavItems} />
      <SiteHeader navItems={finalNavItems} scroll={false} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
