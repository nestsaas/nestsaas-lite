"use client"

import * as React from "react"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <Button
      variant="secondary"
      size="icon"
      className="group/toggle size-8"
      onClick={toggleTheme}
    >
      {resolvedTheme === "dark" ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
