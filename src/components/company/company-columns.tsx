"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "../column-header";
import { Company } from "@/api-config/services/company";
import { CompanyStatus } from "./company-status";
import { CompanyActions } from "./company-actions";

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Company Name" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-sm text-center font-medium">{row.original.name}</p>
      );
    },
  },
  {
    id: "industry",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Industry" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-center text-sm">
          {row.original.industry?.name || "-"}
        </p>
      );
    },
  },
  {
    id: "recruiters",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Recruiters" />;
    },
    cell: ({ row }) => {
      const recruiterCount = row.original.recruiters?.length ?? 0;
      return <p className="text-center text-sm">{recruiterCount}</p>;
    },
  },
  {
    id: "jobPostings",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Job Postings" />;
    },
    cell: ({ row }) => {
      const postingCount = row.original.jobPostings?.length ?? 0;
      return <p className="text-center text-sm">{postingCount}</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      return <CompanyStatus company={row.original} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Created" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-center text-xs text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </p>
      );
    },
  },
  {
    id: "action",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Action" />;
    },
    cell: ({ row }) => {
      return <CompanyActions company={row.original} />;
    },
  },
];
