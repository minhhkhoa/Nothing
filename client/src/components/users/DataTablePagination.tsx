"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1; // đổi sang 1-based
  const footerTranslation = useTranslations("footer");

  const getPageNumbers = (current: number, total: number, delta = 1) => {
    const pages: (number | string)[] = [];

    const left = Math.max(1, current - delta);
    const right = Math.min(total, current + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < total) {
      if (right < total - 1) pages.push("...");
      pages.push(total);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Left: thông tin */}
      <div className="text-sm text-muted-foreground">
        {footerTranslation("page")} {currentPage} / {pageCount}
      </div>

      {/* Center: chọn page size */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">{footerTranslation("pageSize")}</span>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right: pagination */}
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {footerTranslation("firstPage")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>

        {getPageNumbers(currentPage, pageCount).map((page, i) =>
          page === "..." ? (
            <span key={i} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={i}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => table.setPageIndex((page as number) - 1)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          {footerTranslation("lastPage")}
        </Button>
      </div>
    </div>
  );
}
