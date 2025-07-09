import * as React from "react"

import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

interface ModalProps {
  children: React.ReactNode
  title: string
  className?: string
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  onClose?: () => void
  desktopOnly?: boolean
  preventDefaultClose?: boolean
}

export function Modal({
  children,
  title,
  className,
  open,
  setOpen,
  onClose,
  desktopOnly,
  preventDefaultClose,
}: ModalProps) {
  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return
    }
    // fire onClose event if provided
    if (onClose) {
      onClose()
    }

    if (setOpen) {
      setOpen(false)
    }
  }
  const { isDesktop } = useMediaQuery()

  if (isDesktop || desktopOnly) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            closeModal()
          }
        }}
      >
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "overflow-hidden p-0 md:max-w-md md:rounded-2xl md:border",
            className
          )}
        >
          <DialogTitle className="px-6 py-4 text-lg font-semibold">
            {title}
          </DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          closeModal({ dragged: true })
        }
      }}
    >
      <DrawerContent
        className={cn(
          "bg-background fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border",
          className
        )}
      >
        {children}
      </DrawerContent>
    </Drawer>
  )
}
