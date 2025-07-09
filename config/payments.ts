import { PlansRow, SubscriptionPlan } from "@/types"

import { env } from "@/env.mjs"

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    plan: "Starter",
    description: "For Beginners",
    benefits: [
      "Up to 100 monthly posts",
      "Basic analytics and reporting",
      "Access to standard templates",
    ],
    limitations: [
      "No priority access to new features.",
      "Limited customer support",
      "No custom branding",
      "Limited access to business resources.",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    plan: "Pro",
    description: "Unlock Advanced Features",
    benefits: [
      "Up to 500 monthly posts",
      "Advanced analytics and reporting",
      "Access to business templates",
      "Priority customer support",
      "Exclusive webinars and training.",
    ],
    limitations: [
      "No custom branding",
      "Limited access to business resources.",
    ],
    prices: {
      monthly: 15,
      yearly: 144,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Business",
    plan: "Business",
    description: "For Power Users",
    benefits: [
      "Unlimited posts",
      "Real-time analytics and reporting",
      "Access to all templates, including custom branding",
      "24/7 business customer support",
      "Personalized onboarding and account management.",
    ],
    limitations: [],
    prices: {
      monthly: 30,
      yearly: 300,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
]

export const plansColumns = [
  "starter",
  "pro",
  "business",
  "enterprise",
] as const

export const comparePlans: PlansRow[] = [
  {
    feature: "Access to Analytics",
    starter: true,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "All plans include basic analytics for tracking performance.",
  },
  {
    feature: "Custom Branding",
    starter: null,
    pro: "500/mo",
    business: "1,500/mo",
    enterprise: "Unlimited",
    tooltip: "Custom branding is available from the Pro plan onwards.",
  },
  {
    feature: "Priority Support",
    starter: null,
    pro: "Email",
    business: "Email & Chat",
    enterprise: "24/7 Support",
  },
  {
    feature: "Advanced Reporting",
    starter: null,
    pro: null,
    business: true,
    enterprise: "Custom",
    tooltip:
      "Advanced reporting is available in Business and Enterprise plans.",
  },
  {
    feature: "Dedicated Manager",
    starter: null,
    pro: null,
    business: null,
    enterprise: true,
    tooltip: "Enterprise plan includes a dedicated account manager.",
  },
  {
    feature: "API Access",
    starter: "Limited",
    pro: "Standard",
    business: "Enhanced",
    enterprise: "Full",
  },
  {
    feature: "Monthly Webinars",
    starter: false,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "Pro and higher plans include access to monthly webinars.",
  },
  {
    feature: "Custom Integrations",
    starter: false,
    pro: false,
    business: "Available",
    enterprise: "Available",
    tooltip:
      "Custom integrations are available in Business and Enterprise plans.",
  },
  {
    feature: "Roles and Permissions",
    starter: null,
    pro: "Basic",
    business: "Advanced",
    enterprise: "Advanced",
    tooltip:
      "User roles and permissions management improves with higher plans.",
  },
  {
    feature: "Onboarding Assistance",
    starter: false,
    pro: "Self-service",
    business: "Assisted",
    enterprise: "Full Service",
    tooltip: "Higher plans include more comprehensive onboarding assistance.",
  },
  // Add more rows as needed
]

// Get credits for a given price ID
export function getCreditsForPrice(priceId: string, isSubscription: boolean = false): number {
  const SUBSCRIPTION_CREDITS: Record<string, number> = {
    [env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID]: 10,
    [env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID]: 120,
    [env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID]: 30,
    [env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID]: 360
  }

  const ONE_TIME_CREDITS: Record<string, number> = {
    [env.NEXT_PUBLIC_STRIPE_ONE_TIME_10]: 10,
    [env.NEXT_PUBLIC_STRIPE_ONE_TIME_50]: 60,
    [env.NEXT_PUBLIC_STRIPE_ONE_TIME_100]: 100,
  }

  return isSubscription 
    ? SUBSCRIPTION_CREDITS[priceId] || 0
    : ONE_TIME_CREDITS[priceId] || 0
}

/**
 * Code repository configuration for purchase
 *
 * the repository should be within the same github account as env.GITHUB_TOKEN configured
 * the repository should be private
 */

export interface CodeRepository {
  id: string
  product: string
  name: string
  description: string
  owner: string
  repo: string
  currency: string
  pro: {
    priceId: string
    priceOrigin: number
    price: number
  }
  enterprise: {
    priceId: string
    priceOrigin: number
    price: number
  }
}

/**
 * Code repository for purchase
 */
export const codeRepository: CodeRepository = {
  id: "nestsaas",
  product: "nestsaas",
  name: "NestSaaS Complete Code",
  description:
    "Get the complete source code of NestSaaS, including all features and components",
  owner: "nestsaas",
  repo: "nestsaas",

  pro: {
    priceId: "price_1RHIl0FWZZWHBTTtoPT7O8wX",
    priceOrigin: 299,
    price: 139,
  },
  enterprise: {
    priceId: "price_1RHIl0FWZZWHBTTtoPT7O8wX",
    priceOrigin: 599,
    price: 369,
  },

  currency: "USD",
}
