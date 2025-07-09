import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { CreditCard, Edit, User } from "lucide-react"

import { auth } from "@/lib/auth"
import { getUserById } from "@/lib/user"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "@/components/dashboard/header"
import { Separator } from "@/components/ui/separator"

async function DashboardContent() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return <div>Please log in to view your dashboard.</div>
  }
  
  const userId = Number(session.user.id)
  const user = await getUserById(userId)
  
  if (!user) {
    return <div>User information not found.</div>
  }
  
  return (
    <div className="">
      <DashboardHeader
        heading="Dashboard"
        text="Your account information"
      />
      <div className="space-y-8 ">
        {/* User Profile Section */}
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold"></h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/settings">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-full flex-shrink-0">
              {user.image ? (
                <Image 
                  src={user.image} 
                  alt={user.name || "User"} 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user.name || "Anonymous User"}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
              
              <div className="grid">
                <div>
                  <span className="text-sm font-medium block text-muted-foreground">Website</span>
                  <span className="text-sm truncate block max-w-[200px]">
                    {user.website ? (
                      <Link 
                        href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        {user.website}
                      </Link>
                    ) : (
                      "Not specified"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Subscription Status Section */}
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">Subscription</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">
                Manage
              </Link>
            </Button>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <CreditCard className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                <div>
                  <span className="text-sm font-medium block text-muted-foreground">Status</span>
                  <span className="text-sm font-semibold">
                    {user.subscription?.status || "No Active Subscription"}
                  </span>
                </div>
                
                {user.subscription?.currentPeriodEnd && (
                  <div>
                    <span className="text-sm font-medium block text-muted-foreground">Current Period Ends</span>
                    <span className="text-sm">
                      {format(new Date(user.subscription.currentPeriodEnd), "PPP")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Credits Section */}
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">Credits</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">
                Buy More
              </Link>
            </Button>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{user.credits || 0}</span>
                <span className="text-sm text-muted-foreground">Available Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <Suspense fallback={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-8 max-w-3xl mx-auto">
            <div>
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-28" />
              </div>
              <Skeleton className="h-24" />
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-9 w-20" />
              </div>
              <Skeleton className="h-24" />
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
              <Skeleton className="h-16" />
            </div>
          </div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  )
}