import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "@/components/dashboard/header"

export default function OrdersLoading() {
  return (
    <div className="p-4">
      <DashboardHeader
        heading="Purchase Orders"
        text="View and manage all purchase orders in the system."
      />
      <Skeleton className="size-full rounded-lg" />
    </div>
  )
}
