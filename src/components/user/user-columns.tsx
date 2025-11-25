"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "../column-header";
import { User } from "@/api-config/services/user";
import { UserStatus } from "./user-status";

const formatLabel = (value?: string | null | number) => {
  if (value === null || value === undefined || value === "") return "-";
  const normalized = typeof value === "string" ? value : String(value);
  return normalized
    .replace(/[_-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      const name = row.original.name || "-";
      const email = row.original.email;
      return (
        <div className="text-center">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      );
    },
  },
  {
    id: "role",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Role" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-center text-sm">
          {formatLabel(row.original.role) || "-"}
        </p>
      );
    },
  },
  {
    id: "status",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      return <UserStatus user={row.original} />;
    },
  },
  {
    id: "provider",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Provider" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-center text-sm">
          {formatLabel(row.original.provider)}
        </p>
      );
    },
  },
  {
    id: "emailVerified",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Verified" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-center text-sm">
          {row.original.emailVerified ? "Yes" : "No"}
        </p>
      );
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
];
