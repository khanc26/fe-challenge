import { cn } from "@/utils/cn";

type TCellProps = {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
};

export default function TCell({ children, className, colSpan }: TCellProps) {
  return (
    <td
      className={cn(
        "bg-[#f5fafa] dark:bg-slate-500 p-1 md:p-4 w-auto max-w-40 truncate",
        className
      )}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}
