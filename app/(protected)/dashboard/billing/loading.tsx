import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "@/components/dashboard/header"

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-1">
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-3.5 w-2/5" />
      </CardHeader>
      <CardContent className="h-16" />
      <CardFooter className="bg-accent/50 flex h-14 items-center justify-between border-t p-6" />
    </Card>
  )
}

export default function DashboardBillingLoading() {
  return (
    <>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <Skeleton className="h-28 w-full rounded-lg md:h-24" />
        <CardSkeleton />
      </div>
    </>
  )
}
