"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import logo from "@/public/icon-192.png"
import { Command } from "lucide-react"

import { adminPanelConfig as data } from "@/config/adminpanel"
import { siteConfig } from "@/config/site"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { NavMain } from "./nav-main"
import { NavMisc } from "./nav-misc"
import { NavUser } from "./nav-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* <Command className="size-4" /> */}
                  <Image
                    src={logo}
                    alt={siteConfig.name}
                    width={32}
                    height={32}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {siteConfig.name}
                  </span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navContent} />
        <NavMisc items={data.navMisc} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
