import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { UserSubscription } from "@/types"

import { pricingData } from "@/config/payments"
import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CustomerPortalButton } from "@/components/forms/customer-portal-button"

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userSubscription: UserSubscription
}

export function BillingInfo({ userSubscription }: BillingInfoProps) {
  const { stripeCustomerId, isPaid, isCanceled, currentPeriodEnd } =
    userSubscription

  const userPlan =
    pricingData.find(
      (plan) => plan.stripeIds.monthly === userSubscription.stripePriceId
    ) ||
    pricingData.find(
      (plan) => plan.stripeIds.yearly === userSubscription.stripePriceId
    )

  const plan = isPaid && userPlan ? userPlan : pricingData[0]

  if (!plan) {
    return notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          You are currently on the <strong>{plan.title}</strong> plan.
        </CardDescription>
      </CardHeader>
      <CardContent>{plan.description}</CardContent>
      <CardFooter className="bg-accent flex flex-col items-center space-y-2 border-t py-2 md:flex-row md:justify-between md:space-y-0">
        {isPaid ? (
          <p className="text-muted-foreground text-sm font-medium">
            {isCanceled
              ? "Your plan will be canceled on "
              : "Your plan renews on "}
            {currentPeriodEnd ? formatDate(currentPeriodEnd.getTime()) : "N/A"}.
          </p>
        ) : null}

        {isPaid && stripeCustomerId ? (
          <CustomerPortalButton userStripeId={stripeCustomerId} />
        ) : (
          <Link href="/pricing" className={cn(buttonVariants())}>
            Choose a plan
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
