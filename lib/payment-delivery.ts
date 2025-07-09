import { Octokit } from "@octokit/rest"
import { Account, Purchase, User } from "@prisma/client"

import { codeRepository } from "@/config/payments"
import { prisma } from "@/lib/prisma"
import { EmailService } from "@/lib/services/email-service"

/**
 * Handle GitHub repository invitation delivery
 */
export async function handleRepositoryInvitation(
  purchase: Purchase,
  user: User & { accounts: Account[] }
) {
  try {
    // Get repository information from the purchase
    if (!codeRepository) {
      throw new Error(`Repository not found: ${purchase.product}`)
    }
    if (!user.email) {
      throw new Error(`User email not found for user ID: ${user.id}`)
    }

    // Initialize GitHub API client
    const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_TOKEN })

    // Get user information from accounts
    const response = await octokit.users.getById({
      account_id: Number(user.accounts[0].providerAccountId),
    })

    const userName = response.data.login || user.email

    if (!userName) {
      throw new Error(`User name or email not found for user ID: ${user.id}`)
    }

    // Invite user to repository
    await octokit.repos.addCollaborator({
      owner: codeRepository.owner,
      repo: codeRepository.repo,
      username: userName,
      permission: "pull", // Read-only access
    })

    // Send repository access email notification
    try {
      await EmailService.sendRepositoryAccessEmail({
        to: [user.email],
        firstName: user.name || undefined,
        repositoryName: codeRepository.name,
        repositoryOwner: codeRepository.owner,
        repositoryRepo: codeRepository.repo,
        // TODO：Add subject
        subject: "Repository Access",
      })

    } catch (emailError) {
      console.error("Failed to send repository access email:", emailError)
      // We don't want to fail the entire process if just the email fails
      // The user still has access to the repository
    }

    return true
  } catch (error) {
    console.error("Error handling repository invitation:", error)

    return false
  }
}


/**
 * Process a completed purchase
 */
export async function processCompletedPurchase(purchaseId: string) {
  try {
    // Get purchase details
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        user: {
          include: {
            accounts: true,
          },
        },
      },
    })

    if (!purchase) {
      throw new Error(`Purchase not found: ${purchaseId}`)
    }

    // Process delivery based on purchase type
    if (purchase.product === codeRepository.product) {
      await handleRepositoryInvitation(purchase, purchase.user)
    } else if (purchase.product === "content") {
      // TODO: support paid content delivery
      // Handle paid content delivery (not implemented in Phase 1)
      // This would typically involve generating download links or access tokens
    }

    return true
  } catch (error) {
    console.error("Error processing completed purchase:", error)
    return false
  }
}
