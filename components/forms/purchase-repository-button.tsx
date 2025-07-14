"use client"

import { ReactNode, useState } from "react"
import { generateStripePurchase } from "@/actions/purchase-actions"
import { VariantProps } from "class-variance-authority"
import { toast } from "sonner"
import { z } from "zod"

import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"

// Define the schema for purchase data validation
const purchaseRepositorySchema = z.object({
  product: z.string().min(1, "Product name is required"),
  priceId: z.string().min(1, "Price ID is required"),
  currency: z.string().min(1, "Currency is required"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
})

type PurchaseRepositoryButtonProps = z.infer<typeof purchaseRepositorySchema>

export function PurchaseRepositoryButton({
  purchaseData,
  children,
  ...restProps
}: {
  purchaseData: PurchaseRepositoryButtonProps
  children: ReactNode
} & React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit() {
    setIsLoading(true)

    try {
      // Validate the purchase data using the schema
      const validationResult = purchaseRepositorySchema.safeParse(purchaseData)

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors
          .map((err) => `${err.path}: ${err.message}`)
          .join(", ")
        toast.error(`Validation error: ${errorMessage}`)
        return
      }

      const result = await generateStripePurchase({
        ...validationResult.data,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      if (result.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = result.checkoutUrl
      } else {
        toast.error("Failed to create checkout session. Please try again.")
      }
    } catch (error) {
      console.error("Purchase error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Button onClick={onSubmit} disabled={isLoading} {...restProps}>
        {isLoading ? (
          <>
            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>{children}</>
        )}
      </Button>
    </div>
  )
}
