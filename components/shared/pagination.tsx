"use client"

import React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showFirstLast?: boolean
  maxVisible?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisible = 5,
}: PaginationProps) {
  // If only one page, do not display pagination
  if (totalPages <= 1) return null

  // Calculate visible pages
  const getVisiblePages = () => {
    // If total pages is less than or equal to maxVisible, show all pages
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Ensure pages around current page are visible
    const halfVisible = Math.floor(maxVisible / 2)
    let startPage = Math.max(currentPage - halfVisible, 1)
    const endPage = Math.min(startPage + maxVisible - 1, totalPages)

    // Adjust start page to ensure correct number of pages
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(endPage - maxVisible + 1, 1)
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    )
  }

  const visiblePages = getVisiblePages()

  // Check if ellipsis is needed
  const showLeftEllipsis = visiblePages[0] > 1
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages

  return (
    <nav
      className={cn("flex items-center justify-center space-x-1", className)}
      aria-label="Pagination"
    >
      {/* Previous page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* First page button */}
      {showFirstLast && showLeftEllipsis && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(1)}
            aria-label="Page 1"
            aria-current={currentPage === 1 ? "page" : undefined}
          >
            1
          </Button>
          <span className="flex items-center justify-center">
            <MoreHorizontal className="text-muted-foreground h-4 w-4" />
          </span>
        </>
      )}

      {/* Page number buttons */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </Button>
      ))}

      {/* Last page button */}
      {showFirstLast && showRightEllipsis && (
        <>
          <span className="flex items-center justify-center">
            <MoreHorizontal className="text-muted-foreground h-4 w-4" />
          </span>
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(totalPages)}
            aria-label={`Page ${totalPages}`}
            aria-current={currentPage === totalPages ? "page" : undefined}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
