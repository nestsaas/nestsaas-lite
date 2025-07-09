"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => queryClient)

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}
