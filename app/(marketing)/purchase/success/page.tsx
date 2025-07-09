import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPurchaseById } from "@/actions/purchase-actions"
import { CheckCircle2 } from "lucide-react"

import { codeRepository } from "@/config/payments"
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
  title: "Purchase Successful",
  description: "Your purchase has been completed successfully.",
}

interface SuccessPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const purchaseId = (await searchParams).id

  if (!purchaseId) {
    return notFound()
  }

  try {
    const purchase = await getPurchaseById(purchaseId)
    if (!purchase) {
      return notFound()
    }

    return (
      <div className="container max-w-lg py-10">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Purchase Successful</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your payment has been processed
              successfully.
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

              {purchase.product === codeRepository.product && (
                <div className="bg-muted mt-4 rounded-md p-4">
                  <h3 className="mb-2 font-medium">Next Steps</h3>
                  <p className="text-muted-foreground text-sm">
                    You will receive an invitation to access the repository
                    shortly. Please check your email for the GitHub invitation.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
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
            <CardTitle className="text-2xl">Purchase Information</CardTitle>
            <CardDescription>
              We couldn't find information about this purchase.
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
