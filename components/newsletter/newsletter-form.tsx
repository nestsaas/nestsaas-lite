"use client"

import { useState } from "react"
import {
  SubscribeFormData,
  subscribeToNewsletter,
} from "@/actions/newsletter-actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email.",
  }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  source: z.string().optional(),
})

interface NewsletterFormProps {
  source?: string
  className?: string
}

export function NewsletterForm({
  source = "website",
  className = "",
}: NewsletterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      source,
    },
  })

  async function onSubmit(data: SubscribeFormData) {
    try {
      setIsSubmitting(true)
      const result = await subscribeToNewsletter(data)

      if (result.success) {
        // setIsSuccess(true)
        form.reset()
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      console.error("Newsletter subscription error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // If subscription is successful, show success message
  // if (isSuccess) {
  //   return (
  //     <div className="flex flex-col items-center justify-center space-y-2 text-center">
  //       <p className="text-sm font-medium">Thank you for subscribing!</p>
  //     </div>
  //   )
  // }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`w-full ${className}`}
      >
        <div className="relative">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="email"
                    className="bg-background h-10 rounded-full px-4 pr-[110px]"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="absolute top-1 right-1 h-8 rounded-full"
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
            {!isSubmitting && <ArrowRight className="ml-2 h-3 w-3" />}
          </Button>
        </div>
      </form>
    </Form>
  )
}
