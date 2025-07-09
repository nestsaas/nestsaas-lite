import Link from "next/link"
import { CircleCheckBig, Key, Sparkles, SquareFunction } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeaderSection } from "@/components/shared/header-section"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

const licenseData = [
  {
    feature: "Projects",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "Repository Users",
    free: "0",
    pro: "1",
    teams: "Up to 5 members (contact us for more)",
  },
  {
    feature: "License Length",
    free: false,
    pro: "Lifetime",
    teams: "Lifetime",
  },
  {
    feature: "Updates",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "Showcase your products ",
    free: "",
    pro: true,
    teams: true,
  },
  {
    feature: "Email and Community Support",
    free: "",
    pro: true,
    teams: true,
  },
  {
    feature: "Private Threads",
    free: "",
    pro: false,
    teams: true,
  },
]

const featuresData = [
  {
    feature: "Authentication",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "Payments and Subscriptions",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "CMS & Super Admin",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "Space System",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "Media Library",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "Blog & Content Collections",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "Documentation system",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "Emails",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "RSS Feed",
    free: true,
    pro: true,
    teams: true,
  },
  {
    feature: "Upcoming premium space templates",
    free: false,
    pro: false,
    teams: true,
  },
]

export default function PricingComparator() {
  return (
    <section id="comparator" className="pb-16 md:pb-32">
      <MaxWidthWrapper>
        {/* <HeaderSection label="Compare plans" title="" subtitle="" /> */}
        <div className="mt-4 w-full overflow-auto lg:overflow-visible">
          <table className="w-[200vw] border-separate border-spacing-x-3 md:w-full dark:[--color-muted:var(--color-zinc-900)]">
            <thead className="bg-background sticky top-16">
              <tr className="*:py-4 *:text-left *:font-medium">
                <th className="lg:w-2/5">
                  <span className="block text-xl font-medium">
                    Compare plans
                  </span>
                </th>
                <th className="space-y-3 w-[200px]">
                  <span className="block">Free</span>

                  <Button asChild variant="outline" size="sm">
                    <Link href="https://github.com/nestsaas/nestsaas-lite" target="_blank">Get Started</Link>
                  </Button>
                </th>
                <th className="bg-muted space-y-3 rounded-t-(--radius) px-4">
                  <span className="block text-xl font-medium">Pro</span>
                  <Button asChild size="sm">
                    <Link href="#pricing">Get NestSaaS Pro</Link>
                  </Button>
                  <div className="text-muted-foreground text-sm">
                    For individual developers.
                  </div>
                </th>
                <th className="space-y-3">
                  <span className="block text-xl font-medium">Enterprise</span>
                  <Button asChild variant="outline" size="sm">
                    <Link href="#pricing">Get NestSaaS Enterprise</Link>
                  </Button>
                  <div className="text-muted-foreground text-sm">
                    For teams and enterprise.
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-caption text-sm">
              <tr className="*:py-3">
                <td className="flex items-center gap-2 font-medium">
                  <Key className="size-4" />
                  <span>License Details</span>
                </td>
                <td></td>
                <td className="bg-muted border-none px-4"></td>
                <td></td>
              </tr>
              {licenseData.map((row, index) => (
                <tr key={index} className="*:border-b *:py-3">
                  <td className="text-muted-foreground">{row.feature}</td>
                  <td>
                    {row.free === true ? (
                      <CircleCheckBig className="size-4 text-green-500" />
                    ) : (
                      row.free
                    )}
                  </td>
                  <td className="bg-muted border-none px-4">
                    <div className="-mb-3 border-b py-3">
                      {row.pro === true ? (
                        <CircleCheckBig className="size-4 text-green-500" />
                      ) : (
                        row.pro
                      )}
                    </div>
                  </td>
                  <td>
                    {row.teams === true ? (
                      <CircleCheckBig className="size-4 text-green-500" />
                    ) : (
                      row.teams
                    )}
                  </td>
                </tr>
              ))}
              <tr className="*:pt-8 *:pb-3">
                <td className="flex items-center gap-2 font-medium">
                  <SquareFunction className="size-4" />
                  <span>Features</span>
                </td>
                <td></td>
                <td className="bg-muted border-none px-4"></td>
                <td></td>
              </tr>
              {featuresData.map((row, index) => (
                <tr key={index} className="*:border-b *:py-3">
                  <td className="text-muted-foreground">{row.feature}</td>
                  <td>
                    {row.free === true ? (
                      <CircleCheckBig className="size-4 text-green-500" />
                    ) : (
                      row.free
                    )}
                  </td>
                  <td className="bg-muted border-none px-4">
                    <div className="-mb-3 border-b py-3">
                      {row.pro === true ? (
                        <CircleCheckBig className="size-4 text-green-500" />
                      ) : (
                        row.pro
                      )}
                    </div>
                  </td>
                  <td>
                    {row.teams === true ? (
                      <CircleCheckBig className="size-4 text-green-500" />
                    ) : (
                      row.teams
                    )}
                  </td>
                </tr>
              ))}
              <tr className="*:py-6">
                <td></td>
                <td></td>
                <td className="bg-muted rounded-b-(--radius) border-none px-4"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
