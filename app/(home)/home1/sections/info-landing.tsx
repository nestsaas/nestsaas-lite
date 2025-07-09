import Image from "next/image"
import { InfoLdg } from "@/types"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/shared/icons"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

interface InfoLandingProps {
  data: InfoLdg
  reverse?: boolean
}

export default function InfoLanding({
  data,
  reverse = false,
}: InfoLandingProps) {
  return (
    <div className="py-10 sm:py-20">
      <MaxWidthWrapper className="grid gap-10 px-2.5 lg:grid-cols-2 lg:items-center lg:px-7">
        <div className={cn(reverse ? "lg:order-2" : "lg:order-1")}>
          <h2 className="font-heading text-foreground text-2xl md:text-4xl lg:text-[40px]">
            {data.title}
          </h2>
          {/* <p className="text-muted-foreground mt-4 text-base">
            {data.description}
          </p> */}
          <dl className="mt-10 space-y-4 leading-7">
            {data.list.map((item, index) => {
              const Icon = Icons[item.icon || "ArrowRight"]
              return (
                <div className="relative pl-8" key={index}>
                  <dt className="font-semibold">
                    <Icon className="absolute top-1 left-0 size-5 stroke-purple-700" />
                    <span>{item.title}</span>
                  </dt>
                  <dd className="text-muted-foreground text-sm">
                    {item.description}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
        <div
          className={cn(
            "overflow-hidden lg:-m-4",
            reverse ? "order-1" : "order-2"
          )}
        >
          <div className="aspect-video">
            <Image
              className="size-full object-fill object-center"
              src={data.image}
              alt={data.title}
              width={1000}
              height={500}
              priority={true}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
