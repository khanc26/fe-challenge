import { cn } from "@/utils/cn";

type DropDownProps = {
  selectedItem: number | "all";
  setSelectedItem: (value: number | "all") => void;
  options: (number | "all")[];
  className?: string;
};

export default function DropDown({
  selectedItem,
  setSelectedItem,
  options,
}: DropDownProps) {
  return (
    <div>
      <label htmlFor="select" className="mr-4">
        Choose an option:
      </label>
      <select
        id="select"
        className={cn(
          "border-[1px] border-slate-500 p-2 rounded min-w-10 md:min-w-16 max-w-16 md:max-w-20"
        )}
        value={selectedItem}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "all") {
            setSelectedItem(value);
          } else setSelectedItem(Number(e.target.value));
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
