"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "./column-header";
import { Industry } from "@/api-config/services/industry";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import {
  useDeleteIndustry,
  useUpdateIndustry,
} from "@/api-config/queries/industry";

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

interface IndustryActionsProps {
  industry: Industry;
}

const IndustryActions = ({ industry }: IndustryActionsProps) => {
  const [open, setOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [name, setName] = useState(industry.name);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { mutateAsync: deleteIndustry, isPending: isDeleting } =
    useDeleteIndustry();
  const { mutateAsync: updateIndustry, isPending: isUpdating } =
    useUpdateIndustry();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isEditDialogOpen) {
      setName(industry.name);
    }
  }, [industry.name, isEditDialogOpen]);

  const handleEdit = () => {
    setName(industry.name);
    setIsEditDialogOpen(true);
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteIndustry(industry.id);
    } catch (error) {
      console.error("Failed to delete industry:", error);
    } finally {
      setOpen(false);
    }
  };

  const handleUpdateIndustry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    try {
      await updateIndustry({
        industryId: industry.id,
        payload: { name: name.trim() },
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update industry:", error);
    }
  };

  return (
    <>
      <div ref={containerRef} className=" flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        {open ? (
          <div className="bg-popover text-popover-foreground absolute right-0 top-8 z-10 w-52 rounded-md border shadow-md">
            <p className="text-muted-foreground border-b px-3 py-2 text-xs font-semibold">
              Actions
            </p>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
              Edit industry
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-muted disabled:opacity-60"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete industry"}
            </button>
          </div>
        ) : null}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit industry</DialogTitle>
            <DialogDescription>
              Update the industry name and save your changes.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateIndustry}>
            <div className="space-y-2">
              <Label htmlFor={`industry-${industry.id}`}>Industry name</Label>
              <Input
                id={`industry-${industry.id}`}
                placeholder="e.g. Information Technology"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isUpdating}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
