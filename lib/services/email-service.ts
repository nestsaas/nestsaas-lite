import NewsletterEmail from "@/emails/newsletter"
import RepositoryAccessEmail from "@/emails/repository-access"
import WelcomeEmail from "@/emails/welcome"
import { Resend } from "resend"

import { siteConfig } from "@/config/site"

// Initialize Resend client
let resendClient: Resend | null = null

// Get Resend client
function getResendClient(): Resend {
  if (!resendClient) {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not defined in environment variables")
    }
    resendClient = new Resend(resendApiKey)
  }
  return resendClient
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  from?: string
  replyTo?: string
}

export class EmailService {
  static async sendTestEmail() {
    const resend = getResendClient()

    // Send email
    return await resend.emails.send({
      to: ["wainguo@gmail.com"],
      subject: "Hello World",
      from: `${siteConfig.name} <onboarding@resend.dev>`,
      replyTo: `${siteConfig.name} <onboarding@resend.dev>`,
      html: `<h1 style='color: #333;'>It works!</h1><p>This is a test email sent from ${siteConfig.name} using Resend.</p>`,
    })
  }

  /**
   * Send repository access email to users who purchased repository access
   */
  static async sendRepositoryAccessEmail({
    to,
    firstName,
    repositoryName,
    repositoryOwner,
    repositoryRepo,
    ...options
  }: EmailOptions & {
    firstName?: string
    repositoryName: string
    repositoryOwner: string
    repositoryRepo: string
  }) {
    const resend = getResendClient()
    const from = options.from || process.env.EMAIL_FROM
    const subject = `Your access to ${repositoryName} is ready`

    if (!from) {
      throw new Error("EMAIL_FROM is not defined in environment variables")
    }

    // Send email using the react property instead of pre-rendering to HTML
    return await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      react: RepositoryAccessEmail({
        userName: firstName,
        userEmail: Array.isArray(to) ? to[0] : to,
        repositoryName,
        repositoryOwner,
        repositoryRepo,
      }),
      replyTo: options.replyTo || from,
    })
  }

  /**
   * Send welcome email to new subscribers
   */
  static async sendWelcomeEmail({
    to,
    firstName,
    unsubscribeUrl,
    ...options
  }: EmailOptions & {
    firstName?: string
    unsubscribeUrl: string
  }) {
    const resend = getResendClient()
    const from = options.from || process.env.EMAIL_FROM
    const subject = "Welcome to our Newsletter!"

    if (!from) {
      throw new Error("EMAIL_FROM is not defined in environment variables")
    }
    // Send email using react property
    return await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      react: WelcomeEmail({
        firstName: firstName || '',
        unsubscribeUrl,
      }),
      replyTo: options.replyTo || from,
    })
  }

  /**
   * Send Newsletter email to all subscribers
   */
  static async sendNewsletterEmail({
    to,
    subject,
    content,
    firstName,
    unsubscribeUrl,
    ...options
  }: EmailOptions & {
    content: string
    firstName?: string
    unsubscribeUrl: string
  }) {
    const resend = getResendClient()
    const from = options.from || process.env.EMAIL_FROM

    if (!from) {
      throw new Error("EMAIL_FROM is not defined in environment variables")
    }
    // Send email using react property
    return await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      react: NewsletterEmail({
        firstName,
        subject,
        content,
        unsubscribeUrl,
      }),
      replyTo: options.replyTo || from,
    })
  }

  /**
   * Batch send Newsletter email to all subscribers
   * This method will process recipients in batches to avoid sending too many emails at once
   */
  static async batchSendNewsletterEmail({
    recipients,
    subject,
    content,
    ...options
  }: Omit<EmailOptions, "to"> & {
    recipients: Array<{
      email: string
      firstName?: string
      unsubscribeUrl: string
    }>
    content: string
  }) {
    const batchSize = 50 // Max number of emails per batch
    const results = []

    // Process recipients in batches
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)

      // Send personalized emails to each recipient
      const batchPromises = batch.map((recipient) => {
        return this.sendNewsletterEmail({
          to: recipient.email,
          subject,
          content,
          firstName: recipient.firstName,
          unsubscribeUrl: recipient.unsubscribeUrl,
          ...options,
        })
      })

      // Wait for all emails in the current batch to be sent
      const batchResults = await Promise.allSettled(batchPromises)
      results.push(...batchResults)

      // If there are more batches to process, wait a short time before continuing
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return results
  }
}