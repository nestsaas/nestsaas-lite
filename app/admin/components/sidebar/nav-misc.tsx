"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem } from "@/types"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Icons } from "@/components/shared/icons"

export function NavMisc({ items }: { items?: NavItem[] }) {
  const currentUrl = usePathname()
  if (!items || items.length === 0) return null
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Data Management</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item) => {
          const Icon = Icons[item.icon || "ArrowRight"]
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
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
