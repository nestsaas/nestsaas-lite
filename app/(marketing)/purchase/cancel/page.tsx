import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cancelPurchase, getPurchaseById } from "@/actions/purchase-actions"
import { XCircle } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Purchase Cancelled",
  description: "Your purchase has been cancelled.",
}

interface CancelPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function CancelPage({ searchParams }: CancelPageProps) {
  const purchaseId = (await searchParams).id

  if (!purchaseId) {
    return notFound()
  }

  try {
    // Get purchase details
    const purchase = await getPurchaseById(purchaseId)
    if (!purchase) {
      return notFound()
    }

    // Cancel the purchase if it's still pending
    if (purchase.status === "PENDING") {
      await cancelPurchase(purchaseId)
    }

    return (
      <div className="container max-w-lg py-10">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Purchase Cancelled</CardTitle>
            <CardDescription>
              Your purchase has been cancelled. No payment has been processed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Purchase Details</h3>
                <p className="text-muted-foreground text-sm">
                  {purchase.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Amount</p>
                  <p className="text-muted-foreground">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: purchase.currency,
                    }).format(purchase.amount.toNumber())}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-muted-foreground capitalize">
                    {purchase.status.toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Order ID</p>
                  <p className="text-muted-foreground truncate">
                    {purchase.id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Link href="/dashboard" className={buttonVariants()}>
              Return to Dashboard
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  } catch (error) {
    return (
      <div className="container max-w-lg py-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Purchase Cancelled</CardTitle>
            <CardDescription>
              We couldn't find information about this purchase, but it has been
              cancelled.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/dashboard" className={buttonVariants()}>
              Return to Dashboard
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }
}
