import { AdminPanelConfig } from "@/types"

export const adminPanelConfig: AdminPanelConfig = {
  navDashboard: {
    title: "Dashboard",
    href: "/admin",
    icon: "LayoutDashboard",
  },
  navContent: [
    // {
    //   title: "Media Library",
    //   href: "/admin/media",
    //   icon: "ImagePlay",
    // },
    {
      title: "Subscriptions",
      href: "/admin/subscriptions",
      icon: "Package",
    },
    {
      title: "Purchase Orders",
      href: "/admin/orders",
      icon: "CreditCard",
    },
    {
      title: "Audience",
      href: "/admin/audience",
      icon: "Mail",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: "Users",
    },
    // {
    //   title: "Settings",
    //   href: "/admin/settings",
    //   icon: "Settings2",
    // },
    // {
    //   title: "Help",
    //   href: "/admin/help",
    //   icon: "HelpCircle",
    // },
  ],
}
