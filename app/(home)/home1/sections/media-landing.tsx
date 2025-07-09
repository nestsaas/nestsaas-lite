import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Mail, SendHorizonal } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function MediaSection() {
  return (
    <section id="media" className="overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-20">
        <div className="lg:flex lg:items-center lg:gap-12">
          <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
            <Link
              href="/docs"
              className="mx-auto flex w-fit items-center gap-2 rounded-(--radius) border p-1 pr-3 lg:ml-0"
            >
              <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">
                New
              </span>
              <span className="text-sm">Introduction Media Library</span>
              <span className="block h-4 w-px bg-(--color-border)"></span>

              <ArrowRight className="size-4" />
            </Link>

            <h2 className="mt-10 text-4xl font-bold text-balance md:text-5xl xl:text-5xl">
              Media Library, Manage Your Media Files
            </h2>
            <p className="mt-8">
              A powerful Media Library to manage your media files, images,
              videos, and documents. With built-in image optimization,
              compression and blurhash support.
            </p>

            <div>
              {/* <form
                    action=""
                    className="mx-auto my-10 max-w-sm lg:my-12 lg:mr-auto lg:ml-0"
                  >
                    <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                      <Mail className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                      <input
                        placeholder="Your mail address"
                        className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                        type="email"
                      />

                      <div className="md:pr-1.5 lg:pr-0">
                        <Button
                          aria-label="submit"
                          className="rounded-(--radius)"
                        >
                          <span className="hidden md:block">Get Started</span>
                          <SendHorizonal
                            className="relative mx-auto size-5 md:hidden"
                            strokeWidth={2}
                          />
                        </Button>
                      </div>
                    </div>
                  </form> */}
              <div className="mx-auto mt-10 mb-3 max-w-sm lg:mt-12 lg:mr-auto lg:ml-0">
                Storage Can be one of
              </div>
              <ul className="list-inside list-disc space-y-2">
                <li>Local</li>
                <li>Aws S3</li>
                <li>Cloudflare R2</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3">
          <div className="relative">
            <div className="to-background absolute -inset-17 z-1 bg-radial-[at_60%_30%] from-transparent to-40%"></div>
            <Image
              className="hidden dark:block"
              src="/images/music.webp"
              alt="app illustration"
              width={2796}
              height={2008}
            />
            <Image
              className="dark:hidden"
              src="/images/music-light.webp"
              alt="app illustration"
              width={2796}
              height={2008}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
