import { useState, useEffect } from "react";

type FilterInputProps = {
  className?: string;
  filterColumnKey: string | null;
  setFilterColumnKey: (value: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  columnList: string[];
  debounceDelay?: number;
  resetTable: () => void;
};

export default function FilterInput({
  className,
  filterColumnKey,
  setFilterColumnKey,
  filterValue,
  setFilterValue,
  columnList,
  debounceDelay = 1000,
  resetTable,
}: FilterInputProps) {
  const [inputValue, setInputValue] = useState(filterValue);

  // Delay before updating filter value in url
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterValue(inputValue);
      resetTable();
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, debounceDelay, setFilterValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      className={`flex flex-row items-center gap-4 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border ${className}`}
    >
      {/* Dropdown select */}
      <select
        value={filterColumnKey ?? ""}
        onChange={(e) => {
          resetTable();
          setFilterColumnKey(e.target.value);
        }}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
      >
        <option value="" disabled>
          Select column
        </option>
        {columnList.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>

      {/* Input filter value */}
      <input
        type="text"
        placeholder="Enter filter value..."
        value={inputValue}
        onChange={handleInputChange}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
      />
    </div>
  );
}
