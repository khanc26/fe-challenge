import { cn } from "@/utils/cn";
import { Infinity } from "lucide-react";

type InfiniteScrollToggleprops = {
  className?: string;
  toggle: () => void;
  infiniteScroll: boolean;
  resetTable: () => void;
};

export default function InfiniteScrollToggle({
  className,
  toggle,
  infiniteScroll,
  resetTable,
}: InfiniteScrollToggleprops) {
  return (
    <button
      title="Infinite scroll toggle"
      className={cn(
        "text-black border rounded-full p-2",
        className,
        infiniteScroll ? "bg-green-300" : "bg-slate-500"
      )}
      onClick={() => {
        resetTable();
        toggle();
      }}
    >
      <Infinity />
    </button>
  );
}
