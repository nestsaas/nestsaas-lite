import { prisma } from "@/lib/prisma"
import { EmailService } from "@/lib/services/email-service"
import { AudienceStatus } from "@prisma/client"

interface SubscribeOptions {
  email: string
  source?: string
}

interface SendNewsletterOptions {
  subject: string
  content: string
  fromEmail?: string
  replyTo?: string
}

export class NewsletterService {
  /**
   * Subscribe a user to the newsletter
   */
  static async subscribe(options: SubscribeOptions) {
    const { email, source } = options

    // Check if the email is already subscribed
    const existingSubscriber = await prisma.audience.findUnique({
      where: { email },
    })

    let subscriber

    if (existingSubscriber) {
      // If already subscribed, return the existing subscriber
      if (existingSubscriber.status === AudienceStatus.SUBSCRIBED) {
        return existingSubscriber
      }

      // If previously unsubscribed, reactivate the subscriber
      subscriber = await prisma.audience.update({
        where: { email },
        data: {
          status: AudienceStatus.SUBSCRIBED,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create a new subscriber
      subscriber = await prisma.audience.create({
        data: {
          email,
          source,
          status: AudienceStatus.SUBSCRIBED,
        },
      })

      // Send welcome email to new subscribers
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`

        await EmailService.sendWelcomeEmail({
          to: email,
          subject: "Welcome to our Newsletter!",
          unsubscribeUrl,
        })
      } catch (error) {
        console.error("Failed to send welcome email:", error)
        // Continue even if email sending fails
      }
    }

    return subscriber
  }

  /**
   * Unsubscribe a user from the newsletter
   */
  static async unsubscribe(email: string) {
    const subscriber = await prisma.audience.findUnique({
      where: { email },
    })

    if (!subscriber) {
      throw new Error("Subscriber not found")
    }

    // Unsubscribe the user
    return await prisma.audience.update({
      where: { email },
      data: {
        status: AudienceStatus.UNSUBSCRIBED,
        updatedAt: new Date(),
      },
    })
  }

  /**
   * Get all subscribers
   */
  static async getAudiences() {
    return await prisma.audience.findMany({
      where: {
        status: AudienceStatus.SUBSCRIBED,
      },
    })
  }

  /**
   * Get a subscriber by email
   */
  static async getAudienceByEmail(email: string) {
    return await prisma.audience.findUnique({
      where: { email },
    })
  }

  /**
   * Send a newsletter to all active subscribers
   */
  static async sendNewsletter(options: SendNewsletterOptions) {
    const { subject, content, fromEmail, replyTo } = options

    // Get all active subscribers
    const audiences = await this.getAudiences()

    if (audiences.length === 0) {
      throw new Error("No active subscribers found")
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Prepare recipients with personalized unsubscribe URLs
    const recipients = audiences.map((audience: any) => ({
      email: audience.email,
      unsubscribeUrl: `${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(audience.email)}`,
    }))

    // Send newsletter to all recipients in batches
    const results = await EmailService.batchSendNewsletterEmail({
      recipients,
      subject,
      content,
      from: fromEmail,
      replyTo,
    })

    // Return summary of results
    const successful = results.filter((r) => r.status === "fulfilled").length
    const failed = results.filter((r) => r.status === "rejected").length

    return {
      total: audiences.length,
      successful,
      failed,
      details: results,
    }
  }

  /**
   * Send a test newsletter to a specific email
   */
  static async sendTestNewsletter(
    email: string,
    options: SendNewsletterOptions
  ) {
    const { subject, content, fromEmail, replyTo } = options

    // Get subscriber if exists, or create dummy data
    const audience = (await this.getAudienceByEmail(email)) || {
      email,
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`

    // Send test newsletter
    return await EmailService.sendNewsletterEmail({
      to: email,
      subject,
      content,
      unsubscribeUrl,
      from: fromEmail,
      replyTo,
    })
  }
}
