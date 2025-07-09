"use client"

import { useState, useTransition } from "react"
import { updateUserWebsite, type UserWebsiteData } from "@/actions/user-actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { userWebsiteSchema } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/shared/icons"

import { SectionColumns } from "./section-columns"

interface UserWebsiteFormProps {
  user: {
    id: number
    website?: string | null
  }
}

export function UserWebsiteForm({ user }: UserWebsiteFormProps) {
  const [updated, setUpdated] = useState(false)
  const [isPending, startTransition] = useTransition()
  const updateUserWebsiteWithId = updateUserWebsite.bind(null, user.id)

  const checkUpdate = (value: string) => {
    setUpdated(user.website !== value)
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserWebsiteData>({
    resolver: zodResolver(userWebsiteSchema),
    defaultValues: {
      website: user?.website || "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserWebsiteWithId(data)

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "Your website URL was not updated. Please try again.",
        })
      } else {
        setUpdated(false)
        toast.success("Your website URL has been updated.")
      }
    })
  })

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Your Website"
        description="Please enter your personal or business website URL."
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="website">
            Website
          </Label>
          <Input
            id="website"
            className="flex-1"
            placeholder="https://example.com"
            {...register("website")}
            onChange={(e) => checkUpdate(e.target.value)}
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
          {errors?.website && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.website.message}
            </p>
          )}
          <p className="text-muted-foreground text-[13px]">
            Max 100 characters
          </p>
        </div>
      </SectionColumns>
    </form>
  )
}
