export const getPaymentStatusBadge = (status: string | undefined) => {
  if (!status) return null

  switch (status) {
    case "PENDING":
      return (
        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          Payment Pending
        </span>
      )
    case "COMPLETED":
      return (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          Payment Completed
        </span>
      )
    case "FAILED":
      return (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
          Payment Failed
        </span>
      )
    case "REFUNDED":
      return (
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
          Payment Refunded
        </span>
      )
    case "active":
      return (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          Active
        </span>
      )
    default:
      return (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {status}
        </span>
      )
  }
}
