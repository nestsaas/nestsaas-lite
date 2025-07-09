"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Mail,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Subscription, User as UserPrisma } from "@prisma/client"

type Account = {
  provider: string
}

type Purchase = {
  id: string
}

// type Subscription = {
//   id: string
//   status: string
// }

type User = UserPrisma & {
  accounts: Account[]
  purchases: Purchase[]
  subscription: Subscription
}

interface UsersTableProps {
  users: User[]
  currentPage: number
  totalPages: number
}

export function UsersTable({
  users,
  currentPage,
  totalPages,
}: UsersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  const getRoleBadge = (role: string) => {
    return (
      <Badge
        variant={role === "ADMIN" ? "destructive" : "secondary"}
        className="capitalize"
      >
        {role.toLowerCase()}
      </Badge>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
        <h3 className="text-lg font-medium">No users found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Try adjusting your filters or check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Auth Provider</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {user.image && (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <div className="max-w-[150px] truncate">
                      {user.name || "Unnamed User"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {user.email || "No email"}
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{formatDate(user.lastLogin || null)}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/orders?userId=${user.id}`}
                    className="hover:underline"
                  >
                    {user.purchases.length}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/subscriptions?userId=${user.id}`}
                    className="hover:underline"
                  >
                    {user.subscription?.stripePriceId}
                  </Link>
                </TableCell>
                <TableCell>
                  {user.accounts.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {user.accounts.map((account, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="capitalize"
                        >
                          {account.provider}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    "Email/Password"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {user.email && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild>
                              <a
                                href={`mailto:${user.email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Send Email</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <DialogContent className="max-w-3xl sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about this user.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {selectedUser.image && (
                  <Image
                    src={selectedUser.image}
                    alt={selectedUser.name || "User"}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedUser.name || "Unnamed User"}
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedUser.email || "No email"}
                  </p>
                </div>
                <div className="ml-auto">{getRoleBadge(selectedUser.role)}</div>
              </div>

              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="purchases">
                    Purchases ({selectedUser.purchases.length})
                  </TabsTrigger>
                  <TabsTrigger value="subscriptions">
                    Subscription ({selectedUser.subscription?.status || "N/A"})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">User ID:</div>
                        <div className="font-mono">{selectedUser.id}</div>

                        <div className="text-muted-foreground">Name:</div>
                        <div>{selectedUser.name || "Not provided"}</div>

                        <div className="text-muted-foreground">Email:</div>
                        <div>{selectedUser.email || "Not provided"}</div>

                        <div className="text-muted-foreground">
                          Email Verified:
                        </div>
                        <div>
                          {selectedUser.emailVerified
                            ? formatDate(selectedUser.emailVerified)
                            : "No"}
                        </div>

                        <div className="text-muted-foreground">Website:</div>
                        <div>
                          {selectedUser.website ? (
                            <a
                              href={selectedUser.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              {selectedUser.website}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </div>

                        <div className="text-muted-foreground">Role:</div>
                        <div>{getRoleBadge(selectedUser.role)}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">
                        Account Information
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Created:</div>
                        <div>{formatDate(selectedUser.createdAt)}</div>

                        <div className="text-muted-foreground">Updated:</div>
                        <div>{formatDate(selectedUser.updatedAt)}</div>

                        <div className="text-muted-foreground">
                          Auth Providers:
                        </div>
                        <div>
                          {selectedUser.accounts.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedUser.accounts.map((account, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="capitalize"
                                >
                                  {account.provider}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            "Email/Password"
                          )}
                        </div>

                        <div className="text-muted-foreground">
                          Total Purchases:
                        </div>
                        <div>{selectedUser.purchases.length}</div>

                        <div className="text-muted-foreground">
                          Active Subscription:
                        </div>
                        <div>
                          {
                            selectedUser.subscription?.status === "active"
                             && selectedUser.subscription?.stripePriceId
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="purchases" className="space-y-4">
                  {selectedUser.purchases.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Purchase ID</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedUser.purchases.map((purchase) => (
                            <TableRow key={purchase.id}>
                              <TableCell className="font-mono">
                                {purchase.id}
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    href={`/admin/orders?search=${purchase.id}`}
                                  >
                                    View Details
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {selectedUser.purchases.length > 5 && (
                        <div className="p-2 text-center">
                          <Button
                            variant="link"
                            asChild
                            className="text-muted-foreground text-sm"
                          >
                            <Link
                              href={`/admin/orders?userId=${selectedUser.id}`}
                            >
                              View all purchases
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
                      <h3 className="text-lg font-medium">
                        No purchases found
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        This user hasn't made any purchases yet.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="subscriptions" className="space-y-4">
                  {
                  selectedUser.subscription ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          
                            <TableRow key={selectedUser.subscription.id}>
                              <TableCell>
                                <Badge
                                  variant={
                                    selectedUser.subscription.status === "active"
                                      ? "default"
                                      : selectedUser.subscription.status === "canceled"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className="capitalize"
                                >
                                  {selectedUser.subscription.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    href={`/admin/subscriptions?search=${selectedUser.subscription.id}`}
                                  >
                                    View Details
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                      {selectedUser.subscription && (
                        <div className="p-2 text-center">
                          <Button
                            variant="link"
                            asChild
                            className="text-muted-foreground text-sm"
                          >
                            <Link
                              href={`/admin/subscriptions?userId=${selectedUser.id}`}
                            >
                              View subscription
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
                      <h3 className="text-lg font-medium">
                        No subscription found
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        This user doesn't have a subscription.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
