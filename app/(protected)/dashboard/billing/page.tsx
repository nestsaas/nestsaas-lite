import { redirect } from "next/navigation"
import { getUserSubscription } from "@/actions/subscription-actions"
import { UserSubscription } from "@/types"

import { getCurrentUser } from "@/lib/session"
import { constructMetadata } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DashboardHeader } from "@/components/dashboard/header"
import { BillingInfo } from "@/components/pricing/billing-info"
import { Icons } from "@/components/shared/icons"

export const metadata = constructMetadata({
  title: `Billing`,
  description: "Manage billing and your subscription plan.",
})

export default async function BillingPage() {
  const user = await getCurrentUser()

  let userSubscription: UserSubscription | undefined
  if (user && user.id) {
    userSubscription = await getUserSubscription({
      userId: Number(user.id),
    })
  } else {
    redirect("/login")
  }

  return (
    <>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.Warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription className="text-balance">
            This site is a demo app using a Stripe test environment. You can
            find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert>
        <p>Your Current Credit: {user?.credits || 0}</p>
        <BillingInfo userSubscription={userSubscription} />
      </div>
    </>
  )
}
