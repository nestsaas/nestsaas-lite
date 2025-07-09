"use client"

import { useState } from "react"
import {
  subscribeToNewsletter,
  type SubscribeFormData,
} from "@/actions/newsletter-actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/shared/icons"

// Form validation schema
const waitlistFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>

interface JoinWaitlistProps {
  triggerText?: string
  source?: string
  children?: React.ReactNode
}

export default function JoinWaitlist({
  triggerText = "Join Waitlist",
  source = "waitlist",
  children,
}: JoinWaitlistProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Initialize form
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: "",
    },
  })

  // Handle form submission
  async function onSubmit(values: WaitlistFormValues) {
    setIsSubmitting(true)

    try {
      // Prepare data for server action
      const formData: SubscribeFormData = {
        ...values,
        source,
      }

      // Call server action
      const result = await subscribeToNewsletter(formData)

      if (result.success) {
        setIsSuccess(true)
        toast.success(result.message)
        form.reset()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.")
      console.error("Waitlist submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when dialog closes
  function handleOpenChange(open: boolean) {
    setOpen(open)
    if (!open) {
      // Reset form and state when dialog closes
      form.reset()
      setIsSuccess(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button>{triggerText}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join the waitlist</DialogTitle>
          <DialogDescription>
            Be the first to know when we launch. Enter your email to get
            notified.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/20 dark:text-green-400">
              <Icons.Check className="size-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Thank you for joining!
            </h3>
            <p className="text-muted-foreground mb-6">
              We'll notify you as soon as we launch.
            </p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Icons.Spinner className="mr-2 size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
