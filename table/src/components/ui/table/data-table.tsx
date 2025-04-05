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
import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
import FilterInput from "./filter-input";
import InfiniteScrollToggle from "@/components/layout/infinite-scroll-toggle";

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
  const [dataList, setDataList] = useState<T[]>([]);
  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortDirection>(null);
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [filterColumnKey, setFilterColumnKey] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [infiniteScroll, setInfiniteScroll] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (infiniteScroll) {
      setDataList((prev) => {
        const newList = [...prev, ...data];
        return newList;
      });
    } else {
      setDataList([...data]);
    }
  }, [data]);

  // Reset table whenever filtering or sorting is performed
  const resetTable = () => {
    setPage(1);
    setDataList([]);
  };

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
      filter: filterColumnKey,
      filterVal: filterValue,
      infinite: `${infiniteScroll}`,
    });
  }, [
    sortColumnKey,
    sortOrder,
    page,
    perPage,
    filterColumnKey,
    filterValue,
    updateQuery,
    infiniteScroll,
  ]);

  // Detect when the last row is in view (for infinite scroll)
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && infiniteScroll) {
        setPage((prevPage) => prevPage + 1); // Increment page to load more
      }
    };

    // Initialize IntersectionObserver
    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: "200px", // Trigger before it's completely in view
    });

    const lastRow = document.querySelector("#lastRow"); // Get the last row element
    if (lastRow && observerRef.current) {
      observerRef.current.observe(lastRow); // Start observing
    }

    return () => {
      if (observerRef.current && lastRow) {
        observerRef.current.unobserve(lastRow); // Clean up the observer
      }
    };
  }, [dataList, infiniteScroll]);

  const columns = useMemo(
    () =>
      initialColumns(
        rawColumns,
        sortColumnKey,
        sortOrder,
        setSortColumnKey,
        setSortOrder,
        resetTable
      ),
    [rawColumns, sortColumnKey, sortOrder]
  );

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / perPage);
  }, [totalItems, perPage]);

  const hasMore = useMemo(() => {
    return page < totalPages;
  }, [page, totalPages]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col p-2 gap-4 md:flex-row justify-between items-end md:items-center">
        <FilterInput
          columnList={columns.map((column) => {
            return column.key as string;
          })}
          filterColumnKey={filterColumnKey}
          setFilterColumnKey={setFilterColumnKey}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          resetTable={resetTable}
        />
        <InfiniteScrollToggle
          infiniteScroll={infiniteScroll}
          toggle={() => setInfiniteScroll((prevVal) => !prevVal)}
          resetTable={resetTable}
        />
      </div>

      <div
        className={cn(
          "overflow-x-auto p-2 flex flex-col justify-center",
          className
        )}
      >
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
          {dataList.length > 0 ? (
            <TBody>
              {dataList.map((row) => (
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
              {infiniteScroll && hasMore && (
                <TRow id="lastRow">
                  <TCell colSpan={columns.length}>{""}</TCell>
                </TRow>
              )}
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
      {!infiniteScroll && (
        <TablePagination
          setPerPage={setPerPage}
          setPage={setPage}
          totalItems={totalItems}
          perPage={perPage}
          page={page}
          totalPages={totalPages}
          className="text-xs md:text-sm lg:text-base"
        />
      )}
    </div>
  );
}
