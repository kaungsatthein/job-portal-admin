"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "../column-header";
import { Industry } from "@/api-config/services/industry";
import { IndustryActions } from "./industry-action";

export const industryColumns: ColumnDef<Industry>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-primary hover:text-primary-600 text-sm text-center">
          {row.original.name}
        </p>
      );
    },
  },
  // {
  //   accessorKey: "companies",
  //   header: ({ column }) => {
  //     return <ColumnHeader column={column} title="Company Name" />;
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <p className="text-primary text-center">
  //         {row.original.companies?.map((company) => company.name)}
  //       </p>
  //     );
  //   },
  // },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Contract Status" />;
    },
    cell: ({ row: { original } }) => {
      return <p className="text-center">active</p>;
    },
  },

  {
    accessorKey: "action",
    header: ({ column }) => {
      return <ColumnHeader column={column} title="Action" />;
    },
    cell: ({ row }) => {
      return <IndustryActions industry={row.original} />;
    },
  },
];
