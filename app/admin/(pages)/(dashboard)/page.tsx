import { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/header"

import { SectionCards } from "./components/section-cards"
import { Overview } from "./overview"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for NestSaaS platform.",
}

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <DashboardHeader heading="Admin Dashboard" />
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent
            value="overview"
            className="flex flex-col gap-4 md:gap-6"
          >
            <SectionCards />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Purchases</CardTitle>
                  <CardDescription>
                    Recently created or updated purchases.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Subscriptions</CardTitle>
                  <CardDescription>
                    Recently created or updated subscriptions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Some contents</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View detailed analytics about your subscriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analytics features coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  View and export reports about your content and users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Reporting features coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
