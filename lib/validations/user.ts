import { UserRole } from "@prisma/client"
import * as z from "zod"

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
})

export const userRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
})

export const userWebsiteSchema = z.object({
  website: z
    .string()
    .trim()
    .max(100, { message: "Website URL must be 100 characters or less" })
    .url({ message: "Please enter a valid URL" })
    .or(z.literal(""))
    .optional(),
})
