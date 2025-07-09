"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSelectedLayoutSegment } from "next/navigation"
import logo from "@/public/logo.png"
import { NavItem } from "@/types"
import { ChevronDown, Sprout } from "lucide-react"
import { useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { useScroll } from "@/lib/hooks/use-scroll"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAccountNav } from "@/components/layouts/user-account-nav"
import { Icons } from "@/components/shared/icons"

interface SiteHeaderProps {
  navItems?: NavItem[]
  showSearch?: boolean
  className?: string
  scroll?: boolean
}

export function SiteHeader({
  navItems = [],
  showSearch = true,
  className,
  scroll = false,
}: SiteHeaderProps) {
  const scrolled = useScroll(50)
  const router = useRouter()
  const { data: session, status } = useSession()

  const selectedLayout = useSelectedLayoutSegment()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }

  const isActive = (href: string) => {
    return href.startsWith(`/${selectedLayout}`)
  }

  return (
    <header
      className={cn(
        "bg-background/60 sticky top-0 z-40 w-full backdrop-blur-xl transition-all",
        scroll
          ? scrolled
            ? "border-b backdrop-blur-xl"
            : "bg-transparent"
          : "border-b",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <Image src={logo} width={32} height={32} alt={siteConfig.name} />
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tighter">
                {siteConfig.name}
                <sup className="ml-1 text-xs text-muted-foreground">Lite</sup>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => {
              const active = isActive(item.href)

              if (item.children) {
                return (
                  <div key={item.title} className="relative">
                    <button
                      className={cn(
                        "hover:text-foreground/80 flex items-center space-x-1 text-sm font-medium transition-colors",
                        active ? "text-foreground" : "text-foreground/60",
                        item.disabled && "cursor-not-allowed opacity-80"
                      )}
                      onClick={() => toggleDropdown(item.title)}
                    >
                      <span>{item.title}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {openDropdown === item.title && (
                      <div className="bg-background absolute top-full left-0 z-10 mt-2 w-48 rounded-md border p-2 shadow-md">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "hover:bg-muted block rounded-md px-3 py-2 text-sm",
                              isActive(child.href)
                                ? "bg-muted font-medium"
                                : "",
                              child.disabled && "cursor-not-allowed opacity-80"
                            )}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "hover:text-foreground/80 flex items-center text-lg font-medium transition-colors sm:text-sm",
                    active ? "text-foreground" : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <div className="flex items-center space-x-1">
                {/* <Sprout /> */}
                <span className="text-sm font-medium">Credits:</span>
                <span className="text-sm font-bold text-orange-400">{session.user.credits}</span>
              </div>
              <div className="hidden md:block">
                <UserAccountNav />
              </div>
            </>
          ) : status === "unauthenticated" ? (
            <Button
              className="hidden gap-2 rounded-full px-5 md:flex"
              variant="default"
              size="sm"
              onClick={() => {
                const currentPath =
                  window.location.pathname + window.location.search
                router.push(
                  `/login?redirect=${encodeURIComponent(currentPath)}`
                )
              }}
            >
              <span>Sign In</span>
              <Icons.ArrowRight className="size-4" />
            </Button>
          ) : (
            <Skeleton className="hidden h-9 w-28 rounded-full lg:flex" />
          )}
        </div>
      </div>
    </header>
  )
}
