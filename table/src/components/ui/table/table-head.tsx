import { cn } from "@/utils/cn";

type THeadProps = {
  children: React.ReactNode;
  className?: string;
};

export default function THead({ children, className }: THeadProps) {
  return (
    <th className={cn("bg-white dark:bg-slate-800 p-4 w-auto", className)}>
      {children}
    </th>
  );
}
