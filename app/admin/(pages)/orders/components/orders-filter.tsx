"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const filterSchema = z.object({
  status: z.string().optional(),
  product: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

type FilterValues = z.infer<typeof filterSchema>

interface OrdersFilterProps {
  productOptions: string[]
  currentStatus?: string
  currentProduct?: string
  currentStartDate?: string
  currentEndDate?: string
}

export function OrdersFilter({
  productOptions,
  currentStatus,
  currentProduct,
  currentStartDate,
  currentEndDate,
}: OrdersFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse dates if they exist
  const parsedStartDate = currentStartDate
    ? new Date(currentStartDate)
    : undefined
  const parsedEndDate = currentEndDate ? new Date(currentEndDate) : undefined

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: currentStatus || "all",
      product: currentProduct || "all",
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    },
  })

  function onSubmit(values: FilterValues) {
    const params = new URLSearchParams(searchParams.toString())

    // Reset to page 1 when filters change
    params.set("page", "1")

    // Update or remove status param
    if (values.status && values.status !== "all") {
      params.set("status", values.status)
    } else {
      params.delete("status")
    }

    // Update or remove product param
    if (values.product && values.product !== "all") {
      params.set("product", values.product)
    } else {
      params.delete("product")
    }

    // Update or remove date params
    if (values.startDate) {
      params.set("startDate", format(values.startDate, "yyyy-MM-dd"))
    } else {
      params.delete("startDate")
    }

    if (values.endDate) {
      params.set("endDate", format(values.endDate, "yyyy-MM-dd"))
    } else {
      params.delete("endDate")
    }

    router.push(`?${params.toString()}`)
  }

  function resetFilters() {
    form.reset({
      status: "all",
      product: "all",
      startDate: undefined,
      endDate: undefined,
    })

    const params = new URLSearchParams()
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-[160px]">
                {/* <FormLabel>Status</FormLabel> */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-[160px]">
                {/* <FormLabel>Product</FormLabel> */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All products" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All products</SelectItem>
                    {productOptions.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-[160px]">
                {/* <FormLabel>Start Date</FormLabel> */}
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick start date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const endDate = form.getValues("endDate")
                        return endDate ? date > endDate : false
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-[160px]">
                {/* <FormLabel>End Date</FormLabel> */}
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues("startDate")
                        return startDate ? date < startDate : false
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <div className="flex space-x-2">
            <Button type="submit">Apply Filters</Button>
            <Button type="button" variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
