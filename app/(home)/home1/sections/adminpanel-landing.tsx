"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ChartBarIncreasingIcon,
  Database,
  Fingerprint,
  IdCard,
  User,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BorderBeam } from "@/components/magicui/border-beam"

export default function Features() {
  type ImageKey = "item-1" | "item-3" | "item-5"
  const [activeItem, setActiveItem] = useState<ImageKey>("item-1")

  const images = {
    "item-1": {
      image: "/images/landingpage/admindashboard.jpg",
      alt: "Admin dashboard",
    },
    "item-3": {
      image: "/images/landingpage/subscriptions.jpg",
      alt: "Subscriptions & billing",
    },
    "item-5": {
      image: "/images/landingpage/users.jpg",
      alt: "Users Management",
    },
  }

  return (
    <section id="adminpanel" className="py-12 md:py-20 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-linear-to-b sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]"></div>
      <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[40px]">
            The Admin Panel
          </h2>
          <p>
            Manage your content, users, payments, and more with the
            admin panel.
          </p>
        </div>

        <div className="grid gap-12 sm:px-12 md:grid-cols-3 lg:gap-20 lg:px-0">
          <Accordion
            type="single"
            value={activeItem}
            onValueChange={(value) => setActiveItem(value as ImageKey)}
            className="col-span-1 w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <Fingerprint className="size-4" />
                  Admin dashboard
                </div>
              </AccordionTrigger>
              <AccordionContent>
                A user-friendly interface for displaying statistics and managing
                your content.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <IdCard className="size-4" />
                  Manage subscriptions & billings
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Manage payments, including one-time purchase orders and
                recurring subscriptions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <User className="size-4" />
                  Manage users
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Manage users, view user profiles, user purchase and user
                subscriptions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-background relative col-span-2 flex overflow-hidden rounded-3xl border p-2">
            <div className="to-background absolute -inset-17 z-1 bg-radial-[at_35%_25%] from-transparent to-80%"></div>
            <div className="bg-background relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeItem}-id`}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="bg-background size-full overflow-hidden border shadow-md"
                >
                  <Image
                    src={images[activeItem].image}
                    className="size-full object-cover object-left-top dark:mix-blend-lighten"
                    alt={images[activeItem].alt}
                    width={1207}
                    height={929}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
