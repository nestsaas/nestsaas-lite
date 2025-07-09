"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Consumes a specified amount of credits from the user's account
 * Returns the updated credit balance or null if the operation failed
 */
export async function consumeCredits(amount: number) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, message: "Not authenticated", credits: null }
    }
    
    const userId = Number(session.user.id)
    
    // Get current user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    })
    
    if (!user) {
      return { success: false, message: "User not found", credits: null }
    }
    
    // Check if user has enough credits
    if ((user.credits || 0) < amount) {
      return { 
        success: false, 
        message: "Insufficient credits", 
        credits: user.credits || 0 
      }
    }
    
    // Deduct credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount
        }
      },
      select: { credits: true }
    })
    
    // Revalidate dashboard path to update UI
    revalidatePath("/dashboard")
    
    return { 
      success: true, 
      message: `Successfully consumed ${amount} credits`, 
      credits: updatedUser.credits || 0 
    }
  } catch (error) {
    console.error("Error consuming credits:", error)
    return { success: false, message: "Failed to consume credits", credits: null }
  }
}
