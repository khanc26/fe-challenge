import { cn } from "@/utils/cn";

type THeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export default function THeader({ children, className }: THeaderProps) {
  return <thead className={cn("", className)}>{children}</thead>;
}
