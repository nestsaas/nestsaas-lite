import Stripe from "stripe"

import { env } from "@/env.mjs"

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
})
