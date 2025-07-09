"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { unsubscribeFromNewsletter } from "@/actions/newsletter-actions"
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
    message: "Please enter a valid email address.",
  }),
})

interface UnsubscribeFormProps {
  email?: string
}

export function UnsubscribeForm({ email = "" }: UnsubscribeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true)
      const result = await unsubscribeFromNewsletter(data.email)
      
      if (result.success) {
        setIsSuccess(true)
        form.reset()
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      console.error("Newsletter unsubscribe error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <p className="text-sm font-medium">You have been successfully unsubscribed.</p>
        <p className="text-muted-foreground text-xs">
          You will no longer receive our newsletter emails.
        </p>
      </div>
    )
  }
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
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
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Unsubscribe"}
        </Button>
      </form>
    </Form>
  )
}
