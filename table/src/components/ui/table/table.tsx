import { cn } from "@/utils/cn";

type TableProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Table({ children, className }: TableProps) {
  return (
    <table className={cn("w-full table-auto", className)}>{children}</table>
  );
}
