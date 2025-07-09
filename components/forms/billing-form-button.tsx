"use client"

import { useTransition } from "react"
import { redirect } from "next/navigation"
import { createStripeSubscriptionSession, createStripePortalSession } from "@/actions/subscription-actions"
import { SubscriptionPlan, UserSubscription } from "@/types"
import { toast } from "sonner"

import { absoluteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"

interface BillingFormButtonProps {
  offer: SubscriptionPlan
  userSubscription: UserSubscription
  isYearly: boolean
}

export function BillingFormButton({
  isYearly,
  offer,
  userSubscription,
}: BillingFormButtonProps) {
  const [isPending, startTransition] = useTransition()

  const billingUrl = absoluteUrl("/pricing")

  const createSubscriptionSession = createStripeSubscriptionSession.bind(null, {
    priceId: offer.stripeIds[isYearly ? "yearly" : "monthly"] as string,
    successUrl: billingUrl,
    cancelUrl: billingUrl,
  })

  const createPortalSession = createStripePortalSession.bind(null, {
    userId: userSubscription.userId,
  })

  const stripeSessionAction = () =>
    startTransition(async () => {
      if (userSubscription.isPaid && userSubscription.stripeCustomerId) {
        const result = await createPortalSession()
        if (result.error) {
          toast.error(result.error || "Something went wrong. Please try again.")
          return
        }
        if (result.checkoutUrl) {
          redirect(result.checkoutUrl)
        } else {
          toast.error("Portal URL not found")
        }
      }

      // const result = await generateUserStripeSession()
      const result = await createSubscriptionSession()
      if (result.error) {
        toast.error(result.error || "Something went wrong. Please try again.")
        return
      }

      if (result.checkoutUrl) {
        // Redirect to Stripe checkout
        redirect(result.checkoutUrl)
      } else {
        toast.error("Checkout URL not found")
      }
    })

  const userOffer =
    userSubscription.stripePriceId ===
    offer.stripeIds[isYearly ? "yearly" : "monthly"] &&
    userSubscription.isPaid

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      className="w-full rounded-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.Spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
      )}
    </Button>
  )
}
