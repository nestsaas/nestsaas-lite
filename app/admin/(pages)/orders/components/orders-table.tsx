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
import { getPaymentStatusBadge } from "@/components/badge-utils"

type Purchase = {
  id: string
  product: string
  amount: number
  currency: string
  description: string | null
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  stripePaymentIntentId: string | null
  stripePriceId: string | null
  stripeSessionId: string | null
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
  userId: number
  user: {
    id: number
    name: string | null
    email: string | null
  }
}

interface OrdersTableProps {
  orders: Purchase[]
  currentPage: number
  totalPages: number
}

export function OrdersTable({
  orders,
  currentPage,
  totalPages,
}: OrdersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedOrder, setSelectedOrder] = useState<Purchase | null>(null)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success"
      case "PENDING":
        return "warning"
      case "FAILED":
        return "destructive"
      case "REFUNDED":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
        <h3 className="text-lg font-medium">No orders found</h3>
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
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <div className="max-w-[120px] truncate" title={order.id}>
                    {order.id}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[150px] truncate" title={order.product}>
                    {order.product}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[150px] truncate">
                    {order.user.name || "Unnamed User"}
                  </div>
                  <div className="text-muted-foreground mt-1 truncate text-xs">
                    {order.user.email}
                  </div>
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(order.amount), order.currency)}
                </TableCell>
                <TableCell>{getPaymentStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <div>{formatDate(order.createdAt)}</div>
                  {order.completedAt && (
                    <div className="text-muted-foreground mt-1 text-xs">
                      Completed: {formatDate(order.completedAt)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {order.stripeSessionId && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild>
                              <a
                                href={`https://dashboard.stripe.com/payments/${order.stripePaymentIntentId}`}
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
                    )}
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

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-3xl sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about this purchase order.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Order ID:</div>
                    <div className="font-mono">{selectedOrder.id}</div>

                    <div className="text-muted-foreground">Product:</div>
                    <div>{selectedOrder.product}</div>

                    <div className="text-muted-foreground">Amount:</div>
                    <div>
                      {formatCurrency(
                        Number(selectedOrder.amount),
                        selectedOrder.currency
                      )}
                    </div>

                    <div className="text-muted-foreground">Status:</div>
                    <div>{getPaymentStatusBadge(selectedOrder.status)}</div>

                    <div className="text-muted-foreground">Created:</div>
                    <div>{formatDate(selectedOrder.createdAt)}</div>

                    {selectedOrder.completedAt && (
                      <>
                        <div className="text-muted-foreground">Completed:</div>
                        <div>{formatDate(selectedOrder.completedAt)}</div>
                      </>
                    )}

                    {selectedOrder.description && (
                      <>
                        <div className="text-muted-foreground">
                          Description:
                        </div>
                        <div>{selectedOrder.description}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Name:</div>
                    <div>{selectedOrder.user.name || "Unnamed User"}</div>

                    <div className="text-muted-foreground">Email:</div>
                    <div>{selectedOrder.user.email}</div>

                    <div className="text-muted-foreground">User ID:</div>
                    <div className="font-mono">{selectedOrder.userId}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Payment Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {selectedOrder.stripePaymentIntentId && (
                    <>
                      <div className="text-muted-foreground">
                        Payment Intent ID:
                      </div>
                      <div className="truncate font-mono">
                        {selectedOrder.stripePaymentIntentId}
                      </div>
                    </>
                  )}

                  {selectedOrder.stripePriceId && (
                    <>
                      <div className="text-muted-foreground">Price ID:</div>
                      <div className="truncate font-mono">
                        {selectedOrder.stripePriceId}
                      </div>
                    </>
                  )}

                  {selectedOrder.stripeSessionId && (
                    <>
                      <div className="text-muted-foreground">Session ID:</div>
                      <div className="truncate font-mono">
                        {selectedOrder.stripeSessionId}
                      </div>
                    </>
                  )}
                </div>

                {selectedOrder.stripePaymentIntentId && (
                  <div className="mt-2">
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={`https://dashboard.stripe.com/payments/${selectedOrder.stripePaymentIntentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        View in Stripe Dashboard
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
