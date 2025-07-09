import Link from "next/link"
import { Check, CircleCheckBig } from "lucide-react"

import { codeRepository } from "@/config/payments"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import JoinWaitlist from "@/components/forms/join-waitlist"
import { PurchaseRepositoryButton } from "@/components/forms/purchase-repository-button"
import { HeaderSection } from "@/components/shared/header-section"

export default function Pricing() {
  const hasFreePlan = true
  const isWaiting = true
  return (
    <section id="pricing" className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* {hasFreePlan && (
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <h1 className="font-heading text-center text-3xl md:text-4xl lg:text-[40px]">
              Build and launch faster.
            </h1>
            <p className="text-muted-foreground mt-6 text-lg text-balance">
              From zero to launch in days. Save time, reduce costs, and focus on
              what really matters: building a product users love.
            </p>
          </div>
        )} */}

        <HeaderSection
          label="Pricing"
          title="Build and launch faster."
          subtitle="From zero to launch in days. Save time, reduce costs, and focus on
            what really matters: building a product users love."
        />

        <div
          className={cn(
            "mt-8 grid gap-6 md:mt-20",
            hasFreePlan ? "md:grid-cols-3" : "md:grid-cols-2"
          )}
        >
          {hasFreePlan && (
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">Free</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  $0
                </span>
                <CardDescription className="text-sm">
                  NestSaaS Lite
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />

                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "NestSaaS Lite Open Source with MIT License",
                    "Free to use for personal and commercial use",
                    "Stripe payments integration",
                    "Blog and documentation with content-collection",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CircleCheckBig className="size-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link href="https://github.com/nestsaas/nestsaas-lite" target="_blank">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card className="relative">
            <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-linear-to-br/increasing from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-white/20 ring-offset-1 ring-offset-gray-950/5 ring-inset">
              Popular
            </span>

            <div className="flex flex-col gap-y-6">
              <CardHeader>
                <CardTitle className="font-medium">Pro</CardTitle>
                <div className="my-5 flex items-end">
                  <span className="block text-3xl leading-6 font-semibold">
                    <s className="line-through">
                      ${codeRepository.pro.priceOrigin}
                    </s>{" "}
                    ${codeRepository.pro.price}
                  </span>
                  <div className="text-muted-foreground -mb-1 ml-2 text-left text-sm font-medium">
                    <div>/ lifetime</div>
                  </div>
                </div>

                <CardDescription className="text-sm">
                  Plan for individual developers.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "Complete NestSaaS codebase",
                    "Lifetime license",
                    "Build unlimited products",
                    "Access to 1 user",
                    "Updates with no extra cost",
                    "Email and Community Support",
                    "Showcase your products on the NestSaaS",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CircleCheckBig className="size-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isWaiting ? (
                  <JoinWaitlist triggerText="Get Early Access" />
                ) : (
                  <PurchaseRepositoryButton
                    size="lg"
                    variant="default"
                    className="w-full"
                    purchaseData={{
                      product: codeRepository.product,
                      priceId: codeRepository.pro.priceId,
                      currency: codeRepository.currency,
                      amount: codeRepository.pro.price,
                      description: codeRepository.description,
                    }}
                  >
                    Buy NestSaaS Pro
                  </PurchaseRepositoryButton>
                )}
              </CardFooter>
            </div>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Enterprise</CardTitle>
              <div className="my-5 flex items-end">
                <span className="block text-3xl leading-6 font-semibold">
                  <s className="line-through">
                    ${codeRepository.enterprise.priceOrigin}
                  </s>{" "}
                  ${codeRepository.enterprise.price}
                </span>
                <div className="text-muted-foreground -mb-1 ml-2 text-left text-sm font-medium">
                  <div>/ lifetime</div>
                </div>
              </div>
              <CardDescription className="text-sm">
                Plan for teams and enterprise.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Pro Plan",
                  "Collaborators access up to 5 members",
                  "Private Discord Threads",
                  "Upcoming premium space templates",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CircleCheckBig className="size-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              {isWaiting ? (
                <JoinWaitlist triggerText="Get Early Access" />
              ) : (
                <PurchaseRepositoryButton
                  size="lg"
                  variant="outline"
                  className="w-full"
                  purchaseData={{
                    product: codeRepository.product,
                    priceId: codeRepository.enterprise.priceId,
                    currency: codeRepository.currency,
                    amount: codeRepository.enterprise.price,
                    description: codeRepository.description,
                  }}
                >
                  Buy NestSaaS Enterprise
                </PurchaseRepositoryButton>
              )}
            </CardFooter>
          </Card>
        </div>
        <div className="text-muted-foreground mt-4 text-sm">
          Prices in USD. VAT may apply.
        </div>
      </div>
    </section>
  )
}
