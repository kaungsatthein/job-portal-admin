"use client";

import type React from "react";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        className={cn("pl-10", className)}
        type="search"
        placeholder="Search..."
        {...props}
      />
    </div>
  );
}
