"use client";

// import FilterInput from "@/components/ui/table/filter-input";
import Table from "@/components/ui/table/table";
import TBody from "@/components/ui/table/table-body";
import TCell from "@/components/ui/table/table-cell";
import THead from "@/components/ui/table/table-head";
import THeader from "@/components/ui/table/table-header";
import TablePagination from "@/components/ui/table/table-pagination";
import TRow from "@/components/ui/table/table-row";
import initialColumns from "@/core/table/helpers";
import { ColumnRef, SortDirection } from "@/core/table/type";
import { cn } from "@/utils/cn";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Key, useCallback, useEffect, useMemo, useState } from "react";

type WithId = { id: string | number };

type DataTableProps<T extends WithId> = {
  data: T[];
  columns: ColumnRef<T>[];
  className?: string;
  totalItems: number;
};

export default function DataTable<T extends WithId>({
  data,
  totalItems,
  columns: rawColumns,
  className,
}: DataTableProps<T>) {
  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortDirection>(null);
  const [perPage, setPerPage] = useState<number | "all">(10);
  const [page, setPage] = useState<number>(1);
  // const [filterColumnKey, setFilterColumnKey] = useState<string | null>(null);
  // const [filterValue, setFilterValue] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQuery = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    updateQuery({
      sort: sortColumnKey,
      order: sortOrder,
      page: page,
      perPage: perPage,
    });
  }, [sortColumnKey, sortOrder, page, perPage, updateQuery]);

  // useEffect(() => {
  //   updateQuery("filterCol", filterColumnKey);
  // }, [filterColumnKey, updateQuery]);

  // useEffect(() => {
  //   updateQuery("filterVal", filterValue || null);
  // }, [filterValue, updateQuery]);

  const columns = useMemo(
    () =>
      initialColumns(
        rawColumns,
        sortColumnKey,
        sortOrder,
        setSortColumnKey,
        setSortOrder
      ),
    [rawColumns, sortColumnKey, sortOrder]
  );

  const totalPages = useMemo(() => {
    if (perPage !== "all") {
      return Math.ceil(totalItems / perPage);
    } else return 1;
  }, [totalItems, perPage]);

  // Sort logic
  // const sortedData = useMemo(() => {
  //   if (!sortColumnKey || !sortOrder) return data;

  //   const sortColumn = columns.find((col) => col.key === sortColumnKey);
  //   if (!sortColumn) return data;

  //   return [...data].sort((a, b) => {
  //     const valueA = sortColumn.assessor(a);
  //     const valueB = sortColumn.assessor(b);

  //     if (typeof valueA === "number" && typeof valueB === "number") {
  //       return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
  //     }

  //     return sortOrder === "asc"
  //       ? String(valueA).localeCompare(String(valueB))
  //       : String(valueB).localeCompare(String(valueA));
  //   });
  // }, [data, sortColumnKey, sortOrder, columns]);

  // Filter logic

  // Pagination logic

  return (
    <div className="w-full">
      <div
        className={cn(
          "overflow-x-auto p-2 flex flex-col justify-center",
          className
        )}
      >
        {/* <FilterInput
          filter
        /> */}
        {/* Table */}
        <Table>
          <THeader>
            <TRow>
              {columns.map((column) => {
                return (
                  <THead key={column.key as Key}>
                    {typeof column.header === "function"
                      ? column.header()
                      : column.header}
                  </THead>
                );
              })}
            </TRow>
          </THeader>
          {data.length > 0 ? (
            <TBody>
              {data.map((row) => (
                <TRow key={row.id}>
                  {columns.map((col) => (
                    <TCell
                      key={col.key as string}
                      className={cn("last:w-[1%]")}
                    >
                      {col.assessor(row)}
                    </TCell>
                  ))}
                </TRow>
              ))}
            </TBody>
          ) : (
            <TBody>
              <TRow>
                <TCell
                  colSpan={columns.length}
                  className="!text-center py-10 md:py-20 font-semibold text-slate-400 text-sm md:text-base"
                >
                  No result
                </TCell>
              </TRow>
            </TBody>
          )}
        </Table>
      </div>

      {/* Table Pagination */}
      <TablePagination
        setPerPage={setPerPage}
        setPage={setPage}
        totalItems={totalItems}
        perPage={perPage}
        page={page}
        totalPages={totalPages}
        className="text-xs md:text-sm lg:text-base"
      />
    </div>
  );
}
