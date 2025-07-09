"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserSubscription } from "@/types"

import { SubscriptionPlan } from "@/types/index"
import { siteConfig } from "@/config/site"
import { pricingData } from "@/config/payments"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BillingFormButton } from "@/components/forms/billing-form-button"
import { HeaderSection } from "@/components/shared/header-section"
import { Icons } from "@/components/shared/icons"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

interface PricingCardsProps {
  userId?: string
  userSubscription?: UserSubscription
}

export function PricingCards({ userId, userSubscription }: PricingCardsProps) {
  const router = useRouter()
  const isYearlyDefault =
    !userSubscription?.stripeCustomerId || userSubscription.interval === "year"
      ? true
      : false
  const [isYearly, setIsYearly] = React.useState<boolean>(!!isYearlyDefault)

  const toggleBilling = () => {
    setIsYearly(!isYearly)
  }

  const PricingCard = ({ offer }: { offer: SubscriptionPlan }) => {
    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm",
          offer.title.toLocaleLowerCase() === "pro"
            ? "-m-0.5 border-2 border-purple-400"
            : ""
        )}
        key={offer.title}
      >
        <div className="bg-muted/50 min-h-[150px] items-start space-y-4 p-6">
          <p className="font-urban text-muted-foreground flex text-sm font-bold tracking-wider uppercase">
            {offer.title}
          </p>

          <div className="flex flex-row">
            <div className="flex items-end">
              <div className="flex text-left text-3xl leading-6 font-semibold">
                {isYearly && offer.prices.monthly > 0 ? (
                  <>
                    <span className="text-muted-foreground/80 mr-2 line-through">
                      ${offer.prices.monthly}
                    </span>
                    <span>${offer.prices.yearly / 12}</span>
                  </>
                ) : (
                  `$${offer.prices.monthly}`
                )}
              </div>
              <div className="text-muted-foreground -mb-1 ml-2 text-left text-sm font-medium">
                <div>/month</div>
              </div>
            </div>
          </div>
          {offer.prices.monthly > 0 ? (
            <div className="text-muted-foreground text-left text-sm">
              {isYearly
                ? `$${offer.prices.yearly} will be charged when annual`
                : "when charged monthly"}
            </div>
          ) : null}
        </div>

        <div className="flex h-full flex-col justify-between gap-16 p-6">
          <ul className="space-y-2 text-left text-sm leading-normal font-medium">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-3" key={feature}>
                <Icons.Check className="size-5 shrink-0 text-purple-500" />
                <p>{feature}</p>
              </li>
            ))}

            {offer.limitations.length > 0 &&
              offer.limitations.map((feature) => (
                <li
                  className="text-muted-foreground flex items-start"
                  key={feature}
                >
                  <Icons.Close className="mr-3 size-5 shrink-0" />
                  <p>{feature}</p>
                </li>
              ))}
          </ul>

          {userId && userSubscription ? (
            offer.title === "Starter" ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "w-full rounded-full"
                )}
              >
                Go to dashboard
              </Link>
            ) : (
              <BillingFormButton
                isYearly={isYearly}
                offer={offer}
                userSubscription={userSubscription}
              />
            )
          ) : (
            <Button
              variant={
                offer.title.toLocaleLowerCase() === "pro"
                  ? "default"
                  : "outline"
              }
              className="rounded-full"
              onClick={() => {
                router.push("/login?redirect=/pricing")
              }}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center">
        <HeaderSection
          label="Pricing (Demo Mode)"
          title="Start at full speed by subscribing!"
        />

        <div className="mt-10 mb-4 flex items-center gap-5">
          <ToggleGroup
            type="single"
            size="sm"
            defaultValue={isYearly ? "yearly" : "monthly"}
            onValueChange={toggleBilling}
            aria-label="toggle-year"
            className="bg-background *:text-muted-foreground h-9 overflow-hidden rounded-full border p-1 *:h-7"
          >
            <ToggleGroupItem
              value="yearly"
              className="data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground rounded-full px-5 first:rounded-l-full last:rounded-r-full"
              aria-label="Toggle yearly billing"
            >
              Yearly (-20%)
            </ToggleGroupItem>
            <ToggleGroupItem
              value="monthly"
              className="data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground rounded-full px-5 first:rounded-l-full last:rounded-r-full"
              aria-label="Toggle monthly billing"
            >
              Monthly
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid gap-5 bg-inherit py-5 lg:grid-cols-3">
          {pricingData.map((offer) => (
            <PricingCard offer={offer} key={offer.title} />
          ))}
        </div>

        <p className="text-muted-foreground mt-3 text-center text-base text-balance">
          Email{" "}
          <a
            className="text-primary font-medium hover:underline"
            href={`mailto:${siteConfig.mailSupport}`}
          >
            {siteConfig.mailSupport}
          </a>{" "}
          for to contact our support team.
          <br />
          <br />
          <strong>
            This is a demo using a Stripe test environment. You can test the
            subscriptions and won&apos;t be charged.
            <br />
            You can find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
          </strong>
        </p>

        {/* <Alert className="!pl-14">
          <Icons.Warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription className="text-balance">
            This is a demo app using a Stripe test environment. You can find a
            list of test card numbers on the{" "}
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
        </Alert> */}
      </section>
    </MaxWidthWrapper>
  )
}
