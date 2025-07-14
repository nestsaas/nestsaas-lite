"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"

const generatePurchaseSchema = z.object({
  product: z.string().min(1),
  priceId: z.string().min(1),
  amount: z.number().optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
})

export type PurchaseResponse = {
  error?: string
  purchaseId?: string
  checkoutUrl?: string
}

export async function generateStripePurchase(
  data: z.infer<typeof generatePurchaseSchema>
): Promise<PurchaseResponse> {
  try {
    // Validate user authentication
    const session = await auth()
    if (!session?.user?.id) {
      return {
        error: "You must be logged in to make a purchase",
      }
    }

    // Validate input data
    const validatedData = generatePurchaseSchema.parse(data)
    const {
      product,
      priceId,
      amount = 0,
      currency = "USD",
      description = "",
      successUrl,
      cancelUrl,
    } = validatedData

    // If you want to prevent multiple purchases, you can check if the user has already made a purchase
    // Here is re-entrant, need to find if already created and status not completed or failed, if completed, return
    // If failed, need to re-pay

    // let purchase = await prisma.purchase.findFirst({
    //   where: {
    //     userId: Number(session.user.id),
    //     product,
    //     // stripePriceId: priceId,
    //   },
    //   orderBy: { createdAt: "desc" },
    // })
    // if (purchase) {
    //   if (purchase.status === "COMPLETED") {
    //     return {
    //       error: "Purchase already completed",
    //     }
    //   }
    // } else {
    //   purchase = await prisma.purchase.create({
    //     data: {
    //       product,
    //       status: "PENDING",
    //       amount,
    //       currency,
    //       description,
    //       userId: Number(session.user.id),
    //       stripePriceId: priceId,
    //     },
    //   })
    // }

    const purchase = await prisma.purchase.create({
      data: {
        product,
        status: "PENDING",
        amount,
        currency,
        description,
        userId: Number(session.user.id),
        stripePriceId: priceId,
      },
    })

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: session.user.email!,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        purchaseId: purchase.id,
        priceId,
      },
      allow_promotion_codes: true,
      // discounts: [
      //   {
      //     // coupon: "iVjuQhQn", // coupon ID
      //     promotion_code: "promo_1RHLhkFWZZWHBTTt0w0OjZ9P", // promotion code ID
      //   },
      // ],
      // // You can use custom_fields to collect additional information
      // custom_fields: [
      //   {
      //     key: "github_username",
      //     label: {
      //       type: "custom",
      //       custom: "Github Username",
      //     },
      //     type: "text",
      //   },
      // ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    // Update purchase with Stripe session ID
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        stripeSessionId: checkoutSession.id,
        stripePaymentIntentId: checkoutSession.payment_intent as string,
        metadata: {
          purchaseId: purchase.id,
        },
      },
    })

    return {
      purchaseId: purchase.id,
      checkoutUrl: checkoutSession.url || undefined,
    }
  } catch (error) {
    console.error("Purchase creation error:", error)
    return {
      error:
        error instanceof Error ? error.message : "Failed to create purchase",
    }
  }
}

/**
 * Get purchase details by ID
 */
export async function getPurchaseById(id: string) {
  try {
    // Validate user authentication
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("You must be logged in to view purchase details")
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id },
    })

    if (!purchase) {
      throw new Error("Purchase not found")
    }

    // Check if user owns this purchase or is an admin
    if (
      purchase.userId !== Number(session.user.id) &&
      session.user.role !== "ADMIN"
    ) {
      throw new Error("Unauthorized")
    }

    return purchase
  } catch (error) {
    console.error("Error fetching purchase:", error)
    throw error
  }
}

/**
 * Get all purchases for the current user
 */
export async function getUserPurchases() {
  try {
    // Validate user authentication
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("You must be logged in to view your purchases")
    }

    const purchases = await prisma.purchase.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { createdAt: "desc" },
    })

    return purchases
  } catch (error) {
    console.error("Error fetching user purchases:", error)
    throw error
  }
}

/**
 * Cancel a pending purchase
 */
export async function cancelPurchase(id: string) {
  try {
    // Validate user authentication
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("You must be logged in to cancel a purchase")
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id },
    })

    if (!purchase) {
      throw new Error("Purchase not found")
    }

    // Check if user owns this purchase
    if (
      purchase.userId !== Number(session.user.id) &&
      session.user.role !== "ADMIN"
    ) {
      throw new Error("Unauthorized")
    }

    // Only pending purchases can be canceled
    if (purchase.status !== "PENDING") {
      throw new Error("Only pending purchases can be canceled")
    }

    // Update purchase status to FAILED
    await prisma.purchase.update({
      where: { id },
      data: { status: "FAILED" },
    })

    return { success: true }
  } catch (error) {
    console.error("Error canceling purchase:", error)
    throw error
  }
}
