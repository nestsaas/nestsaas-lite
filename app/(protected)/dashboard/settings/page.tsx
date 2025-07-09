import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { constructMetadata } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard/header"

import { UserNameForm } from "../components/user-name-form"
import { UserRoleForm } from "../components/user-role-form"
import { UserWebsiteForm } from "../components/user-website-form"

export const metadata = constructMetadata({
  title: "Settings",
  description: "Configure your account and website settings.",
})

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user?.id) redirect("/login")

  return (
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="divide-muted divide-y pb-10">
        <UserNameForm user={{ id: Number(user.id), name: user.name || "" }} />
        <UserWebsiteForm
          user={{ id: Number(user.id), website: (user as any).website || "" }}
        />
        <UserRoleForm user={{ id: Number(user.id), role: user.role }} />
      </div>
    </>
  )
}
