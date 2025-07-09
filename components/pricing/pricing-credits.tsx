"use client"

import { useState } from 'react'
import { absoluteUrl, cn } from '@/lib/utils'
import { env } from "@/env.mjs"
import { generateStripePurchase } from '@/actions/purchase-actions'
import { CheckCircle } from 'lucide-react'
import { ExtendedUser } from '@/types/next-auth'

interface PaymentPlanCard {
  priceId: string
  name: string
  price: string
  description: string
  features: string[]
}

export const PaymentPriceId = {
  Credits10: env.NEXT_PUBLIC_STRIPE_ONE_TIME_10,
  Credits50: env.NEXT_PUBLIC_STRIPE_ONE_TIME_50,
  Credits100: env.NEXT_PUBLIC_STRIPE_ONE_TIME_100,
}

const bestDealPaymentPriceId = PaymentPriceId.Credits50

export const paymentPlanCards: Record<string, PaymentPlanCard> = {
  [PaymentPriceId.Credits10]: {
    priceId: PaymentPriceId.Credits10,
    name: '10 Credits',
    price: '10',
    description: 'One-time purchase of 10 credits for your account',
    features: ['Limited monthly usage', 'Basic support'],
  },
  [PaymentPriceId.Credits50]: {
    priceId: PaymentPriceId.Credits50,
    name: '50 Credits',
    price: '50',
    description: 'One-time purchase of 50 credits for your account',
    features: ['Unlimited monthly usage', 'Priority customer support'],
  },
  [PaymentPriceId.Credits100]: {
    priceId: PaymentPriceId.Credits100,
    name: '100 Credits',
    price: '100',
    description: 'One-time purchase of 100 credits for your account',
    features: ['Use credits for e.g. OpenAI API calls', 'No expiration date'],
  },
}

export function PricingCredits({ user }: { user: ExtendedUser | undefined }) {
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleBuyNowClick(paymentPriceId: string) {
    if (!user) return
    
    try {
      setIsPaymentLoading(true)
      setErrorMessage(null)

      const plan = paymentPlanCards[paymentPriceId]
      if (!plan) {
        throw new Error('Invalid plan selected')
      }

      const data = {
        product: 'Credits',
        priceId: paymentPriceId,
        amount: Number(plan.price),
        currency: 'USD',
        description: plan.description,
        successUrl: absoluteUrl('/pricing'),
        cancelUrl: absoluteUrl('/pricing'),
      }

      const checkoutResults = await generateStripePurchase(data)

      if (checkoutResults?.checkoutUrl) {
        window.open(checkoutResults.checkoutUrl, '_self')
      } else {
        throw new Error('Error generating checkout session URL')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start checkout')
    } finally {
      setIsPaymentLoading(false)
    }
  }

  return (
    <div className="py-10 lg:mt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-yellow-500">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            One-time purchase, buy credits
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
          Choose an affordable plan that's packed with the best features.
        </p>

        {errorMessage && (
          <div className="mt-4 text-center text-red-500">
            {errorMessage}
          </div>
        )}

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:gap-x-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {Object.values(PaymentPriceId).map((priceId) => {
            const plan = paymentPlanCards[priceId]
            if (!plan) return null
            
            const isBestDeal = priceId === bestDealPaymentPriceId
            
            return (
              <div
                key={priceId}
                className={cn(
                  'relative flex flex-col grow justify-between rounded-3xl ring-gray-900/10 dark:ring-gray-100/10 overflow-hidden p-8 xl:p-10',
                  {
                    'ring-2': isBestDeal,
                    'ring-1 lg:mt-8': !isBestDeal,
                  }
                )}
              >
                {isBestDeal && (
                  <div
                    className="absolute top-0 right-0 -z-10 w-full h-full transform-gpu blur-3xl"
                    aria-hidden="true"
                  >
                    <div
                      className='absolute w-full h-full bg-gradient-to-br from-amber-400 to-purple-300 opacity-30 dark:opacity-50'
                      style={{
                        clipPath: 'circle(670% at 50% 50%)',
                      }}
                    />
                  </div>
                )}

                <div className="mb-8">
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 id={priceId} className="text-gray-900 text-lg font-semibold leading-8 dark:text-white">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-white">
                    {plan.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1 dark:text-white">
                    <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-white">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckCircle className="h-6 w-5 flex-none text-yellow-500" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleBuyNowClick(priceId)}
                  disabled={isPaymentLoading}
                  className={cn(
                    'mt-auto block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500',
                    {
                      'bg-yellow-500 text-white hover:bg-yellow-400': isBestDeal,
                      'text-gray-600 ring-1 ring-inset ring-gray-200 hover:ring-gray-300 dark:ring-gray-700 dark:hover:ring-gray-600': !isBestDeal,
                      'opacity-50 cursor-not-allowed': isPaymentLoading,
                    }
                  )}
                >
                  {isPaymentLoading ? 'Processing...' : user ? 'Buy now' : 'Sign in to purchase'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}