import { Metadata } from "next"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatDate(input: string | number | Date): string {
  const dateObj =
    typeof input === "string" || typeof input === "number"
      ? new Date(input)
      : input
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0"
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0"
}

export function getHostnameFromUrl(url: string): string {
  try {
    if (!url) return ""
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return new URL(url).hostname
    }
    return url
  } catch (error) {
    console.error(`Invalid URL: ${url}`, error)
    return "" // Return an empty string or a default value
  }
}

export function getUrlWithTrack(
  url: string,
  utmMedium: string = "cpc",
  utmCampaign: string = "navigation"
): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const utmSource = siteConfig.domainName.toLowerCase()
    const urlObj = new URL(url)

    // Skip adding tracking parameters if URL already has query parameters
    if (urlObj.search) {
      return url
    }

    return `${url}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`
  }
  return url
}

export function resolveMediaUrl(url: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }
  return `${siteConfig.url}${url}`
}

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  keywords = siteConfig.keywords,
  image = siteConfig.ogImage,
  noIndex = false,
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    applicationName: siteConfig.name,
    keywords,
    authors: [
      {
        name: siteConfig.creator,
      },
    ],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title,
      images: [image],
      description,
      siteName: title,
    },
    twitter: {
      site: siteConfig.url,
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: siteConfig.creator,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/icon-192.png",
      apple: "/apple-touch-icon.png",
    },

    manifest: `${siteConfig.url}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
  }

  if (url.startsWith("/_static/")) {
    url = `${siteConfig.url}${url}`
  }

  try {
    const response = await fetch(`https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`)
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")

    return `data:image/png;base64,${base64}`
  } catch (error) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
  }
}

export const placeholderBlurhash =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg=="
