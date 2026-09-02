import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

export default memo(function PaginationWithPrimaryButton({
  className,
  currentPage,
  totalPages,
  onPageChange,
  ...props
}) {
  const navigate = useNavigate();

  const currentPageNumber = Math.min(
    Math.max(parseInt(currentPage?.get("page")) || 1, 1),
    totalPages,
  );
  const previousPage = Math.max(currentPageNumber - 1, 1);
  const nextPage = Math.min(currentPageNumber + 1, totalPages);

  console.warn(
    "TODO: Remove this auto upadation each time parent changes, in search page",
  );

  return (
    <Pagination className={cn("w-full", className)} {...props}>
      <PaginationContent className="w-full flex flex-row justify-end px-4 py-2">
        {currentPageNumber > 1 && (
          <>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious
                disabled={currentPageNumber === 1}
                onClick={() => {
                  onPageChange(previousPage);
                }}
              />
            </PaginationItem>
            <PaginationItem className="cursor-pointer">
              <PaginationLink onClick={() => onPageChange(previousPage)}>
                {previousPage}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem className="cursor-pointer">
          <PaginationLink
            className={cn(
              "shadow-none! hover:text-primary-foreground! dark:bg-primary dark:hover:bg-primary/90",
              buttonVariants({
                variant: "default",
                size: "icon",
              }),
            )}
            onClick={() => onPageChange(currentPageNumber)}
            isActive
          >
            {currentPageNumber}
          </PaginationLink>
        </PaginationItem>
        {currentPageNumber < totalPages && (
          <>
            <PaginationItem className="cursor-pointer">
              <PaginationLink onClick={() => onPageChange(nextPage)}>
                {nextPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem className="cursor-pointer">
              <PaginationNext
                onClick={() => {
                  onPageChange(nextPage);
                }}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
});
