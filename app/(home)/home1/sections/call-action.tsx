import Link from "next/link"

import { Button } from "@/components/ui/button"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button"

export default function CallAction() {
  return (
    <div className="border-border relative z-10 mx-auto mb-32 flex max-w-7xl flex-col border backdrop-blur-sm lg:flex-row">
      <div className="border-primary/10 flex w-full flex-col items-start justify-center gap-6 border-r p-10 lg:p-12">
        <p className="text-primary/60 h-14 text-lg">
          <span className="text-primary font-semibold">Ready to dive in?</span>{" "}
          Start to build your profitable products on a solid, scalable,
          well-tested foundation today.
        </p>

        <InteractiveHoverButton>
          <Link href="#pricing" className="rounded-xl px-4">
            Get NestSaaS
          </Link>
        </InteractiveHoverButton>
      </div>
      <div className="flex w-full flex-col items-start justify-center gap-6 p-10 lg:w-[70%] lg:border-b-0 lg:p-12">
        <p className="text-primary/60 h-14 text-lg">
          <span className="text-primary font-semibold">
            Want to learn more?
          </span>{" "}
          Explore our documentation to get what you can do with NestSaaS.
        </p>

        <Button
          asChild
          size="lg"
          variant="ghost"
          className="h-10.5 rounded-full px-5"
        >
          <Link href="/docs" target="_blank" rel="noreferrer">
            <span className="font-semibold text-nowrap">
              Explore Documentation
            </span>
          </Link>
        </Button>
      </div>

      <div className="absolute top-0 left-0 z-10 flex flex-col items-center justify-center">
        <span className="bg-primary/40 absolute h-6 w-[1px]" />
        <span className="bg-primary/40 absolute h-[1px] w-6" />
      </div>
      <div className="absolute right-0 bottom-0 z-10 flex flex-col items-center justify-center">
        <span className="bg-primary/40 absolute h-6 w-[1px]" />
        <span className="bg-primary/40 absolute h-[1px] w-6" />
      </div>
    </div>
  )
}
