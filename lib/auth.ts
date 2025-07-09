import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"

import { prisma } from "@/lib/prisma"
import { getUserById } from "@/lib/user"

import authConfig from "./auth.config"

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole
      credits?: number
    } & DefaultSession["user"]
  }

  interface User {
    role?: UserRole
    credits?: number
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    // error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Update lastLogin timestamp in the database
      try {
        if (!user.id) {
          return true
        }

        const userId = Number(user.id);
        if (isNaN(userId)) {
          console.error('Invalid user id:', user.id);
          return true;
        }

        await prisma.user.update({
          where: { id: userId },
          data: { lastLogin: new Date() },
        });
      } catch (error) {
        console.error('Error updating lastLogin:', error);
        // Optionally, allow sign-in to continue even if update fails
      }
      return true; // Return true to allow sign-in
    },
    // async jwt({ token, user, trigger, session }) {
    async jwt({ token, trigger, session }) {
      // Handle session update directly
      if (trigger === "update" && session) {
        if (session.user.name) token.name = session.user.name
        if (session.user.role) token.role = session.user.role
        if (session.user.credits) token.credits = session.user.credits
      }

      if (!token.sub) return token
      const user = await getUserById(Number(token.sub))

      // User is available during sign-in
      if (user) {
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.credits = user.credits
        token.role = user.role || UserRole.USER // Provide a default role if not present
      }

      return token
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }

      if (token.email) {
        session.user.email = token.email
      }

      session.user.role = (token.role as UserRole) ?? UserRole.USER
      session.user.name = token.name
      session.user.image = token.picture
      session.user.credits = token.credits

      return session
    },
  },
  ...authConfig,
  // debug: process.env.NODE_ENV !== "production"
})
