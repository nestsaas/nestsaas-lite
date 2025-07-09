"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, ExternalLink, Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Subscription = {
  id: string
  userId: number
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripePriceId: string
  interval: string
  status: string
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: number
    name: string | null
    email: string | null
  }
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[]
  currentPage: number
  totalPages: number
}

export function SubscriptionsTable({
  subscriptions,
  currentPage,
  totalPages,
}: SubscriptionsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "trialing":
        return "warning"
      case "canceled":
        return "destructive"
      case "past_due":
        return "destructive"
      case "unpaid":
        return "destructive"
      case "incomplete":
        return "secondary"
      case "incomplete_expired":
        return "secondary"
      case "paused":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getSubscriptionStatusBadge = (status: string) => {
    return (
      <Badge
        variant={getStatusBadgeVariant(status) as any}
        className="capitalize"
      >
        {status.replace("_", " ")}
      </Badge>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
        <h3 className="text-lg font-medium">No subscriptions found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Try adjusting your filters or check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Period</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <div className="max-w-[150px] truncate">
                    {subscription.user.name || "Unnamed User"}
                  </div>
                  <div className="text-muted-foreground mt-1 truncate text-xs">
                    {subscription.user.email}
                  </div>
                </TableCell>
                <TableCell>
                  {getSubscriptionStatusBadge(subscription.status)}
                </TableCell>
                <TableCell>
                  {subscription.currentPeriodStart && subscription.currentPeriodEnd ? (
                    <>
                      <div className="text-xs">
                        Start: {formatDate(subscription.currentPeriodStart)}
                      </div>
                      <div className="text-xs">
                        End: {formatDate(subscription.currentPeriodEnd)}
                      </div>
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{formatDate(subscription.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedSubscription(subscription)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={`https://dashboard.stripe.com/subscriptions/${subscription.stripeSubscriptionId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View in Stripe</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Subscription Details Dialog */}
      <Dialog
        open={!!selectedSubscription}
        onOpenChange={(open) => !open && setSelectedSubscription(null)}
      >
        <DialogContent className="max-w-3xl sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
            <DialogDescription>
              Complete information about this subscription.
            </DialogDescription>
          </DialogHeader>

          {selectedSubscription && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Subscription Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Subscription ID:</div>
                    <div className="font-mono">{selectedSubscription.id}</div>

                    <div className="text-muted-foreground">Interval:</div>
                    <div>{selectedSubscription.interval || "N/A"}</div>

                    <div className="text-muted-foreground">Status:</div>
                    <div>
                      {getSubscriptionStatusBadge(selectedSubscription.status)}
                    </div>

                    <div className="text-muted-foreground">Created:</div>
                    <div>{formatDate(selectedSubscription.createdAt)}</div>

                    <div className="text-muted-foreground">Updated:</div>
                    <div>{formatDate(selectedSubscription.updatedAt)}</div>

                    {selectedSubscription.currentPeriodStart && (
                      <>
                        <div className="text-muted-foreground">
                          Current Period Start:
                        </div>
                        <div>
                          {formatDate(selectedSubscription.currentPeriodStart)}
                        </div>
                      </>
                    )}

                    {selectedSubscription.currentPeriodEnd && (
                      <>
                        <div className="text-muted-foreground">
                          Current Period End:
                        </div>
                        <div>
                          {formatDate(selectedSubscription.currentPeriodEnd)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Name:</div>
                    <div>
                      {selectedSubscription.user.name || "Unnamed User"}
                    </div>

                    <div className="text-muted-foreground">Email:</div>
                    <div>{selectedSubscription.user.email}</div>

                    <div className="text-muted-foreground">User ID:</div>
                    <div className="font-mono">
                      {selectedSubscription.userId}
                    </div>

                    <div className="text-muted-foreground">
                      Stripe Customer ID:
                    </div>
                    <div className="truncate font-mono">
                      {selectedSubscription.stripeCustomerId}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Stripe Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">
                    Subscription ID:
                  </div>
                  <div className="truncate font-mono">
                    {selectedSubscription.stripeSubscriptionId}
                  </div>

                  <div className="text-muted-foreground">Price ID:</div>
                  <div className="truncate font-mono">
                    {selectedSubscription.stripePriceId}
                  </div>
                </div>

                <div className="mt-2">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={`https://dashboard.stripe.com/subscriptions/${selectedSubscription.stripeSubscriptionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      View in Stripe Dashboard
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
