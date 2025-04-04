export type SortDirection = "asc" | "desc" | null;

export interface ColumnRef<T> {
  key: keyof T;
  header: string | (() => React.ReactNode);
  assessor: (row: T) => React.ReactNode;
  cell?: (row: T) => React.ReactNode; // Custom cell or not
  description?: string;
  enableSorting: boolean;
  enableFiltering: boolean;
}
