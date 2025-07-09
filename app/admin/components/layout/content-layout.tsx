"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { PanelLeftOpen, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Dynamically import PanelGroup components with SSR disabled
const DynamicPanelGroup = dynamic(
  () => import("react-resizable-panels").then((mod) => mod.PanelGroup),
  { ssr: false }
)
const DynamicPanel = dynamic(
  () => import("react-resizable-panels").then((mod) => mod.Panel),
  { ssr: false }
)
const DynamicPanelResizeHandle = dynamic(
  () => import("react-resizable-panels").then((mod) => mod.PanelResizeHandle),
  { ssr: false }
)

// Custom hook to check if component is mounted (client-side only)
function useHasMounted() {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

// Custom hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 768) // 768px is the md breakpoint in Tailwind
      }

      // Initial check
      checkIsMobile()

      // Add event listener for window resize
      window.addEventListener("resize", checkIsMobile)

      // Cleanup
      return () => window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}

// Create a context to manage the detail panel state
const ContentLayoutContext = React.createContext<{
  isDetailOpen: boolean
  setIsDetailOpen: (open: boolean) => void
  sidebarWidth: number
  setSidebarWidth: (width: number) => void
}>({
  isDetailOpen: false,
  setIsDetailOpen: () => {},
  sidebarWidth: 320,
  setSidebarWidth: () => {},
})

//  Export a hook for child components to control the detail panel state
export function useContentLayout() {
  return React.useContext(ContentLayoutContext)
}

interface ContentLayoutProps {
  children: React.ReactNode
  sidebarContent: React.ReactNode
  defaultSidebarWidth?: number
  minSidebarWidth?: number
  maxSidebarWidth?: number
}

export function ContentLayout({
  children,
  sidebarContent,
  defaultSidebarWidth = 320,
  minSidebarWidth = 5,
  maxSidebarWidth = 60,
}: ContentLayoutProps) {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [sidebarWidth, setSidebarWidth] = React.useState(defaultSidebarWidth)


  // Listen for URL parameter changes, show detail panel when specific parameters are present
  React.useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const handleUrlChange = () => {
      const url = new URL(window.location.href)
      const hasDetailParam = url.searchParams.has("id")
      if (hasDetailParam) {
        setIsDetailOpen(true)
      }
    }

    // Initial check
    handleUrlChange()

    // Add event listener
    window.addEventListener("popstate", handleUrlChange)

    // Cleanup function
    return () => {
      window.removeEventListener("popstate", handleUrlChange)
    }
  }, [])

  // Sidebar content component
  const SidebarContent = React.useCallback(
    () => (
      <ScrollArea className="flex-1">
        <div className="p-2">{sidebarContent}</div>
      </ScrollArea>
    ),
    [sidebarContent]
  )

  // Mobile menu button component
  const MobileMenuButton = React.useCallback(
    () => (
      // <div className="absolute top-4 right-4 z-10 md:hidden">
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => setIsSidebarOpen(true)}
        >
          <PanelLeftOpen className="h-4 w-4" />
          <span className="sr-only">Open Content Sidebar</span>
        </Button>
      </div>
    ),
    [setIsSidebarOpen]
  )

  // Detail panel close button component
  const DetailCloseButton = React.useCallback(
    ({ className = "" }) => (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        onClick={() => setIsDetailOpen(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    ),
    [setIsDetailOpen]
  )

  // Provide context value
  const contextValue = React.useMemo(
    () => ({
      isDetailOpen,
      setIsDetailOpen,
      sidebarWidth,
      setSidebarWidth,
    }),
    [isDetailOpen, sidebarWidth]
  )

  // Handle panel resize with performance optimizations
  const handlePanelResize = React.useCallback(
    (sizes: number[]) => {
      // Only run on client side
      if (typeof window === "undefined") return

      // Make sure we have valid sizes
      if (!sizes?.length) return

      // Get the sidebar panel size (first panel, index 0)
      const sidebarSizePercentage = sizes[0]

      // Convert the percentage to pixels based on the container width
      const containerWidth = window.innerWidth
      const newWidthInPixels = Math.round(
        (sidebarSizePercentage / 100) * containerWidth
      )

      // Only update if it's a significant change to avoid unnecessary re-renders
      if (Math.abs(newWidthInPixels - sidebarWidth) > 1) {
        setSidebarWidth(newWidthInPixels)

        // Only store desktop width in localStorage
        if (window.innerWidth >= 768) {
          try {
            localStorage.setItem(
              "sidebar-width-desktop",
              String(newWidthInPixels)
            )
          } catch (error) {
            console.error("Error saving sidebar width to localStorage:", error)
          }
        }
      }
    },
    [sidebarWidth]
  )

  // Initial sidebar percentage (as percentage of window width)
  const [sidebarPercentage, setSidebarPercentage] = React.useState(25)

  // Initialize sidebar width and percentage on client side
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const isMobileDevice = window.innerWidth < 768

    // Mobile devices use a fixed width
    if (isMobileDevice) {
      const mobileWidth = Math.min(defaultSidebarWidth, window.innerWidth * 0.8)
      setSidebarWidth(mobileWidth)
      return
    }

    // For desktop: try to get saved width from localStorage
    try {
      const savedWidth = localStorage.getItem("sidebar-width-desktop")
      if (savedWidth) {
        const parsedWidth = parseInt(savedWidth, 10)
        if (!isNaN(parsedWidth)) {
          setSidebarWidth(parsedWidth)
          setSidebarPercentage((parsedWidth / window.innerWidth) * 100)
          return
        }
      }
    } catch (error) {
      console.error("Error reading sidebar width from localStorage:", error)
    }

    // Fall back to default width for desktop
    setSidebarWidth(defaultSidebarWidth)
    setSidebarPercentage((defaultSidebarWidth / window.innerWidth) * 100)
  }, [defaultSidebarWidth])

  // Check if mounted (client-side only) and if on mobile
  const hasMounted = useHasMounted()
  const isMobile = useIsMobile()

  return (
    <ContentLayoutContext.Provider value={contextValue}>
      <div className="flex h-full overflow-hidden rounded-lg">
        {/* Desktop layout with resizable panels */}
        <div className="h-full w-full">
          {hasMounted ? (
            <DynamicPanelGroup
              direction="horizontal"
              onLayout={handlePanelResize}
            >
              {/* Sidebar panel - only visible on desktop */}
              <DynamicPanel
                defaultSize={sidebarPercentage}
                minSize={minSidebarWidth}
                maxSize={maxSidebarWidth}
                order={1}
                className="bg-muted/20 hidden h-full flex-col border-r md:flex"
              >
                <SidebarContent />
              </DynamicPanel>
              {/* Resize handle - only visible on desktop */}
              <DynamicPanelResizeHandle className="group bg-border hover:bg-primary/20 active:bg-primary/40 relative hidden w-1 cursor-col-resize transition-colors md:block">
                <div className="bg-border group-hover:bg-primary/50 group-active:bg-primary absolute top-1/2 left-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              </DynamicPanelResizeHandle>
              {/* Content panel - always visible */}
              <DynamicPanel
                order={2}
                className="relative flex h-full flex-1 flex-col overflow-hidden"
                // On mobile, this panel should take full width
                defaultSize={isMobile ? 100 : 100 - sidebarPercentage}
              >
                {isDetailOpen ? (
                  <div className="flex flex-1 flex-col overflow-auto">
                    <div className="flex items-center px-3 py-2 md:hidden">
                      <Sheet
                        open={isSidebarOpen}
                        onOpenChange={setIsSidebarOpen}
                      >
                        <SheetTrigger asChild>
                          <MobileMenuButton />
                        </SheetTrigger>
                        <SheetContent
                          side="left"
                          className="flex flex-col p-0"
                          style={{ width: "80vw" }}
                        >
                          <SheetHeader>
                            <SheetTitle></SheetTitle>
                          </SheetHeader>
                          <SidebarContent />
                        </SheetContent>
                      </Sheet>
                    </div>
                    <div className="flex-1 overflow-auto p-6">{children}</div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="max-w-md text-center">
                      <h3 className="mb-2 text-xl font-medium">
                        No selected item
                      </h3>
                      <p className="text-muted-foreground">
                        Select an item from the left list to edit, or click the
                        add button to create a new item.
                      </p>
                    </div>
                  </div>
                )}
              </DynamicPanel>
            </DynamicPanelGroup>
          ) : (
            <div className="flex h-full flex-col md:flex-row">
              {/* Placeholder layout during SSR */}
              <div
                className="bg-muted/20 flex h-auto flex-col border-r border-b md:h-full md:border-b-0"
                style={{
                  width: isMobile ? "100%" : `${defaultSidebarWidth}px`,
                  maxHeight: isMobile ? "50vh" : "auto",
                }}
              >
                <SidebarContent />
              </div>
              <div className="relative flex h-full flex-1 flex-col overflow-hidden">
                {/* Mobile menu button - visible only on mobile */}
                <MobileMenuButton />

                {isDetailOpen ? (
                  <div className="flex flex-1 flex-col overflow-auto">
                    {/* <div className="flex items-center justify-between px-3 py-2">
                      <h3 className="text-lg font-medium">Details</h3>
                      <DetailCloseButton />
                    </div> */}
                    <div className="flex-1 overflow-auto p-4 md:p-6">
                      {children}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center p-4">
                    <div className="max-w-md text-center">
                      <h3 className="mb-2 text-xl font-medium">
                        No selected item
                      </h3>
                      <p className="text-muted-foreground">
                        Select an item from the list to edit, or click the add
                        button to create a new item.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentLayoutContext.Provider>
  )
}
