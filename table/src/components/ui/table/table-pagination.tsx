import { ArrowLeft, ArrowRight } from "lucide-react";
import DropDown from "../dropdown";
import { cn } from "@/utils/cn";

type TablePaginationProps = {
  perPage: number;
  page: number;
  totalItems: number | null;
  totalPages: number;
  setPerPage: (value: number) => void;
  setPage: (value: number) => void;
  className?: string;
};

const options = [5, 10, 20, 50, 100];

export default function TablePagination({
  perPage = 10,
  setPerPage,
  page = 1,
  setPage,
  totalItems,
  totalPages,
  className,
}: TablePaginationProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row justify-between items-start md:items-center px-2 md:px-8 my-4",
        className
      )}
    >
      {/* Total results */}
      <div>{totalItems + " result(s)"}</div>

      <div className="flex flex-row gap-2">
        {/* Select number of page displayed per page */}
        <DropDown
          options={options}
          selectedItem={perPage}
          setSelectedItem={setPerPage}
        />

        {/* Previous button */}
        <button
          className="px-3 py-1 rounded disabled:opacity-50"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ArrowLeft />
        </button>

        {/* Current Page */}
        <div className="flex flex-row justify-center items-center">
          {page} / {totalPages}
        </div>

        {/* Next button */}
        <button
          className="px-3 py-1 rounded disabled:opacity-50"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
