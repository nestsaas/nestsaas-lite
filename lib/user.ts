import { prisma } from "@/lib/prisma"

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        emailVerified: true,
        image: true,
        website: true,
        credits: true,
        subscription: {
          select: {
            status: true,
            currentPeriodEnd: true
          }
        }
      }
    })

    return user
  } catch {
    return null
  }
}

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id }, 
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        emailVerified: true,
        image: true,
        website: true,
        credits: true,
        subscription: {
          select: {
            status: true,
            currentPeriodEnd: true
          }
        }
      }
    })

    return user
  } catch {
    return null
  }
}
