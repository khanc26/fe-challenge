import { cn } from "@/utils/cn";

type TRowProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export default function TRow({ children, className, id }: TRowProps) {
  return (
    <tr id={id} className={cn("", className)}>
      {children}
    </tr>
  );
}
