import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { constructMetadata } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard/header"

import { UsersFilter } from "./components/users-filter"
import { UsersTable } from "./components/users-table"

export const metadata = constructMetadata({
  title: "User Management",
  description: "View and manage all users in the system.",
})

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") redirect("/login?redirect=/admin/users")

  // Parse search params
  const params = await searchParams
  const role = params.role as string | undefined
  const email = params.email as string | undefined
  const startDate = params.startDate as string | undefined
  const endDate = params.endDate as string | undefined
  const page = Number(params.page) || 1
  const pageSize = 20

  // Build filter conditions
  const where: any = {}

  if (role) {
    where.role = role
  }

  if (email) {
    where.email = {
      contains: email,
      mode: "insensitive",
    }
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

  // Fetch users with pagination
  const [usersRaw, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        accounts: {
          select: {
            provider: true,
          },
        },
        purchases: {
          select: {
            id: true,
          },
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
        },
        subscription: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ])

  // Get roles for filter dropdown
  const roles = Object.values(UserRole)

  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <div className="space-y-6 p-4">
      <DashboardHeader
        heading="User Management"
        text="View and manage all users in the system."
      />

      <UsersFilter
        roles={roles as string[]}
        currentRole={role}
        currentEmail={email}
        currentStartDate={startDate}
        currentEndDate={endDate}
      />

      <UsersTable users={usersRaw as any} currentPage={page} totalPages={totalPages} />
    </div>
  )
}
