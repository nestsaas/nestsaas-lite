import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { EmailService } from "@/lib/services/email-service"

export async function POST() {
  try {
    // Optional: Check authentication
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Send test email
    const result = await EmailService.sendTestEmail()

    return NextResponse.json(
      { success: true, message: "Test email sent" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sending test email:", error)

    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
