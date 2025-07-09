import React from "react"
import Link from "next/link"
import { ArrowRight, Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/magicui/blur-fade"
import { AnimatedGroup } from "@/components/motion-primitives/animated-group"

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export default function HeroSection() {
  return (
    <>
      <main className="overflow-hidden">
        <section className="relative">
          <div className="relative py-24 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mt-0 lg:mr-auto lg:w-4/5">
                {/* <Link
                  href="/"
                  className="mx-auto flex w-fit items-center gap-2 rounded-(--radius) border p-1 pr-3"
                >
                  <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">
                    New
                  </span>
                  <span className="text-sm">Introduction Tailark Html</span>
                  <span className="block h-4 w-px bg-(--color-border)"></span>

                  <ArrowRight className="size-4" />
                </Link> */}

                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#pricing"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="text-foreground text-sm">
                      🎉 Early birds get 20% off
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>
                <BlurFade delay={0} inView>
                  <h1 className="mt-8 text-4xl font-bold md:text-5xl xl:text-5xl xl:[line-height:1.125]">
                    {/* Turn your idea into revenue, faster. */}
                    Your idea, live in days.
                    <br /> with{" "}
                    <span className="text-gradient_indigo-purple">
                      NestSaaS
                    </span>
                  </h1>

                  <p className="mx-auto mt-8 hidden max-w-2xl text-lg text-balance sm:block">
                    A modern framework for building content-driven website and
                    SaaS applications with powerful management tools
                    {/* Production-ready from day one — launch your SaaS or content
                    site in days, and scale without the setup headaches. */}
                  </p>

                  <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                    <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-xl px-5 text-base"
                      >
                        <Link href="#pricing">
                          <span className="text-nowrap">Get NestSaaS</span>
                        </Link>
                      </Button>
                    </div>

                    <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="h-10.5 rounded-xl px-5"
                    >
                      <Link href="/docs" target="_blank" rel="noreferrer">
                        <span className="text-nowrap">
                          Explore Documentation
                        </span>
                      </Link>
                    </Button>
                  </div>
                </BlurFade>
              </div>
              <div className="x-auto relative mx-auto mt-8 max-w-lg sm:mt-12">
                <div className="absolute inset-0 -top-8 left-1/2 -z-20 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)] dark:opacity-10"></div>
                <div className="absolute inset-x-0 top-12 -z-[1] mx-auto h-1/3 w-2/3 rounded-full bg-blue-300 blur-3xl dark:bg-white/20"></div>

                <div className=""></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
