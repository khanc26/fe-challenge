import { cn } from "@/utils/cn";

type TBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export default function TBody({ children, className }: TBodyProps) {
  return <tbody className={cn("", className)}>{children}</tbody>;
}
