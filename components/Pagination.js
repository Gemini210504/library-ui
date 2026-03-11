import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={`mx-auto flex w-full justify-center ${className}`}
    {...props}
  />
);

const PaginationContent = ({ className, ...props }) => (
  <ul
    className={`flex flex-row items-center gap-1 ${className}`}
    {...props}
  />
);

const PaginationItem = ({ className, ...props }) => (
  <li className={className} {...props} />
);

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
  <Link
    aria-current={isActive ? "page" : undefined}
    className={`inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 ${
      isActive
        ? "bg-zinc-900 text-zinc-50 shadow dark:bg-zinc-50 dark:text-zinc-900"
        : "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
    } ${size === "icon" ? "h-9 w-9" : "px-4 py-2"} ${className}`}
    {...props}
  />
);

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={`gap-1 pl-2.5 ${className}`}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={`gap-1 pr-2.5 ${className}`}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={`flex h-9 w-9 items-center justify-center ${className}`}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

// Default export for ease of use in the existing project
export default function SmartPagination({ totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 0;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <Pagination className="px-4 py-6 sm:px-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={createPageURL(Math.max(0, currentPage - 1))}
            className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink 
              href={createPageURL(page)} 
              isActive={currentPage === page}
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            href={createPageURL(Math.min(totalPages - 1, currentPage + 1))}
            className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
