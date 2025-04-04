import { ColumnRef } from "@/core/table/type";

export default function initialColumns<T>(
  columns: ColumnRef<T>[],
  sortColumnKey: string | null,
  sortOrder: "asc" | "desc" | null,
  setSortColumnKey: (key: string | null) => void,
  setSortOrder: (order: "asc" | "desc" | null) => void
) {
  const handleSort = (column: ColumnRef<T>) => {
    if (!column.enableSorting) return;

    if (sortColumnKey === column.key) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortColumnKey(column.key as string);
      setSortOrder("asc");
    }
  };

  const processedColumns: ColumnRef<T>[] = columns.map((column) => {
    const isSorted = sortColumnKey === column.key && sortOrder !== null;
    const sortDirection = isSorted ? sortOrder : undefined;

    return {
      ...column,
      header: column.enableSorting
        ? () => (
            <button
              className="flex items-center gap-2 hover:cursor-pointer"
              onClick={() => handleSort(column)}
            >
              {typeof column.header === "function"
                ? column.header()
                : column.header || "Test"}
              {isSorted ? (
                <span>{sortDirection === "desc" ? "↓" : "↑"}</span>
              ) : (
                <span>{"↕"}</span>
              )}
            </button>
          )
        : column.header,
    };
  });

  return processedColumns;
}
