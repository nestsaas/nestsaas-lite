import React from "react"
import Image from "next/image"
import Link from "next/link"
import logo from "@/public/logo.png"
import { FooterColumn, FooterLink } from "@/types"

import { bottomLinks, footerColumns, siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { NestSaaSBadge } from "@/components/shared/nestsaas-badge"

import { ModeToggle } from "./mode-toggle"

interface SiteFooterProps {
  copyright?: string
  className?: string
}

export function SiteFooter({
  copyright = `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
  className,
}: SiteFooterProps) {
  return (
    <footer
      className={cn("bg-background w-full border-t pt-12 text-sm", className)}
    >
      <div className="container pb-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo and description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-2">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={logo}
                  width={20}
                  height={20}
                  alt={siteConfig.name}
                  className="h-6 w-6"
                />
                <span className="text-lg font-bold">{siteConfig.name}</span>
              </Link>
            </div>
            <p className="text-muted-foreground mb-4 max-w-sm leading-loose">
              {siteConfig.description}
            </p>
            <NestSaaSBadge variant="default" size="sm" />
          </div>

          {/* Footer columns */}
          {footerColumns.map((column, index) => (
            <div key={index} className="col-span-1">
              <h3 className="mb-3 text-base font-medium">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section with copyright and links */}
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-muted-foreground text-center text-sm">
            {copyright}
          </p>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {bottomLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* <div className="flex-shrink-0">
              <BuiltWithNestSaaS size="sm" />
            </div> */}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </footer>
  )
}
