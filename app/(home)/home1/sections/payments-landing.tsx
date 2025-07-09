import Image from "next/image"
import { Cpu, ShoppingBag, Zap } from "lucide-react"

export default function PaymentsSection() {
  return (
    <section id="payments" className="relative py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="font-heading relative z-10 max-w-xl text-4xl lg:text-5xl">
          Payments and billing with Stripe integration
        </h2>
        <div className="relative">
          <div className="relative z-10 space-y-4 md:w-1/2">
            <p className="text-body">
              Seamlessly handle one-time payments and subscriptions with
              built-in Stripe integration.
            </p>
            <p>
              Includes webhook handling, real-time payment status updates,
              subscription management, and post-payment delivery logic.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="size-4" />
                  <h3 className="text-sm font-medium">
                    Subscriptions & billing
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Supports multiple services with different tiers and plans, and
                  a customer portal for seamless billing management.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-4" />
                  <h3 className="text-sm font-medium">One-time orders</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Easily supports one-time purchases — perfect for selling code
                  and digital products.
                </p>
              </div>
            </div>
          </div>
          <div className="right-0 mt-12 h-fit md:absolute md:inset-x-0 md:-inset-y-0 md:-mt-10">
            <div
              aria-hidden
              className="to-background absolute inset-0 z-1 hidden bg-linear-to-l from-transparent to-55% md:block"
            ></div>
            <div className="border-border/50 relative flex justify-center rounded-2xl border border-dotted p-2 md:justify-end">
              <Image
                src="/images/landingpage/stripecheckout.jpg"
                className="hidden rounded-[12px] dark:block"
                alt="payments illustration dark"
                width={450}
                height={450}
              />
              <Image
                src="/images/landingpage/stripecheckout.jpg"
                className="rounded-[12px] shadow dark:hidden"
                alt="payments illustration light"
                width={450}
                height={450}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
