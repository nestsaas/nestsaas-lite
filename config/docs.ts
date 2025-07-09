import { DocsConfig } from "@/types"

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: "Getting Started",
      href: "#",
      children: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Stripe Recommendations",
          href: "/docs/stripe",
        },
      ],
    },
    // {
    //   title: "Configuration",
    //   href: "#",
    //   children: [
    //     {
    //       title: "Authentification",
    //       href: "/docs/",
    //     },
    //     {
    //       title: "Blog",
    //       href: "/docs",
    //     },
    //     {
    //       title: "Components",
    //       href: "/docs",
    //     },
    //     {
    //       title: "Config files",
    //       href: "/docs",
    //     },
    //     {
    //       title: "Database",
    //       href: "/docs",
    //     },
    //     {
    //       title: "Subscriptions",
    //       href: "/docs",
    //     },
    //   ],
    // },
  ],
}