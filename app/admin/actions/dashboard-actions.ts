import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  try {
    const usersCount = await prisma.user.count()

    const subscriptionsCount = await prisma.subscription.count({
      where: {
        status: "active",
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    })
    const purchasesCount = await prisma.purchase.count({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    })
    const purchasesAmount = await prisma.purchase.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    })
    const newUsersCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    })
    return {
      newUsersCount,
      usersCount,
      subscriptionsCount,
      purchasesCount,
      purchasesAmount,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return { error: "Failed to fetch dashboard stats" }
  }
}
