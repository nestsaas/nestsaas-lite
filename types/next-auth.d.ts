import { UserRole } from "@prisma/client"
import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

export type ExtendedUser = User & {
  role: UserRole
  credits?: number
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    credits?: number
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
