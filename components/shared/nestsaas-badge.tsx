// "use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

interface NestSaaSBadgeProps {
  className?: string
  variant?: "default" | "minimal" | "pill"
  size?: "sm" | "md" | "lg"
}

/**
 * A badge component that can be added to any website built with NestSaaS
 * This component can be exported and used in any project
 */
export function NestSaaSBadge({
  className = "",
  variant = "default",
  size = "md",
}: NestSaaSBadgeProps) {
  // Base styles for different variants
  const variantStyles = {
    default: `inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border border-border px-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors`,
    minimal: `inline-flex flex-shrink-0 items-center gap-1.5 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors`,
    pill: `inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-muted text-muted-foreground hover:border-foreground hover:text-foreground transition-colors`,
  }

  // Size configurations
  const sizeStyles = {
    sm: {
      container: "h-6 px-2 text-xs",
      logoSize: 16,
    },
    md: {
      container: "h-8 px-3 text-sm",
      logoSize: 20,
    },
    lg: {
      container: "h-10 px-4 text-base",
      logoSize: 24,
    },
  }

  // Logo URL - using a data URL to ensure the component is self-contained
  // This is a placeholder - in a real implementation, you'd use the actual NestSaaS logo
  const logoUrl = "https://nestsaas.com/logo.png"

  return (
    <Link
      href="https://nestsaas.com?ref=built-with"
      target="_blank"
      rel="noopener noreferrer"
      className={`${variantStyles[variant]} ${sizeStyles[size].container} ${className}`}
    >
      <span className="font-medium">Built with</span>
      <div className="flex items-center gap-1">
        <div
          className="relative"
          style={{
            width: sizeStyles[size].logoSize,
            height: sizeStyles[size].logoSize,
          }}
        >
          <Image
            src={logoUrl}
            alt="NestSaaS"
            width={sizeStyles[size].logoSize}
            height={sizeStyles[size].logoSize}
            unoptimized
          />
        </div>
        <span className="font-semibold">NestSaaS</span>
      </div>
    </Link>
  )
}
