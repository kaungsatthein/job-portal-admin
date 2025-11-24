import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { HTMLAttributes } from "react";

interface ColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export const ColumnHeader = <TData, TValue>({
  column,
  title,
  className,
}: ColumnHeaderProps<TData, TValue>) => {
  return (
    <p className={cn("text-primary px-4 font-medium text-center", className)}>
      {title}
    </p>
  );
};
