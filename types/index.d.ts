import { Subscription, User } from "@prisma/client"
import type { Icon } from "lucide-react"

import { Icons } from "@/components/shared/icons"

export type SiteConfig = {
  name: string
  domainName: string
  title: string
  description: string
  creator: string
  keywords: string[]
  url: string
  ogImage: string
  mailSupport: string
  links: {
    twitter: string
    github: string
  }
  lang: string
}

export type BaseNavItem = {
  title: string
  href: string
}
export type NavItem = BaseNavItem & {
  external?: boolean
  defaultOpen?: boolean
  icon?: keyof typeof Icons
  badge?: number
  disabled?: boolean
  authorizeOnly?: UserRole
  children?: NavItem[]
}

export type MainNavItem = NavItem

export type SidebarNavItem = NavItem

export type FooterLink = {
  label: string
  href: string
}

export type FooterColumn = {
  title: string
  links: FooterLink[]
}

export type AdminPanelConfig = {
  navDashboard: NavItem
  navContent: NavItem[]
  navMisc?: NavItem[]
}

export type DocsConfig = {
  sidebarNav: NavItem[]
}

// subcriptions
export type SubscriptionPlan = {
  title: string
  plan: string
  description: string
  benefits: string[]
  limitations: string[]
  prices: {
    monthly: number
    yearly: number
  }
  stripeIds: {
    monthly: string | null
    yearly: string | null
  }
}


export type UserSubscription = Subscription & {
  isPaid: boolean
  isCanceled?: boolean
}

// compare plans
export type ColumnType = string | boolean | null
export type PlansRow = { feature: string; tooltip?: string } & {
  [key in (typeof plansColumns)[number]]: ColumnType
}

// landing sections
export type InfoList = {
  icon: keyof typeof Icons
  title: string
  description: string
}

export type InfoLdg = {
  title: string
  image: string
  description: string
  list: InfoList[]
}

export type FeatureLdg = {
  title: string
  description: string
  link: string
  icon: keyof typeof Icons
}

export type TestimonialType = {
  name: string
  job: string
  image: string
  review: string
}
