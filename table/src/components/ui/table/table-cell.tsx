import { cn } from "@/utils/cn";

type TCellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function TCell({ children, className }: TCellProps) {
  return (
    <td
      className={cn(
        "bg-[#f5fafa] dark:bg-slate-500 p-1 md:p-4 w-auto max-w-40 truncate",
        className
      )}
    >
      {children}
    </td>
  );
}
