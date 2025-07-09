"use server"

import { z } from "zod"

import { NewsletterService } from "@/lib/services/newsletter-service"

const subscribeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  source: z.string().optional(),
})

export type SubscribeFormData = z.infer<typeof subscribeSchema>

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(formData: SubscribeFormData) {
  try {
    // Validate form data
    const validatedData = subscribeSchema.parse(formData)
    
    // Subscribe user
    const subscriber = await NewsletterService.subscribe({
      email: validatedData.email,
      source: validatedData.source || "website",
    })
    
    return {
      success: true,
      message: "Subscription successful! Thank you for subscribing.",
      data: subscriber,
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Form validation failed",
        errors: error.errors,
      }
    }
    
    return {
      success: false,
      message: "Subscription failed, please try again later.",
    }
  }
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(email: string) {
  try {
    await NewsletterService.unsubscribe(email)
    
    return {
      success: true,
      message: "You have successfully unsubscribed.",
    }
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error)
    
    return {
      success: false,
      message: "Unsubscribe failed, please try again later.",
    }
  }
}
