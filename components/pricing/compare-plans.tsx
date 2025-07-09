import { PlansRow } from "@/types"
import { CircleCheck, Info } from "lucide-react"

import { comparePlans, plansColumns } from "@/config/payments"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HeaderSection } from "@/components/shared/header-section"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

export function ComparePlans() {
  const renderCell = (value: string | boolean | null) => {
    if (value === null) return "—"
    if (typeof value === "boolean")
      return value ? <CircleCheck className="mx-auto size-[22px]" /> : "—"
    return value
  }

  return (
    <MaxWidthWrapper>
      <HeaderSection
        label="Plans"
        title="Compare Our Plans"
        subtitle="Find the perfect plan tailored for your business needs!"
      />

      <div className="my-10 overflow-x-scroll max-lg:mx-[-0.8rem] md:overflow-x-visible">
        <table className="w-full table-fixed">
          <thead>
            <tr className="divide-border divide-x border">
              <th className="bg-accent sticky left-0 z-20 w-40 p-5 md:w-1/4 lg:top-14"></th>
              {plansColumns.map((col) => (
                <th
                  key={col}
                  className="bg-accent font-heading sticky z-10 w-40 p-5 text-xl tracking-wide capitalize md:w-auto lg:top-14 lg:text-2xl"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border divide-x border">
            {comparePlans.map((row: PlansRow, index: number) => (
              <tr key={index} className="divide-border divide-x border">
                <td
                  data-tip={row.tooltip ? row.tooltip : ""}
                  className="bg-accent sticky left-0 md:bg-transparent"
                >
                  <div className="flex items-center justify-between space-x-2 p-4">
                    <span className="text-[15px] font-medium lg:text-base">
                      {row.feature}
                    </span>
                    {row.tooltip && (
                      <Popover>
                        <PopoverTrigger className="hover:bg-muted rounded p-1">
                          <Info className="text-muted-foreground size-[18px]" />
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          className="max-w-80 p-3 text-sm"
                        >
                          {row.tooltip}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </td>
                {plansColumns.map((col) => (
                  <td
                    key={col}
                    className="text-muted-foreground p-4 text-center text-[15px] lg:text-base"
                  >
                    {renderCell(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MaxWidthWrapper>
  )
}
