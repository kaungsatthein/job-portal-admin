import { Fragment } from "react";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ColumnHeader } from "./column-header";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  isPending?: boolean;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  total,
  isPending,
}: DataTableProps<TData, TValue>) => {
  const numberColumn: ColumnDef<TData, any> = {
    id: "__number",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="No." />;
    },
    cell: ({ row }) => {
      const paginatedNo = (page - 1) * limit + row.index + 1;
      return <p className="text-center">{paginatedNo}</p>;
    },
  };
  const table = useReactTable({
    data,
    columns: [numberColumn, ...columns],
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const totalPages = Math.ceil(total / limit);

  const updateSearchParams = (params: URLSearchParams) => {
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    updateSearchParams(params);
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1"); // reset to first page
    updateSearchParams(params);
  };

  return (
    <>
      <div className="space-y-4">
        <Table className="border-t border-b">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-12 bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-0"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isPending ? (
              [...Array(5)].map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className="h-18">
                  {columns.map((_, colIndex) => (
                    <TableCell key={`skeleton-cell-${colIndex}`}>
                      <Skeleton className="h-6 w-full rounded-lg" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    className="h-15"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 whitespace-nowrap first:pl-6 last:pr-6 [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 md:flex-nowrap md:gap-8">
        <div className="flex items-center gap-2.5 md:w-full">
          <Label className="font-normal">Rows per page</Label>
          <Select
            disabled={isPending}
            defaultValue={limit.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-fit border-gray-300/70 whitespace-nowrap shadow-xs data-[size=default]:h-9">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex grow justify-end text-sm whitespace-nowrap md:w-full">
          <p className=" text-sm whitespace-nowrap" aria-live="polite">
            <span className="text-primary">
              {(page - 1) * limit + 1}-{Math.min(page * limit, total)}
            </span>{" "}
            of <span className="text-primary">{total}</span>
          </p>
        </div>

        <div className="mx-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  aria-label="Go to first page"
                  aria-disabled={page === 1}
                  onClick={() => handlePageChange(1)}
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  aria-label="Go to previous page"
                  aria-disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  aria-label="Go to next page"
                  aria-disabled={page >= Math.ceil(total / limit)}
                  onClick={() => handlePageChange(page + 1)}
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  aria-label="Go to last page"
                  aria-disabled={page >= Math.ceil(total / limit)}
                  onClick={() => handlePageChange(Math.ceil(total / limit))}
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};
