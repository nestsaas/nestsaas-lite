"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem } from "@/types"
import { ChevronRight } from "lucide-react"

import { adminPanelConfig as data } from "@/config/adminpanel"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Icons } from "@/components/shared/icons"

export function NavMain({ items }: { items: NavItem[] }) {
  const { navDashboard } = data
  const DashboardIcon = Icons[navDashboard.icon || "LayoutDashboard"]
  const currentUrl = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Content</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem className="">
          <SidebarMenuButton asChild>
            <Link href={navDashboard.href}>
              <DashboardIcon />
              <span>{navDashboard.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {items.map((item) => {
          const Icon = Icons[item.icon || "ArrowRight"]
          if (Array.isArray(item.children) && item.children?.length > 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  <Icon />
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>

                <SidebarMenuSub>
                  {item.children?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={subItem.href === currentUrl}
                      >
                        <Link href={subItem.href}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            )
          } else {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.href === currentUrl}>
                  <Link href={item.href}>
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
