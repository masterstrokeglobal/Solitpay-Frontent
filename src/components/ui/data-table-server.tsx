"use client";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/error-boundary";
import Pagination from "./table-pagination";
import { Skeleton } from "./skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showOptions?: boolean;
  hideFilterButton?: boolean;
  hideColumnsInMobile?: boolean;
  totalPage: number;
  page?: number;
  loading?: boolean;
  showSearch?: boolean;
  changePage: (page: number) => void;
  showHeader?: boolean;
  children?: ReactNode;
  className?: string;
  rowClassName?: string;
  setSelectedRows?: (data: any) => void;
}

export default function DataTable<TData, TValue>({
  columns,
  totalPage,
  data,
  page = 0,
  rowClassName,
  className,
  showHeader = true,
  changePage,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: 25,
  });

  useEffect(() => {
    changePage(pagination.pageIndex + 1);
  }, [pagination]);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    enableGlobalFilter: true,
    state: { pagination: pagination },
    pageCount: totalPage,
    onPaginationChange: setPagination,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className={cn("bg-white/10 border border-white/20 rounded-xl overflow-hidden backdrop-blur-md shadow-lg", className)}>
        <Table>
          {showHeader && (
            <TableHeader className="px-4">
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-white/20 hover:bg-white/5 transition-colors"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-sm text-white font-medium whitespace-nowrap py-4">
                      <span className="flex font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody className="px-4">
            {!loading &&
              (table?.getRowModel().rows?.length ? (
                table?.getRowModel().rows.map((row) => (
                  <TableRow
                    className={cn("h-14 border-b border-white/10 hover:bg-white/5 transition-colors", rowClassName)}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row?.getVisibleCells().map((cell) => (
                      <ErrorBoundary key={cell.id}>
                        <TableCell className="text-white py-4">
                          {flexRender(
                            cell?.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      </ErrorBoundary>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-white/50">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-white/70 hover:bg-transparent"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              ))}

            {loading && (
              <>
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i} className="border-b border-white/10">
                      {columns.map((column, j) => (
                        <TableCell key={j} className="py-4">
                          <Skeleton className="h-6 w-full bg-white/20" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
        <div className="flex md:items-center flex-wrap border-t border-white/20 py-4 px-4 bg-white/5 backdrop-blur-sm w-full justify-between">
          <div className="py-1 min-h-[60px] md:px-4 items-center flex flex-row w-fit justify-between gap-2">
            <p className="text-white/70">Showing</p>
            <div className="flex flex-col items-center gap-3 text-white">
              {page}-{totalPage}
            </div>
            <div>
              <span className="text-white/70">of</span>
              &nbsp; <span className="text-white">{totalPage}</span>
            </div>
          </div>
          <Pagination
            page={page}
            changePage={changePage}
            totalPage={totalPage}
            className="md:ml-auto"
          />
        </div>
      </div>
    </div>
  );
}
