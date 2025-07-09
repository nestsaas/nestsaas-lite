import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { constructMetadata } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard/header"

import { SubscriptionsFilter } from "./components/subscriptions-filter"
import { SubscriptionsTable } from "./components/subscriptions-table"

export const metadata = constructMetadata({
  title: "Subscriptions",
  description: "View and manage all user subscriptions in the system.",
})

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN")
    redirect("/login?redirect=/admin/subscriptions")

  // Parse search params
  const params = await searchParams
  const status = params.status as string | undefined
  const search = params.search as string | undefined
  const userId = params.userId ? Number(params.userId) : undefined
  const startDate = params.startDate as string | undefined
  const endDate = params.endDate as string | undefined
  const page = Number(params.page) || 1
  const pageSize = 10

  // Build filter conditions
  const where: any = {}

  if (status) {
    where.status = status
  }

  // Handle search parameter (for direct links from user management)
  if (search) {
    where.id = search
  }

  // Handle userId parameter (for filtering by user)
  if (userId) {
    where.userId = userId
  }

  const dateFilter: any = {}
  if (startDate) {
    dateFilter.gte = new Date(startDate)
  }
  if (endDate) {
    // Add one day to include the end date fully
    const endDateObj = new Date(endDate)
    endDateObj.setDate(endDateObj.getDate() + 1)
    dateFilter.lte = endDateObj
  }

  if (Object.keys(dateFilter).length > 0) {
    where.createdAt = dateFilter
  }

  // Fetch subscriptions with pagination
  const [subscriptionsRaw, totalSubscriptions] = await Promise.all([
    prisma.subscription.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.subscription.count({ where }),
  ])

  const totalPages = Math.ceil(totalSubscriptions / pageSize)

  return (
    <div className="space-y-6 p-4">
      <DashboardHeader
        heading="Subscriptions"
        text="View and manage all user subscriptions in the system."
      />

      <SubscriptionsFilter
        currentStatus={status}
        currentStartDate={startDate}
        currentEndDate={endDate}
      />

      <SubscriptionsTable
        subscriptions={subscriptionsRaw}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}
