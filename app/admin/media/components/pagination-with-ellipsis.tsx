"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationWithEllipsisProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationWithEllipsis({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationWithEllipsisProps) {
  if (totalPages <= 0) return null

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          let pageNum = i + 1

          // For more than 5 pages, show first, last, current and surrounding pages
          if (totalPages > 5) {
            if (currentPage <= 3) {
              // Near start: show 1,2,3,4,...,last
              pageNum = i + 1
              if (i === 4) pageNum = totalPages
            } else if (currentPage >= totalPages - 2) {
              // Near end: show 1,...,last-3,last-2,last-1,last
              pageNum = i === 0 ? 1 : totalPages - (4 - i)
            } else {
              // Middle: show 1,...,current-1,current,current+1,...,last
              if (i === 0) pageNum = 1
              else if (i === 4) pageNum = totalPages
              else pageNum = currentPage + (i - 2)
            }
          }

          // Show ellipsis for gaps
          if (
            (totalPages > 5 && i === 1 && pageNum !== 2) ||
            (totalPages > 5 && i === 3 && pageNum !== totalPages - 1)
          ) {
            return (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={`page-${pageNum}`}>
              <PaginationLink
                isActive={currentPage === pageNum}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
