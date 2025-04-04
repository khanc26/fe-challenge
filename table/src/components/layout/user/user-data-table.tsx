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
import { TUser } from "@/interfaces/User";
import { cn } from "@/utils/cn";
import { useMemo, useState } from "react";

type UserDataTableProps = {
  data: TUser[];
  columns: ColumnRef<TUser>[];
  className?: string;
};

export default function UserDataTable({
  data,
  columns: rawColumns,
  className,
}: UserDataTableProps) {
  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortDirection>(null);
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  // const [filterColumnKey, setFilterColumnKey] = useState<string | null>(null);
  // const [filterValue, setFilterValue] = useState<string>("");

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

  // Sort logic
  const sortedData = useMemo(() => {
    if (!sortColumnKey || !sortOrder) return data;

    const sortColumn = columns.find((col) => col.key === sortColumnKey);
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const valueA = sortColumn.assessor(a);
      const valueB = sortColumn.assessor(b);

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      return sortOrder === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [data, sortColumnKey, sortOrder, columns]);

  // Filter logic

  // Pagination logic
  const { totalItems, totalPages, paginatedData } = useMemo(() => {
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + perPage);

    return { totalItems, totalPages, paginatedData };
  }, [sortedData, page, perPage]);

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
                  <THead key={column.key}>
                    {typeof column.header === "function"
                      ? column.header()
                      : column.header}
                  </THead>
                );
              })}
            </TRow>
          </THeader>
          <TBody>
            {paginatedData.map((row) => (
              <TRow key={row.id}>
                {columns.map((col) => (
                  <TCell key={col.key as string} className={cn("last:w-[1%]")}>
                    {col.assessor(row)}
                  </TCell>
                ))}
              </TRow>
            ))}
          </TBody>
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
