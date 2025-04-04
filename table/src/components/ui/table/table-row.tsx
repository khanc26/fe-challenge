import { cn } from "@/utils/cn";

type TRowProps = {
  children: React.ReactNode;
  className?: string;
};

export default function TRow({ children, className }: TRowProps) {
  return <tr className={cn("", className)}>{children}</tr>;
}
