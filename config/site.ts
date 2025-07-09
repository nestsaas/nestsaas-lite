import { FooterColumn, FooterLink, NavItem, SiteConfig } from "@/types"

import { env } from "@/env.mjs"

const site_url = env.NEXT_PUBLIC_APP_URL

// Extract domain name from site_url
const domainName = new URL(site_url).hostname.replace(/^www\./, "")

export const siteConfig: SiteConfig = {
  name: "NestSaaS",
  domainName: domainName,
  url: site_url,
  title: "NestSaaS: Modern Framework for AI SaaS",
  description:
    "NestSaaS is a modern framework for building AI SaaS applications. Featuring Auth, Payments, CMS, Blog, SEO, themes, and extensibility. Build, scale, and succeed with ease.",
  keywords: [
    "NestSaaS",
    "SaaS framework",
    "AI SaaS",
    "CMS",
    "blog tools",
    "authentication",
    "payment processing",
    "SEO optimization",
    "SEO",
    "customizable themes",
    "web development",
    "website framework",
    "SaaS development",
    "extensible framework",
    "build websites",
    "build SaaS",
    "web framework",
    "modern framework",
    "management tools",
  ],
  creator: "ShawnHacks",
  ogImage: `${site_url}/og.png`,
  links: {
    twitter: "https://x.com/intent/user?&region=follow&screen_name=ShawnHacks",
    github: "https://github.com/nestsaas/nestsaas",
  },
  mailSupport: "support@nestsaas.com",

  lang: "en",
}

export const siteMainNav: NavItem[] = [
  {
    title: "AI Image Edit (Demo App)",
    href: "/demo",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Documentation",
    href: "/docs",
  },
  {
    title: "Blog",
    href: "/blog",
  },
]

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "License", href: "/license" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "NestSaaS", href: "https://nestsaas.com" },
      { label: "AIHuntList", href: "https://aihuntlist.com" },
      { label: "Gemlink.app", href: "https://gemlink.app" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      {
        label: "Roadmap",
        href: "https://github.com/orgs/nestsaas/projects/2/views/3",
      },
    ],
  },
]

export const bottomLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]
