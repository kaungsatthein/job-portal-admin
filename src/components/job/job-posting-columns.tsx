"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "../column-header";
import { JobPosting } from "@/api-config/services/job-postings";
import { JobPostingActions } from "./job-posting-actions";
import { JobPostingStatus } from "./job-posting-status";

const formatLabel = (value?: string) => {
  if (!value) return "-";
  return value
    .replace(/[_-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export const jobPostingColumns: ColumnDef<JobPosting>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Title" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-sm text-center font-medium">{row.original.title}</p>
      );
    },
  },
  {
    id: "company",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Company" />;
    },
    cell: ({ row }) => {
      const companyName =
        row.original.company?.name || row.original.companyId || "-";
      return <p className="text-center text-sm">{companyName}</p>;
    },
  },
  {
    accessorKey: "jobType",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Type" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-center text-sm">
          {formatLabel(String(row.original.jobType))}
        </p>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Location" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-center text-sm">{row.original.location || "-"}</p>
      );
    },
  },
  {
    accessorKey: "salaryRange",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Salary Range" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-center text-sm">{row.original.salaryRange || "-"}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      return <JobPostingStatus jobPosting={row.original} />;
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
      return <JobPostingActions jobPosting={row.original} />;
    },
  },
];
