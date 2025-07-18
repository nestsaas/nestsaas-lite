"use client"

import { useState, useTransition } from "react"
import { updateUserRole, type UserRoleData } from "@/actions/user-actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, UserRole } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { userRoleSchema } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icons } from "@/components/shared/icons"

import { SectionColumns } from "./section-columns"

interface UserNameFormProps {
  user: Pick<User, "id" | "role">
}

export function UserRoleForm({ user }: UserNameFormProps) {
  const { update } = useSession()
  const [updated, setUpdated] = useState(false)
  const [isPending, startTransition] = useTransition()
  const updateUserRoleWithId = updateUserRole.bind(null, user.id)

  const roles = Object.values(UserRole)
  const [role, setRole] = useState(user.role)

  const form = useForm<UserRoleData>({
    resolver: zodResolver(userRoleSchema),
    values: {
      role: role,
    },
  })

  const onSubmit = (data: z.infer<typeof userRoleSchema>) => {
    startTransition(async () => {
      const { status } = await updateUserRoleWithId(data)

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "Your role was not updated. Please try again.",
        })
      } else {
        // await update({ user: { role: data.role } });
        await update()
        setUpdated(false)
        toast.success("Your role has been updated.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SectionColumns
          title="Your Role"
          description="Select the role what you want for test the app."
        >
          <div className="flex w-full items-center gap-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel className="sr-only">Role</FormLabel>
                  <Select
                    // TODO:(FIX) Option value not update. Use useState for the moment
                    onValueChange={(value: any) => {
                      setUpdated(user.role !== value)
                      setRole(value)
                      // field.onChange;
                    }}
                    name={field.name}
                    defaultValue={user.role}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role: any) => (
                        <SelectItem key={role} value={role.toString()}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant={updated ? "default" : "ghost"}
              disabled={isPending || !updated}
              className="w-[67px] shrink-0 px-0 sm:w-[130px]"
            >
              {isPending ? (
                <Icons.Spinner className="size-4 animate-spin" />
              ) : (
                <p>
                  Save
                  <span className="hidden sm:inline-flex">&nbsp;Changes</span>
                </p>
              )}
            </Button>
          </div>
          <div className="flex flex-col justify-between p-1">
            <p className="text-muted-foreground text-[13px]">
              Remove this field on real production
            </p>
          </div>
        </SectionColumns>
      </form>
    </Form>
  )
}
