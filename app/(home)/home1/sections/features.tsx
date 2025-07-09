import Link from "next/link"

import { features } from "@/config/landing"
import { Button } from "@/components/ui/button"
import { HeaderSection } from "@/components/shared/header-section"
import { Icons } from "@/components/shared/icons"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

export default function Features() {
  return (
    <section id="features">
      <div className="pt-28 pb-6">
        <MaxWidthWrapper>
          <HeaderSection
            label="Features"
            title="Turn your idea into revenue, faster."
            subtitle="Skip the boring setup. With our pre-built React codebase, you can launch faster, test smarter, and start earning sooner. We've done the heavy lifting — you build the future."
          />

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = Icons[feature.icon || "nextjs"]
              return (
                <div
                  className="group bg-background relative overflow-hidden rounded-2xl border px-6 py-4"
                  key={feature.title}
                >
                  {/* from-amber-500/80 */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-indigo-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
                  />
                  <div className="relative">
                    {/* <div className="border-border relative flex size-12 rounded-2xl border shadow-sm *:relative *:m-auto *:size-6">
                      <Icon />
                    </div> */}

                    <h3 className="text-lg font-bold">{feature.title}</h3>

                    <p className="text-muted-foreground mt-3 pb-3">
                      {feature.description}
                    </p>

                    <div className="border-muted flex gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-xl px-4"
                      >
                        <Link
                          href={feature.link}
                          className="flex items-center gap-2"
                        >
                          <span>Visit the docs</span>
                          <Icons.ArrowUpRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  )
}
