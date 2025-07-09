import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

import { env } from "@/env.mjs"
import { sendVerificationRequest } from "@/lib/email"

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      // profile(profile) {
      //   return {
      //     id: profile.id.toString(),
      //     name: profile.name ?? profile.login,
      //     // for github, the username is used , for code repo delivery after purchased, we need to invite the user to the code repo
      //     username: profile.login,
      //     email: profile.email,
      //     image: profile.avatar_url,
      //   }
      // },
    }),
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
} satisfies NextAuthConfig
