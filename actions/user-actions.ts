"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { userNameSchema, userRoleSchema, userWebsiteSchema } from "@/lib/validations/user"
import z from "zod"

import { getUserByEmail, getUserById } from "@/lib/user"

export type UserNameData = z.infer<typeof userNameSchema>

export type UserRoleData = z.infer<typeof userRoleSchema>

export type UserWebsiteData = z.infer<typeof userWebsiteSchema>

// export type UserCreditData = z.infer<typeof userCreditSchema>

export { getUserByEmail, getUserById }

export async function updateUserName(userId: number | string, data: UserNameData) {
  try {
    const session = await auth()

    if (!session?.user || session?.user.id != userId) {
      throw new Error("Unauthorized")
    }

    const { name } = userNameSchema.parse(data)

    // Update the user name.
    await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name: name,
      },
    })

    revalidatePath("/dashboard/settings")
    return { status: "success" }
  } catch (error) {
    // console.log(error)
    return { status: "error" }
  }
}

export async function updateUserRole(userId: number | string, data: UserRoleData) {
  try {
    const session = await auth()

    if (!session?.user || session?.user.id != userId) {
      throw new Error("Unauthorized")
    }

    const { role } = userRoleSchema.parse(data)

    // Update the user role.
    await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        role: role,
      },
    })

    revalidatePath("/dashboard/settings")

    return { status: "success" }
  } catch (error) {
    console.log(error)
    return { status: "error" }
  }
}

export async function updateUserWebsite(
  userId: number | string,
  data: UserWebsiteData
) {
  try {
    const session = await auth()

    if (!session?.user || session?.user.id != userId) {
      throw new Error("Unauthorized")
    }

    const { website } = userWebsiteSchema.parse(data)

    // Update the user website
    // Using type assertion because the website field is new and types haven't been regenerated
    await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        website,
      } as any,
    })

    revalidatePath("/dashboard/settings")
    return { status: "success" }
  } catch (error) {
    console.error("Error updating website:", error)
    return { status: "error" }
  }
}
