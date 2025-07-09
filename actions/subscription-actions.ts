"use server"

import { UserSubscription } from "@/types"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import Stripe from "stripe"

export type SubscriptionResponse = {
  error?: string
  subscriptionId?: string
  checkoutUrl?: string
}

const generateSubscriptionSchema = z.object({
  priceId: z.string().min(1),
  successUrl: z.string().min(1),
  cancelUrl: z.string().min(1),
})

export async function createStripeSubscriptionSession(
  data: z.infer<typeof generateSubscriptionSchema>
): Promise<SubscriptionResponse> {
  let redirectUrl: string = ""

  try {
    const session = await auth()
    const sessionUser = session?.user

    if (!sessionUser || !sessionUser.email || !sessionUser.id) {
      throw new Error("Unauthorized")
    }

    const validatedData = generateSubscriptionSchema.parse(data)
    const {
      priceId,
      successUrl,
      cancelUrl,
    } = validatedData

    const user = await prisma.user.findUnique({
      where: {
        id: Number(sessionUser.id),
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    let stripeCustomerId = user.stripeCustomerId

    // Create a new Stripe customer if this user doesn't have one
    if (!stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        email: user.email as string,
        metadata: {
          userId: user.id, // DO NOT FORGET THIS
        },
      });

      await prisma.user.update({
        where: {
          id: Number(sessionUser.id),
        },
        data: {
          stripeCustomerId: newCustomer.id,
        },
      })

      stripeCustomerId = newCustomer.id
    }

    let subscription: Partial<UserSubscription> | null = await prisma.subscription.findUnique({
      where: {
        userId: Number(user.id),
      },
    })
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: Number(user.id),
          stripePriceId: priceId,
          stripeCustomerId: stripeCustomerId,
          status: "pending",
          stripeSubscriptionId: "", // will be set by webhook
          interval: "", // will be set by webhook
          currentPeriodEnd: null, // will be set by webhook
          cancelAtPeriodEnd: false,
          extra: {},
        },
      })
    }

    // Check if user already has an active subscription to this plan
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all', // 也可以限制为 active/unpaid/trialing
      expand: ['data.items'],
    });
    
    const hasActiveSubscription = subscriptions.data.some((sub) =>
      sub.items.data.some((item) => item.price.id === priceId && sub.status === 'active')
    );
    
    if (hasActiveSubscription) {
      throw new Error("You already have an active subscription to this plan.")
    }

    // Create a checkout session.
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        subscriptionId: subscription.id,
        priceId: priceId,
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          subscriptionId: subscription.id,
          priceId: priceId,
          userId: user.id,
        },
      }
    } as Stripe.Checkout.SessionCreateParams)

    redirectUrl = checkoutSession.url as string
    
    return {
      subscriptionId: subscription.id,
      checkoutUrl: redirectUrl,
    }
  } catch (error) {
    console.error(error)
    return {
      error: "Failed to create stripe checkout session",
    }
  }
}

// TODO: test this function
export async function createStripePortalSession({
  userId,
}: {
  userId?: number
}): Promise<SubscriptionResponse> {
  try {
    if (!userId) {
      const session = await auth()
      const user = session?.user
      if (!user || !user.id) {
        throw new Error("Unauthorized")
      }
      userId = Number(user.id)
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    const stripeCustomerId = user?.stripeCustomerId
    if (!stripeCustomerId) {
      throw new Error("User has no payment customer ID")
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: absoluteUrl("/dashboard"),
    })

    return { checkoutUrl: portalSession.url}
  } catch (error) {
    console.error(error)
    return {
      error: "Failed to create stripe portal session",
    }
  }
}

export async function getUserSubscription({
  userId,
}: {
  userId: number
}): Promise<UserSubscription> {
  if (!userId) throw new Error("Missing parameters")

  // Get the most recent (active) subscription for this user and service
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // If no subscription, treat as free plan
  if (!subscription) {
    return {
      id: "",
      userId,
      interval: "",
      isPaid: false,
      isCanceled: false,
      status: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      currentPeriodStart: null,
      currentPeriodEnd: null, // Use null instead of Date object
      stripeSubscriptionId: "",
      stripeCustomerId: "",
      stripePriceId: "",
    } as UserSubscription
  }

  // Check if user is on a paid plan.
  const isPaid =
    subscription.stripePriceId &&
    (subscription.currentPeriodEnd?.getTime() ?? 0) + 86_400_000 > Date.now()
      ? true
      : false

  let isCanceled = false
  if (isPaid && subscription.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }

  return {
    ...subscription,
    isPaid,
    isCanceled,
  }
}
